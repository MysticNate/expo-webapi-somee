import React, { useContext, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { UserContext } from "../../UserContext";

export default function Cart() {
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        if (user && user.isAdmin) {
            router.replace("/DrawerDir/(tabs)/items");
        }
    }, [user]);

    // cart items from user context
    let cartItems = [];
    if (user && user.cart) {
        cartItems = user.cart;
    }

    // calculate total price
    let totalPrice = 0;
    for (let item of cartItems) {
        totalPrice += item.price * item.quantity;
    }

    // remove item from cart
    const removeItem = (id) => {
        if (!user) return;

        const updatedCart = cartItems.filter((item) => item.id !== id);
        setUser({ ...user, cart: updatedCart });
    };

    // change item quantity
    const changeQuantity = (id, amount) => {
        if (!user) return;

        const updatedCart = cartItems
            .map((item) => {
                if (item.id === id) {
                    const newQuantity = item.quantity + amount;
                    // remove item if quantity would be zero or less
                    if (newQuantity <= 0) {
                        return null;
                    }
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
            .filter((item) => item !== null);
        setUser({ ...user, cart: updatedCart });
    };

    // checkout
    const checkout = () => {
        if (cartItems.length === 0) {
            Alert.alert("Your cart is empty");
            return;
        }

        Alert.alert(
            "Checkout",
            `Total: $${totalPrice.toFixed(2)}. Complete purchase?`,
            [
                { text: "Cancel" },
                {
                    text: "Yes",
                    onPress: () => {
                        setUser({ ...user, cart: [] });
                        Alert.alert("Purchase complete!");
                    },
                },
            ]
        );
    };

    // render cart item
    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={item.image} style={styles.itemImage} />

            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

                <View style={styles.quantityControls}>
                    <TouchableOpacity
                        onPress={() => changeQuantity(item.id, -1)}
                    >
                        <Feather name="minus-circle" size={24} color="tomato" />
                    </TouchableOpacity>

                    <Text style={styles.quantity}>{item.quantity}</Text>

                    <TouchableOpacity
                        onPress={() => changeQuantity(item.id, 1)}
                    >
                        <Feather name="plus-circle" size={24} color="tomato" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Feather name="trash-2" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

    // empty cart
    if (cartItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Feather name="shopping-cart" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Your cart is empty</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Cart</Text>

            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />

            <View style={styles.footer}>
                <Text style={styles.totalText}>
                    Total:{" "}
                    <Text style={styles.totalPrice}>
                        ${totalPrice.toFixed(2)}
                    </Text>
                </Text>

                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={checkout}
                    >
                        <Text style={styles.buttonText}>Checkout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        padding: 15,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 18,
        color: "#666",
        marginTop: 10,
    },
    list: {
        padding: 10,
    },
    cartItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    itemPrice: {
        fontSize: 14,
        color: "tomato",
    },
    quantityControls: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    quantity: {
        paddingHorizontal: 10,
        fontSize: 16,
    },
    footer: {
        backgroundColor: "#fff",
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    totalText: {
        fontSize: 18,
        marginBottom: 15,
    },
    totalPrice: {
        fontWeight: "bold",
        color: "tomato",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cameraButton: {
        flexDirection: "row",
        backgroundColor: "#5c6bc0",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flex: 1,
        marginRight: 10,
        justifyContent: "center",
    },
    checkoutButton: {
        backgroundColor: "#4caf50",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 5,
    },
});
