import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";
import { COLORS } from "@/constants/colors";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const router = useRouter();

  const doSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: doSignOut },
    ]);
  };

  return (
    <TouchableOpacity
      className="p-2.5 rounded-full bg-app-card"
      onPress={handleSignOut}
    >
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  );
};
