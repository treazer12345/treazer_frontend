import React, { useContext } from "react"

const PROFILE_SCREEN = {
    About: dynamic(() => import("../screens/proile/about"), {
        loading: () => Loading(),
        ssr: false
    }),
    Privecypolicy: dynamic(() => import("../screens/proile/privecypolicy"), {
        loading: () => Loading(),
        ssr: false
    }),
    Refundpolicy: dynamic(() => import("../screens/proile/refundpolicy"), {
        loading: () => Loading(),
        ssr: false
    }),
    ProfileBio: dynamic(() => import("../screens/proile/ProfileBio"), {
        loading: () => Loading(),
        ssr: false
    }),
    Profile: dynamic(() => import("../screens/proile/profile"), {
        loading: () => Loading(),
        ssr: false
    }),
    MyRestaurent: dynamic(() => import("../screens/proile/myrestaurent"), {
        loading: () => Loading(),
        ssr: false
    }),
    Myrestaurentfoodlist: dynamic(() => import("../screens/proile/myrestaurentfoodlist"), {
        loading: () => Loading(),
        ssr: false
    }),
    Orderist: dynamic(() => import("../screens/proile/orderist"), {
        loading: () => Loading(),
        ssr: false
    }),
    Mybill: dynamic(() => import("../screens/proile/mybill"), {
        loading: () => Loading(),
        ssr: false
    }),
    Businessform: dynamic(() => import("../screens/proile/businessform"), {
        loading: () => Loading(),
        ssr: false
    }),

}

import { createStackNavigator } from "@react-navigation/stack"
import { AuthContext } from "../context/userContext"

const ProfileStack = createStackNavigator()

const ProfileStackScreen = () => {
    const { state } = useContext(AuthContext)

    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            {!state.isLogin ? (
                <ProfileStack.Screen
                    name='Login'
                    component={PROFILE_SCREEN.Profile}
                />
            ) : (
                <>
                    <ProfileStack.Screen name='Profile' component={PROFILE_SCREEN.ProfileBio} />
                    <ProfileStack.Screen name='BusinessForm' component={PROFILE_SCREEN.Businessform} />
                    <ProfileStack.Screen name='MyRestaurent' component={PROFILE_SCREEN.MyRestaurent} />
                    <ProfileStack.Screen name='MyMenu' component={PROFILE_SCREEN.Myrestaurentfoodlist} />
                    <ProfileStack.Screen name='MyOrder' component={PROFILE_SCREEN.Orderist} />
                </>
            )}
            <ProfileStack.Screen name='About' component={PROFILE_SCREEN.About} />
            <ProfileStack.Screen name='PrivecyPolicy' component={PROFILE_SCREEN.Privecypolicy} />
            <ProfileStack.Screen name='RefundPolicy' component={PROFILE_SCREEN.Refundpolicy} />
            <ProfileStack.Screen name='MyBill' component={PROFILE_SCREEN.Mybill} />
        </ProfileStack.Navigator>
    )
}

export default ProfileStackScreen