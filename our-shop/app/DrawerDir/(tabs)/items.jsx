import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Alert
} from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";
import { UserContext } from "../../UserContext";


export default function Items() {
    const { user, setUser, products } = useContext(UserContext);
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);

     useEffect(() => {
          if (!user && user.isAdmin) {
              router.replace("/DrawerDir/(tabs)/items");
          }
      }, [user]);

    useEffect(() => {
        
        if (user && !user.cart) {
            setUser({ ...user, cart: [] });
        }

        // location permission and get location 
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

    // add item to cart
    const addToCart = (product) => {
        const cart = user.cart || [];

        // check if product already in cart
        const existingItem = cart.find((item) => item.id === product.id);

        let updatedCart;
        if (existingItem) {
            // increase quantity if product is already in cart
            updatedCart = cart.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            // add new product to cart with quantity 1
            updatedCart = [...cart, { ...product, quantity: 1 }];
        }

        // update user context with new cart
        setUser({ ...user, cart: updatedCart });
        Alert.alert("Success", `Added ${product.name} to cart!`);
    };

    // render each product
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
                <Text style={styles.title}>Shop Items</Text>
                {address ? (
                    <Text style={styles.locationText}>Location: {address}</Text>
                ) : location ? (
                    <Text style={styles.locationText}>
                        Location: {location.coords.latitude.toFixed(4)},
                        {location.coords.longitude.toFixed(4)}
                    </Text>
                ) : null}
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
    addButton: {
        backgroundColor: "tomato",
        padding: 8,
        borderRadius: 5,
        alignItems: "center",
        alignSelf: "flex-start",
    },
    addButtonText: {
        color: "white",
        fontWeight: "600",
    },
});
