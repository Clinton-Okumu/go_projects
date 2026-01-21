import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppText from "@/components/ui/AppText";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        Alert.alert("Success", "Signed in successfully.", [
          {
            text: "Continue",
            onPress: () => router.replace("/(app)/home"),
          },
        ]);
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Password is incorrect. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
    >
      <View className="flex-1 bg-app-bg px-5 justify-center">
        <Image
          source={require("../../assets/images/img1.png")}
          style={{ height: 310, width: 300, resizeMode: "contain", alignSelf: "center" }}
        />
        <AppText variant="title" className="my-4">Welcome Back</AppText>

        {error ? (
          <View className="bg-red-100 p-3 rounded-lg border-l-4 border-danger mb-4 flex-row items-center">
            <Ionicons name="alert-circle" size={20} color="#EF5350" />
            <AppText className="ml-2 flex-1 text-sm">{error}</AppText>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color="#4FC3F7" />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextField
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email or username"
          onChangeText={(v) => setEmailAddress(v)}
          error={Boolean(error)}
        />

        <View className="relative mt-4">
          <TextField
            value={password}
            placeholder="Enter password"
            secureTextEntry={!showPassword}
            onChangeText={(v) => setPassword(v)}
            error={Boolean(error)}
            className="pr-14"
          />
          <TouchableOpacity
            className="absolute right-3 top-0 bottom-0 justify-center w-11 items-center"
            onPress={() => setShowPassword((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#4FC3F7"
            />
          </TouchableOpacity>
        </View>

        <View className="mt-5">
          <Button title="Sign In" onPress={onSignInPress} />
        </View>

        <View className="flex-row justify-center items-center gap-2 mt-5">
          <AppText>{"Don't have an account?"}</AppText>

          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <AppText variant="link">Sign up</AppText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
