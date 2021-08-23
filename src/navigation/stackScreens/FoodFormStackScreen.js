import React, { useContext, Fragment } from "react"
import dynamic from "next/dynamic"
import { createStackNavigator } from "@react-navigation/stack"
import { AuthContext } from "../../context/userContext"
import Loading from "../Loading"


const FOODADD_SCREEN = {
    Additems: dynamic(() => import("../../screens/add/Additems"), {
        loading: () => Loading(),
        ssr: false
    }),
    Emptyfoodaddscreen: dynamic(() => import("../../screens/add/emptyfoodaddscreen"), {
        loading: () => Loading(),
        ssr: false
    }),
    AddPost: dynamic(() => import("../../screens/add/AddPost"), {
        loading: () => Loading(),
        ssr: false
    }),
    SelectChoice: dynamic(() => import("../../screens/add/SelectChoice"), {
        loading: () => Loading(),
        ssr: false
    }),
}
const FoodFormStack = createStackNavigator()

const FoodFormStackScreen = () => {
    const { state } = useContext(AuthContext)
    return (
        <FoodFormStack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            {!state.isLogin ? (
                <FoodFormStack.Screen
                    name='Emptyfoodaddscreen'
                    component={FOODADD_SCREEN.Emptyfoodaddscreen}
                />
            ) : (
                <Fragment>
                    <FoodFormStack.Screen name='SelectChoice' component={FOODADD_SCREEN.SelectChoice} />
                    <FoodFormStack.Screen name='AddFood' component={FOODADD_SCREEN.Additems} />
                    <FoodFormStack.Screen name='AddPost' component={FOODADD_SCREEN.AddPost} />
                </Fragment>
            )}
        </FoodFormStack.Navigator>
    )
}

export default FoodFormStackScreen