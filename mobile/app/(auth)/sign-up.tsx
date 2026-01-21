import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppText from "@/components/ui/AppText";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!emailAddress.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        username,
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      Alert.alert(
        "Check your email",
        "We sent a verification code to your email address.",
        [{ text: "OK" }]
      );

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("That email address is already in use. Please try another.");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.log(err);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        Alert.alert("Success", "Account created successfully.", [
          {
            text: "Continue",
            onPress: () => router.replace("/(app)/home"),
          },
        ]);
      } else {
        // User is verified, but sign-up is not complete (e.g. missing fields)
        const missing = (signUpAttempt as any)?.missingFields;
        if (Array.isArray(missing) && missing.includes("username")) {
          setPendingVerification(false);
          setError("Please choose a username to continue.");
        } else {
          setError("Sign up is not complete. Please try again.");
        }
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(err);
      setError("Verification failed. Please try again.");
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-app-bg px-5 justify-center items-center">
        <AppText variant="subtitle" className="mb-5">
          Verify your email
        </AppText>

        {error ? (
          <View className="bg-red-100 p-3 rounded-lg border-l-4 border-danger mb-4 flex-row items-center w-full">
            <Ionicons name="alert-circle" size={20} color="#EF5350" />
            <AppText className="ml-2 flex-1 text-sm">{error}</AppText>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color="#4FC3F7" />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextField
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(v) => setCode(v)}
          error={Boolean(error)}
          className="text-center tracking-widest"
        />

        <View className="mt-2 w-full">
          <Button title="Verify" onPress={onVerifyPress} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View className="flex-1 bg-app-bg px-5 justify-center">
        <Image
          source={require("../../assets/images/img1.png")}
          style={{ height: 310, width: 300, resizeMode: "contain", alignSelf: "center" }}
        />

        <AppText variant="title" className="my-4">Create Account</AppText>

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
          value={username}
          placeholder="Choose username"
          onChangeText={(v) => setUsername(v)}
          error={Boolean(error)}
        />

        <View className="mt-4">
          <TextField
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            onChangeText={(v) => setEmailAddress(v)}
            error={Boolean(error)}
          />
        </View>

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
          <Button title="Sign Up" onPress={onSignUpPress} />
        </View>

        <View className="flex-row justify-center items-center gap-2 mt-5">
          <AppText>Already have an account?</AppText>
          <TouchableOpacity onPress={() => router.back()}>
            <AppText variant="link">Sign in</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
