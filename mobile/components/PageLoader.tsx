import { ActivityIndicator, View } from "react-native";

const PageLoader = () => {
    return (
        <View className="flex-1 items-center justify-center bg-app-bg">
            <ActivityIndicator size="large" color="#0277BD" />
        </View>
    );
};
export default PageLoader;
