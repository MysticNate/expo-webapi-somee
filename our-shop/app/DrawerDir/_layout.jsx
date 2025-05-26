import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const CustomDrawerContent = (props) => {
    const { user, setUser } = useContext(UserContext);

    const handleLogout = () => {
        setUser(null);
        router.replace("/");
    };

    return (
        <DrawerContentScrollView {...props}>
            <Text style={{ padding: 16, fontWeight: "bold", fontSize: 16 }}>
                SHOP MENU
            </Text>

            <DrawerItem
                label="Items"
                onPress={() => router.push("/DrawerDir/(tabs)/items")}
                icon={({ color, size }) => (
                    <Feather name="shopping-bag" size={size} color={color} />
                )}
            />
            {user && user.isAdmin ? ( // if user is admin, show add item option else show cart
                <DrawerItem
                    label="Add Item"
                    onPress={() => router.push("/DrawerDir/(tabs)/additem")}
                    icon={({ color, size }) => (
                        <Feather name="plus-circle" size={size} color={color} />
                    )}
                />
            ) : (
                <DrawerItem
                    label="Cart"
                    onPress={() => router.push("/DrawerDir/(tabs)/cart")}
                    icon={({ color, size }) => (
                        <Feather
                            name="shopping-cart"
                            size={size}
                            color={color}
                        />
                    )}
                />
            )}
            
            <DrawerItem
                label="Profile"
                onPress={() => router.push("/DrawerDir/(tabs)/profile")}
                icon={({ color, size }) => (
                    <Feather name="user" size={size} color={color} />
                )}
            />

            <View
                style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#ddd",
                    margin: 8,
                }}
            >
                <Text style={{ textAlign: "center", color: "#999" }}>
                    ──────────
                </Text>
            </View>

            <DrawerItem
                label="Logout"
                onPress={handleLogout}
                icon={({ color, size }) => (
                    <Feather name="log-out" size={size} color={color} />
                )}
            />
        </DrawerContentScrollView>
    );
};

export default function DrawerLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: true,
                    headerTitle: "Big Shop",
                    headerTintColor: "#fff",
                    headerStyle: { backgroundColor: "red" },
                }}
            />
        </GestureHandlerRootView>
    );
}
