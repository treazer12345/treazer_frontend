import React, { useContext, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { View, Dimensions } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import Loading from "../Loading"
import { CartContext } from "../../context/cartContext"
import { getCartItems } from "../../functions/cartfunction"

const { height } = Dimensions.get('window')

const CART_SCREEN = {
    Cart: dynamic(() => import("../../screens/cart/cart"), {
        loading: () => Loading(),
        ssr: false
    }),
    Emptycartscreen: dynamic(() => import("../../screens/cart/emptycartscreen"), {
        loading: () => Loading(),
        ssr: false
    }),
}

const CartStack = createStackNavigator()

const CartStackScreen = () => {
    const { state, dispatch } = useContext(CartContext)
    const user = JSON.parse(localStorage.getItem("user"))
    const id = user && user._id
    const [cartReq, setCartReq] = useState(true)
    useEffect(() => {
        if (!user || state.cartItems === null) {
            getCartItems(id, dispatch, setCartReq)
        }
    }, [])
    return (
        <CartStack.Navigator
            screenOptions={{
                headerShown: false
            }}
        // initialRouteName={"CartItem"}
        >
            {state &&
                state.cartItems !== null &&
                state.cartItems.cartItem.length !== 0 &&
                state.cartItems.userId.toString() === id.toString() ? (
                <CartStack.Screen
                    name='CartItem'
                    component={props => (
                        <View
                            style={{
                                height,
                                backgroundColor: "#ffffff",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                            {cartReq ? (
                                <CART_SCREEN.Cart {...props} />
                            ) : (
                                <Loading />
                            )}
                        </View>
                    )}
                />
            ) : (
                <CartStack.Screen
                    name='EmptyCart'
                    component={CART_SCREEN.Emptycartscreen}
                />
            )}
        </CartStack.Navigator>
    )
}

export default CartStackScreen