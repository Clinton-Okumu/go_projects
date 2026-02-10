import { COLORS } from "@/constants/colors";
import { ActivityIndicator, View } from "react-native";

const PageLoader = () => {
    return (
        <View className="flex-1 items-center justify-center bg-app-bg">
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );
};
export default PageLoader;
