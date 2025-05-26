import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
    TextInput,
} from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { UserContext } from "../../UserContext";

export default function AddItem() {
    const { user, products, setProducts } = useContext(UserContext);
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [newItem, setNewItem] = useState({
        name: "",
        price: "",
        image: null,
    });

    // Check if user is admin
    useEffect(() => {
        if (!user?.isAdmin) {
            router.replace("/DrawerDir/(tabs)/items");
        }
    }, [user]);

    // Get location
    useEffect(() => {
        async function getLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
                let addressInfo = await Location.reverseGeocodeAsync(
                    location.coords
                );
                if (addressInfo.length > 0) {
                    const addr = addressInfo[0];
                    const readableAddress = `${addr.name}, ${addr.city}, ${addr.region}, ${addr.country}`;
                    setAddress(readableAddress);
                }
            }
        }
        getLocation();
    }, []);

    // Handle camera
    const takeItemPicture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Error", "Camera permission is required");
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            console.log("Camera Image URI:", result.assets[0].uri);
            setNewItem({ ...newItem, image: result.assets[0].uri });
        }
    };

    // Handle gallery
    const pickFromGallery = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Error", "Gallery access is required");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            console.log("Gallery Image URI:", result.assets[0].uri);
            setNewItem({ ...newItem, image: result.assets[0].uri });
        }
    };

    // Ask user: camera or gallery
    const chooseImageSource = () => {
        Alert.alert("Add Image", "Choose image source", [
            { text: "Camera", onPress: takeItemPicture },
            { text: "Gallery", onPress: pickFromGallery },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    // Add new item
    const addNewItem = () => {
        if (!newItem.name || !newItem.price || !newItem.image) {
            Alert.alert("Error", "Please fill all fields and add an image");
            return;
        }

        const price = parseFloat(newItem.price);
        if (isNaN(price) || price <= 0) {
            Alert.alert("Error", "Please enter a valid price");
            return;
        }

        const newProduct = {
            id: products.length + 1,
            name: newItem.name,
            price,
            image: newItem.image,
        };

        setProducts((prev) => [...prev, newProduct]);
        setNewItem({ name: "", price: "", image: null });
        Alert.alert("Success", `${newItem.name} added to shop!`);
    };

    const renderProduct = ({ item }) => (
        <View style={styles.productCard}>
            <Image
                source={
                    typeof item.image === "string"
                        ? { uri: item.image }
                        : item.image
                }
                style={styles.productImage}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                    ${item.price.toFixed(2)}
                </Text>

                {!user?.isAdmin && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToCart(item)}
                    >
                        <Text style={styles.addButtonText}>Add to Cart</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Manage Items</Text>
                {address ? (
                    <Text style={styles.locationText}>Location: {address}</Text>
                ) : location ? (
                    <Text style={styles.locationText}>
                        Location: {location.coords.latitude.toFixed(4)},
                        {location.coords.longitude.toFixed(4)}
                    </Text>
                ) : null}
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Item Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter item name"
                    value={newItem.name}
                    onChangeText={(text) =>
                        setNewItem({ ...newItem, name: text })
                    }
                />

                <Text style={styles.label}>Price</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter price"
                    value={newItem.price}
                    onChangeText={(text) =>
                        setNewItem({ ...newItem, price: text })
                    }
                    keyboardType="numeric"
                />

                <TouchableOpacity
                    style={styles.pictureButton}
                    onPress={chooseImageSource}
                >
                    <Feather name="camera" size={20} color="white" />
                    <Text style={styles.pictureButtonText}>Add Photo</Text>
                </TouchableOpacity>

                {newItem.image && (
                    <Image
                        source={{ uri: newItem.image }}
                        style={styles.previewImage}
                    />
                )}

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={addNewItem}
                >
                    <Text style={styles.saveButtonText}>Add Item</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        paddingTop: 20,
    },
    header: {
        padding: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    locationText: {
        fontSize: 12,
        color: "#666",
    },
    list: {
        padding: 10,
    },
    productCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: {
        width: 120,
        height: 120,
        marginBottom: 8,
    },
    productInfo: {
        flex: 1,
        padding: 12,
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    productPrice: {
        fontSize: 15,
        color: "tomato",
        fontWeight: "bold",
        marginVertical: 5,
    },
    form: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 15,
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        color: "#333",
        marginBottom: 5,
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 5,
        marginBottom: 20,
        fontSize: 16,
    },
    pictureButton: {
        flexDirection: "row",
        backgroundColor: "tomato",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        alignSelf: "flex-start",
        marginBottom: 20,
    },
    pictureButtonText: {
        color: "white",
        marginLeft: 5,
        fontWeight: "600",
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: "#4caf50",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
