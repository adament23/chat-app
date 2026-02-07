import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";


function useSocialAuth() { 
    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
    const { startSSOFlow } = useSSO();

    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
        setLoadingStrategy(strategy);
        try {
            const {createdSessionId, setActive} = await startSSOFlow({strategy});
            if(createdSessionId &&  setActive) {
                await setActive({session: createdSessionId});
            }
        } catch (error) {
            console.log("Error during social auth:", error);
            const provider = strategy === "oauth_google" ? "Google" : "Apple";
            Alert.alert("Authentication Error", `Failed to authenticate with ${provider}. Please try again.`);
        } finally {
          setLoadingStrategy(null);
        }
    }

    return {
        handleSocialAuth,
        loadingStrategy,
    }
}


export default useSocialAuth;