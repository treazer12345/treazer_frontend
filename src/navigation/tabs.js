import React, { useContext } from "react"
import { useNavigation } from "@react-navigation/native"
import { View } from "react-native"
import { Badge } from "react-native-elements"
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs"
import { CartContext } from "../context/cartContext"

import ProfileStackScreen from "./stackScreens/ProfileStackScreen"
import CartStackScreen from "./stackScreens/CartStackScreen"
import SocialStackScreen from "./stackScreens/SocialStackScreen"
import RestaurantStackScreen from "./stackScreens/RestaurantStackScreen"
import FoodFormStackScreen from "./stackScreens/FoodFormStackScreen"
import TabBarCustomButton from "./TabBarCustomButton"

const Tab = createBottomTabNavigator()

const CustomTabBar = props => {
  return <BottomTabBar {...props.props} />
}

const Tabs = () => {
  const { state: cartState } = useContext(CartContext)
  const navigation = useNavigation()
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          position: "absolute",
          left: 0,
          bottom: 0,
          right: 0,
          borderTopWidth: 0,
          backgroundColor: "transparent",
          elevation: 0
        }
      }}
      tabBar={props => <CustomTabBar props={props} />}>
      <Tab.Screen
        name='Social'
        component={SocialStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <svg
              aria-hidden='true'
              focusable='false'
              data-prefix='fas'
              data-icon='house-user'
              className='svg-inline--fa fa-house-user fa-w-18'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 576 512'
              width={24}
              height={24}
              onClick={() => navigation.navigate("Social", { screen: "SocialHome" })}
            >
              <path
                fill={focused ? "#ffffff" : "#00A7FF"}
                d='M570.69,236.27,512,184.44V48a16,16,0,0,0-16-16H432a16,16,0,0,0-16,16V99.67L314.78,10.3C308.5,4.61,296.53,0,288,0s-20.46,4.61-26.74,10.3l-256,226A18.27,18.27,0,0,0,0,248.2a18.64,18.64,0,0,0,4.09,10.71L25.5,282.7a21.14,21.14,0,0,0,12,5.3,21.67,21.67,0,0,0,10.69-4.11l15.9-14V480a32,32,0,0,0,32,32H480a32,32,0,0,0,32-32V269.88l15.91,14A21.94,21.94,0,0,0,538.63,288a20.89,20.89,0,0,0,11.87-5.31l21.41-23.81A21.64,21.64,0,0,0,576,248.19,21,21,0,0,0,570.69,236.27ZM288,176a64,64,0,1,1-64,64A64,64,0,0,1,288,176ZM400,448H176a16,16,0,0,1-16-16,96,96,0,0,1,96-96h64a96,96,0,0,1,96,96A16,16,0,0,1,400,448Z'></path>
            </svg>
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />
        }}
      />
      <Tab.Screen
        name='Home'
        component={RestaurantStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <svg
              aria-hidden='true'
              focusable='false'
              data-prefix='fas'
              data-icon='utensils'
              className='svg-inline--fa fa-utensils fa-w-13'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 416 512'
              width={24}
              height={24}
              onClick={() => navigation.navigate("Home", { screen: "Index" })}
            >
              <path
                fill={focused ? "#ffffff" : "#00A7FF"}
                d='M207.9 15.2c.8 4.7 16.1 94.5 16.1 128.8 0 52.3-27.8 89.6-68.9 104.6L168 486.7c.7 13.7-10.2 25.3-24 25.3H80c-13.7 0-24.7-11.5-24-25.3l12.9-238.1C27.7 233.6 0 196.2 0 144 0 109.6 15.3 19.9 16.1 15.2 19.3-5.1 61.4-5.4 64 16.3v141.2c1.3 3.4 15.1 3.2 16 0 1.4-25.3 7.9-139.2 8-141.8 3.3-20.8 44.7-20.8 47.9 0 .2 2.7 6.6 116.5 8 141.8.9 3.2 14.8 3.4 16 0V16.3c2.6-21.6 44.8-21.4 48-1.1zm119.2 285.7l-15 185.1c-1.2 14 9.9 26 23.9 26h56c13.3 0 24-10.7 24-24V24c0-13.2-10.7-24-24-24-82.5 0-221.4 178.5-64.9 300.9z'></path>
            </svg>
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />
        }}
      />
      <Tab.Screen
        name='AddItem'
        component={FoodFormStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <svg
              aria-hidden='true'
              focusable='false'
              data-prefix='far'
              data-icon='plus-square'
              className='svg-inline--fa fa-plus-square fa-w-14'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 448 512'
              width={24}
              height={24}
            >
              <path
                fill={focused ? "#ffffff" : "#00A7FF"}
                d='M352 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12zm96-160v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-48 346V86c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v340c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z'></path>
            </svg>
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />
        }}
      />
      <Tab.Screen
        name='Cart'
        component={CartStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <svg
                aria-hidden='true'
                focusable='false'
                data-prefix='fas'
                data-icon='shopping-basket'
                className='svg-inline--fa fa-shopping-basket fa-w-18'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 576 512'
                width={24}
                height={24}>
                <path
                  fill={focused ? "#ffffff" : "#00A7FF"}
                  d='M576 216v16c0 13.255-10.745 24-24 24h-8l-26.113 182.788C514.509 462.435 494.257 480 470.37 480H105.63c-23.887 0-44.139-17.565-47.518-41.212L32 256h-8c-13.255 0-24-10.745-24-24v-16c0-13.255 10.745-24 24-24h67.341l106.78-146.821c10.395-14.292 30.407-17.453 44.701-7.058 14.293 10.395 17.453 30.408 7.058 44.701L170.477 192h235.046L326.12 82.821c-10.395-14.292-7.234-34.306 7.059-44.701 14.291-10.395 34.306-7.235 44.701 7.058L484.659 192H552c13.255 0 24 10.745 24 24zM312 392V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm112 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm-224 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24z'></path>
              </svg>

              {cartState && cartState.cartItems && (
                <Badge
                  status='error'
                  value={cartState.cartItems.cartItem.length}
                  containerStyle={{ position: "absolute", top: -4, right: -4 }}
                />
              )}
            </View>
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />
        }}
      />

      <Tab.Screen
        name='User'
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <svg
              aria-hidden='true'
              focusable='false'
              data-prefix='fas'
              data-icon='user'
              className='svg-inline--fa fa-user fa-w-14'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 448 512'
              width={24}
              height={24}
            >
              <path
                fill={focused ? "#ffffff" : "#00A7FF"}
                d='M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z'></path>
            </svg>
          ),
          tabBarButton: props => <TabBarCustomButton {...props} />
        }}
      />
    </Tab.Navigator>
  )
}

export default Tabs
