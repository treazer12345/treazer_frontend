import React from "react"
import dynamic from "next/dynamic"
import { createStackNavigator } from "@react-navigation/stack"
import Loading from "../Loading"


const SOCIAL_SCREEN = {
    SocialHome: dynamic(() => import("../../screens/social/SocialHome"), {
        loading: () => Loading(),
        ssr: false
    }),
    PostDetails: dynamic(() => import("../../screens/social/PostDetails"), {
        loading: () => Loading(),
        ssr: false
    }),
    UserProfile: dynamic(() => import("../../screens/social/UserProfile"), {
        loading: () => Loading(),
        ssr: false
    }),
    Notification: dynamic(() => import("../../screens/notification/notification"), {
        loading: () => Loading(),
        ssr: false
    }),
}

const SocialStack = createStackNavigator()

const SocialStackScreen = () => {
    return (
        <SocialStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName={"SocialHome"}
        >
            <SocialStack.Screen name='SocialHome' component={SOCIAL_SCREEN.SocialHome} />
            <SocialStack.Screen name='Notification' component={SOCIAL_SCREEN.Notification} />
            <SocialStack.Screen name='PostDetails' component={SOCIAL_SCREEN.PostDetails} />
            <SocialStack.Screen name='FriendProfile' component={SOCIAL_SCREEN.UserProfile} />
        </SocialStack.Navigator>
    )
}

export default SocialStackScreen