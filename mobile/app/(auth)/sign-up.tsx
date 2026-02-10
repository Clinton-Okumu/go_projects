import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Image, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppText from "@/components/ui/AppText";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { COLORS } from "@/constants/colors";

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
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, translate]);

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
    } catch (err: any) {
      if (err?.errors?.[0]?.code === "form_identifier_exists") {
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
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(err);
      setError("Verification failed. Please try again.");
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-app-bg px-5 justify-center">
        <Animated.View
          style={{ opacity: fade, transform: [{ translateY: translate }] }}
        >
          <View className="bg-brand/10 border border-brand/10 rounded-3xl p-4 overflow-hidden">
          <View pointerEvents="none" className="absolute -top-16 -right-20 w-56 h-56 rounded-full bg-white/50" />

          <AppText className="text-[24px] font-bold text-app-text">Verify your email</AppText>
          <AppText className="mt-1 text-[12px] text-app-muted">
            Enter the 6-digit code we sent to your inbox.
          </AppText>
        </View>

          <View className="mt-6 bg-app-card border border-app-border rounded-3xl p-5 shadow-sm">
            {error ? (
              <View className="bg-danger/10 p-3 rounded-2xl border border-danger/30 mb-4 flex-row items-center">
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
              <AppText className="ml-2 flex-1 text-[12px] text-danger">{error}</AppText>
              <TouchableOpacity onPress={() => setError("")}> 
                <Ionicons name="close" size={18} color={COLORS.primary} />
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

          <View className="mt-4">
            <Button title="Verify" onPress={onVerifyPress} />
          </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View className="flex-1 bg-app-bg px-5 pt-10">
        <Animated.View
          style={{ opacity: fade, transform: [{ translateY: translate }] }}
        >
          <View className="bg-brand/10 border border-brand/10 rounded-3xl p-4 overflow-hidden">
          <View pointerEvents="none" className="absolute -top-16 -right-20 w-56 h-56 rounded-full bg-white/50" />

          <View className="flex-row items-center justify-between">
            <View className="px-3 py-1 rounded-full bg-app-card border border-app-border">
              <AppText className="text-[11px] uppercase tracking-wider text-app-muted font-semibold">
                ClintFit
              </AppText>
            </View>
          </View>

          <View className="mt-4 flex-row items-center">
            <View className="flex-1 pr-3">
              <AppText className="text-[26px] font-bold text-app-text">Create Account</AppText>
              <AppText className="mt-1 text-[12px] text-app-muted">
                Set up your profile to start tracking workouts.
              </AppText>
            </View>
            <Image
              source={require("../../assets/images/img1.png")}
              style={{ height: 110, width: 110, resizeMode: "contain" }}
            />
          </View>
        </View>

          <View className="mt-6 bg-app-card border border-app-border rounded-3xl p-5 shadow-sm">
            {error ? (
              <View className="bg-danger/10 p-3 rounded-2xl border border-danger/30 mb-4 flex-row items-center">
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
              <AppText className="ml-2 flex-1 text-[12px] text-danger">{error}</AppText>
              <TouchableOpacity onPress={() => setError("")}> 
                <Ionicons name="close" size={18} color={COLORS.primary} />
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
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          <View className="mt-5">
            <Button title="Sign Up" onPress={onSignUpPress} />
          </View>
          </View>

          <View className="flex-row justify-center items-center gap-2 mt-6">
            <AppText>Already have an account?</AppText>
            <TouchableOpacity onPress={() => router.back()}>
              <AppText variant="link">Sign in</AppText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </KeyboardAwareScrollView>
  );
}
