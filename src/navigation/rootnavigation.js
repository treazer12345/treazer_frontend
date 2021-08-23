import React, { useState, useEffect, useContext } from "react"
import { Platform } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import dynamic from "next/dynamic"
import Loading from "./Loading"

const Tabs = dynamic(() => import("./tabs"), {
  loading: () => <Loading />,
  ssr: false
})
import { createStackNavigator } from "@react-navigation/stack"
import Constants from "expo-constants"
import * as Location from "expo-location"
import axios from "axios"
import { config } from "./config"
import * as Linking from "expo-linking"
import { NotificationContext } from "../context/notificationContext"
import { LocationContext } from "../context/locationcontext"
import { getNotifications } from "../functions/notificationfunction"
import { getUserPosts } from "../functions/postfunction"
import { PostContext } from "../context/postContext"
import { AuthContext } from "../context/userContext"

const Stack = createStackNavigator()

const prefix = Linking.createURL("/")
const linking = {
  // prefixes: ["https://treazer.com"],
  prefixes: [prefix],

  config
}

const Rootnavigation = () => {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const { dispatch: locationDispatch } = useContext(LocationContext)

  useEffect(() => {
    ; (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android emulator. Try it on your device!"
        )
        return
      }
      let { status } = await Location.requestPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }

      let address = await Location.getCurrentPositionAsync({})
      setLocation(address)
      axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${address?.coords.longitude},${address?.coords.latitude}.json?country=IN&access_token=pk.eyJ1IjoidHJlYXplciIsImEiOiJja2xxYXJsZmgwMmJwMnBtaXR0M25leTY5In0.Iaj3HteMWU5ZQWCniy4KRA`
        )
        .then(res => {
          const { features } = res.data
          // console.log(features[0].place_name);
          // console.log(features[1].properties.address);
          locationDispatch({
            type: "SET_LOCATION_ADDRESS",
            payload: {
              landmark: features[0].properties.address ?
                features[0].properties.address : features[0].place_name.split(",")[1],
              locality: features[0].place_name.split(",")[0]
            }
          })
        })
        .catch(err => console.log(err))
      locationDispatch({
        type: "SET_LOCATION",
        payload: {
          latitude: address.coords.latitude,
          longitude: address.coords.longitude
        }
      })
    })()
  }, [])

  let text = "Waiting.."
  if (errorMsg) {
    text = errorMsg
    console.log(text)
  } else if (location) {
    text = JSON.stringify(location)
    localStorage.setItem("location", text)
  }
  const { dispatch: notiDispatch } = useContext(NotificationContext)
  const { state: postState, dispatch: postDispatch } = useContext(PostContext)
  const { state: userState } = useContext(AuthContext)

  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user && user._id
  const resturantId = user && user.resturantId?._id
  useEffect(() => {
    if (userId) {
      getNotifications(userId, resturantId, notiDispatch)
    }
    if (postState?.myPosts?.length === 0 && userState?.isLogin) {
      getUserPosts(postDispatch)
    }
  }, [userId])

  return (
    <NavigationContainer
      linking={linking}
      fallback={<Loading />}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name='home' component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Rootnavigation
