import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Image, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppText from "@/components/ui/AppText";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { COLORS } from "@/constants/colors";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    } catch (err: any) {
      if (err?.errors?.[0]?.code === "form_password_incorrect") {
        setError("Password is incorrect. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
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
              <AppText className="text-[26px] font-bold text-app-text">Welcome Back</AppText>
              <AppText className="mt-1 text-[12px] text-app-muted">
                Pick up your training from where you left off.
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
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          <View className="mt-5">
            <Button title="Sign In" onPress={onSignInPress} />
          </View>
          </View>

          <View className="flex-row justify-center items-center gap-2 mt-6">
            <AppText>{"Don't have an account?"}</AppText>

            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <AppText variant="link">Sign up</AppText>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </View>
    </KeyboardAwareScrollView>
  );
}
