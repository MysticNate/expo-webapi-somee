import React, { useContext, useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView, 
} from "react-native";
import { UserContext } from "../../UserContext"; 
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        if (user) {
            if (user.email) {
                setEmail(user.email);
            }
            if (user.profilePicture) {
                
                setProfilePicture(user.profilePicture);
            }
        } else {
            
            router.replace("/");
        }
    }, [user]);

    const validateEmail = (emailToValidate) => {
        
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(emailToValidate);
    };

    const handleSave = async () => {
        if (!user || !user.Id) {
            Alert.alert("Error", "User data is missing. Please log in again.");
            return;
        }
        if (!email) {
            Alert.alert("Error", "Email can't be empty");
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert("Error", "Enter a valid email address");
            return;
        }
        if (newPassword && newPassword.length < 6) {
            Alert.alert("Error", "New password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match");
            return;
        }

       
        const payload = {
            Id: user.Id,
            email: email,
            isAdmin: user.isAdmin, 
            password: newPassword ? newPassword : user.password,
        };

        try {
            const response = await fetch(
                `https://Our-Shop.somee.com/api/Customer/${user.Id}`, // Corrected URL
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                Alert.alert("Success", "Profile updated!");
                
                setUser({
                    ...user,
                    email: email /* other fields if returned by API */,
                });
                setNewPassword(""); // Clear password fields
                setConfirmPassword("");
            } else {
                const errorData = await response
                    .json()
                    .catch(() => ({
                        message:
                            "Failed to update profile. Server response not JSON.",
                    }));
                Alert.alert(
                    "Error",
                    errorData.message || "Failed to update profile"
                );
                console.error("Update error:", errorData);
            }
        } catch (error) {
            Alert.alert(
                "Error",
                "Something went wrong while updating profile."
            );
            console.error("Network or other error:", error);
        }
    };

    const handleDelete = async () => {
        if (!user || !user.Id) {
            Alert.alert("Error", "User data is missing. Please log in again.");
            return;
        }

        Alert.alert(
            "Delete Profile",
            "Are you sure you want to delete your profile? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await fetch(
                                `https://Our-Shop.somee.com/api/Customer/${user.Id}`,
                                {
                                    method: "DELETE",
                                }
                            );

                            if (response.ok) {
                                Alert.alert(
                                    "Success",
                                    "Profile deleted successfully."
                                );
                                setUser(null); // Clear user from context
                                router.replace("/"); // Navigate to login or home screen
                            } else {
                                const errorData = await response
                                    .json()
                                    .catch(() => ({
                                        message:
                                            "Failed to delete profile. Server response not JSON.",
                                    }));
                                Alert.alert(
                                    "Error",
                                    errorData.message ||
                                        "Failed to delete profile."
                                );
                                console.error("Delete error:", errorData);
                            }
                        } catch (error) {
                            Alert.alert(
                                "Error",
                                "Something went wrong while deleting profile."
                            );
                            console.error(
                                "Network or other error during delete:",
                                error
                            );
                        }
                    },
                },
            ]
        );
    };

    // --- Profile Picture Logic (currently client-side only) ---
    const takeProfilePicture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission needed",
                "We need camera permission to take profile pictures."
            );
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
            
        }
    };

    const chooseFromGallery = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission needed",
                "We need media library permission to select pictures."
            );
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
            
        }
    };
    

    const handleLogout = () => {
        setUser(null);
        router.replace("/");
    };

    if (!user) {
        
        return (
            <View style={styles.container}>
                <Text>Loading user data or redirecting...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Profile</Text>
            </View>

            <View style={styles.profilePictureContainer}>
                {profilePicture ? (
                    <Image
                        source={{ uri: profilePicture }}
                        style={styles.profilePicture}
                    />
                ) : (
                    <View style={styles.profilePicturePlaceholder}>
                        <Feather name="user" size={60} color="#ccc" />
                    </View>
                )}
                <View style={styles.pictureButtons}>
                    <TouchableOpacity
                        style={styles.pictureButton}
                        onPress={takeProfilePicture}
                    >
                        <Feather name="camera" size={20} color="white" />
                        <Text style={styles.pictureButtonText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.pictureButton,
                            { backgroundColor: "#5c6bc0" },
                        ]}
                        onPress={chooseFromGallery}
                    >
                        <Feather name="image" size={20} color="white" />
                        <Text style={styles.pictureButtonText}>Gallery</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Text style={styles.label}>
                    New Password (leave blank to keep current)
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChangeText={setNewPassword} // Corrected state setter
                    secureTextEntry
                />

                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm new password"
                    value={confirmPassword} // Corrected state value
                    onChangeText={setConfirmPassword} // Corrected state setter
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.deleteButton} // Added new style for delete button
                onPress={handleDelete}
            >
                <Feather name="trash-2" size={20} color="white" />
                <Text style={styles.deleteButtonText}>Delete Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Feather name="log-out" size={20} color="white" />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
            <View style={{ height: 50 }} />
            {/* Add some padding at the bottom */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8" },
    header: {
        paddingTop: 50, // Adjusted for potential notch
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: "white",
        // If you want a shadow or border for the header
        // borderBottomWidth: 1,
        // borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
        textAlign: "center",
    },
    profilePictureContainer: {
        alignItems: "center",
        // marginTop: -50, // This can cause overlap issues if header size changes, consider removing or adjusting
        marginTop: 20, // Changed from negative margin
        marginBottom: 20,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: "white", // Make sure this contrasts with profilePictureContainer background if any
        backgroundColor: "#e0e0e0", // Placeholder background for the image itself
    },
    profilePicturePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#e0e0e0",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderColor: "white",
    },
    pictureButtons: { flexDirection: "row", marginTop: 15 },
    pictureButton: {
        flexDirection: "row",
        backgroundColor: "tomato", // Consider your app's theme color
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20, // More rounded buttons
        alignItems: "center",
        marginHorizontal: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    pictureButtonText: { color: "white", marginLeft: 8, fontWeight: "600" }, // Increased margin and weight
    form: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 15,
        marginTop: 10, // Ensure spacing from elements above
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Slightly more elevation
    },
    label: { fontSize: 16, color: "#333", marginBottom: 8, fontWeight: "600" }, // Increased bottom margin
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fdfdfd", // Slightly off-white for input
        paddingHorizontal: 15, // More horizontal padding
        paddingVertical: 12, // Standard vertical padding
        borderRadius: 8, // More rounded inputs
        marginBottom: 20,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "#4caf50", // Green for save
        paddingVertical: 15, // Standard padding
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10, // Space before button
    },
    saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },

    // Styles for Delete Button
    deleteButton: {
        flexDirection: "row",
        backgroundColor: "#d9534f", // A common red for delete
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 15,
        marginTop: 15, // Spacing from the form or save button
    },
    deleteButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },

    logoutButton: {
        flexDirection: "row",
        backgroundColor: "#f0ad4e", // Orange for logout/warning
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 15,
        marginTop: 15, // Spacing
        marginBottom: 30, // Space at the bottom
    },
    logoutButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});
