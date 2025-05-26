import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { UserContext } from "./UserContext";

export default function Register() {
    const { setUser, registeredUsers, setRegisteredUsers } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleRegister = () => {
        if (!email || !password || !confirm) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long");
            return;
        }
        if (password !== confirm) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        fetch("https://Our-Shop.somee.com/api/Customer/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
                isAdmin: false,
            }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                    router.push("/DrawerDir");
                } else {
                    Alert.alert(
                        "Error",
                        data.message || "Something went wrong"
                    );
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                console.log("Registration error:", error);
                Alert.alert("Error", error.message || "Registration failed");
            });
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

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

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                onChangeText={setConfirm}
                value={confirm}
                secureTextEntry
            />

            <Button title="Register" onPress={handleRegister} />

            <Text style={styles.link} onPress={() => router.push("/")}>
                Already have an account? Login here
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
