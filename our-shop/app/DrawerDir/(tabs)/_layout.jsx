import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useContext } from "react";
import { UserContext } from "../../UserContext";

export default function TabsLayout() {
    const { user } = useContext(UserContext);

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="items"
                options={{
                    tabBarLabel: "Items",
                    tabBarIcon: ({ color, size }) => (
                        <Feather
                            name="shopping-bag"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" size={size} color={color} />
                    ),
                }}
            />

            {user?.isAdmin ? (
                <Tabs.Screen
                    name="additem"
                    options={{
                        tabBarLabel: "Add Item",
                        tabBarIcon: ({ color, size }) => (
                            <Feather
                                name="plus-circle"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
            ) : (
                <Tabs.Screen
                    name="cart"
                    options={{
                        tabBarLabel: "Cart",
                        tabBarIcon: ({ color, size }) => (
                            <Feather
                                name="shopping-cart"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
            )}
        </Tabs>
    );
}
