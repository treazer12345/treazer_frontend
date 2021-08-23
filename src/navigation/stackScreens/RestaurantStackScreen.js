import React from "react"
import dynamic from "next/dynamic"
import { createStackNavigator } from "@react-navigation/stack"
import Loading from "../Loading"

const RESTAURANT_SCREEN = {
    Home: dynamic(() => import("../../screens/restaurant/Home"), {
        loading: () => Loading(),
        ssr: false
    }),
    Foodlist: dynamic(() => import("../../screens/restaurant/foodlist"), {
        loading: () => Loading(),
        ssr: false
    }),
    SingleRestaurent: dynamic(() => import("../../screens/restaurant/singleRestaurent"), {
        loading: () => Loading(),
        ssr: false
    }),
    FilterProduct: dynamic(() => import("../../screens/restaurant/filterProduct"), {
        loading: () => Loading(),
        ssr: false
    }),
    OrderDelivery: dynamic(() => import("../../screens/restaurant/OrderDelivery"), {
        loading: () => Loading(),
        ssr: false
    }),
    MapPage: dynamic(() => import("../../screens/restaurant/map"), {
        loading: () => Loading(),
        ssr: false
    }),
}

const RestaurantStack = createStackNavigator()

const RestaurantStackScreen = () => {
    return (
        <RestaurantStack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={"Index"}>
            <RestaurantStack.Screen name='Index' component={RESTAURANT_SCREEN.Home} />
            <RestaurantStack.Screen name='Filter_product' component={RESTAURANT_SCREEN.FilterProduct} />
            <RestaurantStack.Screen name='Menu' component={RESTAURANT_SCREEN.Foodlist} />
            <RestaurantStack.Screen name='Restaurant' component={RESTAURANT_SCREEN.SingleRestaurent} />
            <RestaurantStack.Screen name='Location' component={RESTAURANT_SCREEN.OrderDelivery} />
            <RestaurantStack.Screen name='UserLocation' component={RESTAURANT_SCREEN.MapPage} />
        </RestaurantStack.Navigator>
    )
}

export default RestaurantStackScreen