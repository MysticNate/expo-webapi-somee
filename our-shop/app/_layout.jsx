import { Stack } from "expo-router";
import UserContext from "./UserContext";

export default function Layout() {
    return (
        <UserContext>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="register" />
            </Stack>
        </UserContext>
    );
}
