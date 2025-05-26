import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { UserContext } from "./UserContext";

export default function Index() {
    const { setUser, registeredUsers } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // check if email is valid
    const checkEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // login
    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }
        if (!checkEmail(email)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }

        fetch("https://Our-Shop.somee.com/api/Customer/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((res) => {
                if (res.status === 200) return res.json();
                if (res.status === 204) {
                    Alert.alert("Error", "Incorrect email or password");
                    throw new Error();
                }
                throw new Error();
            })
            .then((data) => {
                setUser(data);
                router.push("/DrawerDir");
            })
            .catch(() => Alert.alert("Error", "Login failed"));
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />

            <Button title="Login" onPress={handleLogin} />

            <Text style={styles.link} onPress={() => router.push("/register")}>
                Don't have an account? Register here
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    link: { marginTop: 20, color: "blue", textAlign: "center" },
});
