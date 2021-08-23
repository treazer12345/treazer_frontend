import React, { useEffect, useContext, useState } from "react"
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native"
import { Icon, Avatar } from "react-native-elements"
import { Portal, Dialog } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { singleUser } from "../../functions/userfunction"
import { AuthContext } from "../../context/userContext"
import { RestaurentContext } from "../../context/restaurentContext"
import { LocationContext } from "../../context/locationcontext"
import Profilelist from "./profilelist"
import * as ImagePicker from "expo-image-picker"
const { width, height } = Dimensions.get("window")
import "react-lazy-load-image-component/src/effects/blur.css"
import Refresh from "../refresh"
import * as PusherPushNotifications from "@pusher/push-notifications-web"
import { OrderContext } from "../../context/ordercontext"
import GridContent from "./GridContent"
import axios from "axios"
import BASE_URL from "../../api"

const ProfileBio = ({ route }) => {
  const navigation = useNavigation()
  // console.log(route);
  //GLOBAL USER-STATE SETUP
  const { state, dispatch } = useContext(AuthContext)
  const { dispatch: restaurantDispatch } =
    useContext(RestaurentContext)
  const { state: locationState } = useContext(LocationContext)
  const { dispatch: orderDispatch } = useContext(OrderContext)
  //GET USER && TOKEN FROM LOCAL-STORAGE
  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user && user._id

  const token = localStorage.getItem("token")
  const refreshtoken = localStorage.getItem("refresh-token")

  //GET SINGLE USER
  useEffect(() => {
    if (!state.user) {
      singleUser(userId, token, refreshtoken, dispatch, navigation)
    }
  }, [])

  const beamsClient = new PusherPushNotifications.Client({
    instanceId: "36674458-c456-44a3-823b-616088fa88e1"
  })

  //LOG-OUT
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh-token")
    restaurantDispatch({ type: "REMOVE_MY_RESTAURANT" })
    orderDispatch({ type: "REMOVE_ORDERS" })
    dispatch({ type: "LOGOUT_USER" })
    beamsClient.clearAllState()
      .then(() => {
        console.log('Beams state has been cleared')
        dispatch({ type: "BEAM_TOKEN_CLEAR" })
      })
      .catch(e => console.error('Could not clear Beams state', e));
    // beamsClient
    //   .clearDeviceInterests()
    //   .then(() => console.log("Device interests have been cleared"))
    //   .catch(e => console.error("Could not clear Beams state", e))
  }
  //image upload
  const [imgReq, setimgReq] = useState(true)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    })
    console.log(result)
    if (!result.cancelled) {
      let data = {
        file: result.uri,
        upload_preset: "treazer",
        api_key: 489227552964764
      }
      setimgReq(false)
      fetch("https://api.cloudinary.com/v1_1/treazer/image/upload", {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      })
        .then(res => res.json())
        .then(data1 => {
          const photo = `https://res.cloudinary.com/treazer/image/upload/ar_720:1024,c_fill/c_scale,q_30,w_auto,dpr_auto/${data1.secure_url.split("/")[6]
            }/${data1.secure_url.split("/")[7].split(".")[0]}.webp`

          axios
            .post(
              `${BASE_URL}/api/user/uploadprofilepic`,
              { photo },
              {
                headers: {
                  // Authorization: `Bearer ${token}`,
                  "x-token": token,
                  "x-refresh-token": refreshtoken
                }
              }
            )
            .then(res => {
              const { user: userWithpic, msg } = res.data
              console.log(msg, userWithpic)
              dispatch({ type: "USER_PROFILE", payload: userWithpic })
            })
            .catch(err => {
              console.log(err)
            })

          setimgReq(true)
        })
        .catch(err => {
          console.log(err)
          alert("An Error Occured While Uploading")
        })
    }
  }

  const [openProfilePic, setopenProfilePic] = useState(false)
  const closeProfilePicDialog = () => setopenProfilePic(false)

  return (
    <Refresh>
      <View style={styles.container}>
        {state.user ? (
          <View
            style={{
              width: "100%",
              height: height * 0.95
            }}>
            <ScrollView style={styles.div_1}>
              <View style={styles.div_2}>
                <View style={styles.div_3}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Home", { screen: "Index" })
                    }>
                    <Icon
                      name='chevron-left'
                      type='font-awesome-5'
                      color='#757575'
                      size={20}
                      onPress={() =>
                        navigation.navigate("Home", { screen: "Index" })
                      }
                      containerStyle={{
                        marginLeft: 25
                      }}
                    />
                  </TouchableOpacity>
                  <Profilelist logout={logout} route={route} />
                </View>

                <Text style={styles.text_1}>My Profile</Text>

                <View style={styles.div_5}>
                  {imgReq ? (
                    <Avatar
                      source={
                        state.user.photo
                          ? { uri: state.user.photo }
                          : "https://res.cloudinary.com/treazer/image/upload/v1625674774/logo/man_btyjgf.png"
                        // require("../../assets/icons/user.png")
                      }
                      size={80}
                      rounded
                      onPress={() => {
                        setopenProfilePic(true)
                      }}
                      activeOpacity={1}
                      renderPlaceholderContent={
                        <ActivityIndicator
                          size='small'
                          color='#ffffff'
                          style={{
                            margin: "auto"
                          }}
                        />
                      }>
                      <Avatar.Accessory
                        size='medium'
                        onPress={pickImage}
                        style={{
                          backgroundColor: "#bdbdbd",
                          width: 25,
                          height: 25,
                          borderRadius: 20
                        }}
                      />
                    </Avatar>
                  ) : (
                    <ActivityIndicator
                      size='large'
                      color='#82b1ff'
                      style={{
                        margin: "auto"
                      }}
                    />
                  )}

                  <Text style={styles.text_2}>{state.user.username}</Text>
                  <Text style={styles.text_3}>
                    {locationState.landmark?.slice(0, 20)}{"  "}{locationState.locality?.slice(0, 20)}
                  </Text>
                </View>
                <View style={styles.div_6}>
                  <View style={styles.div_7}>
                    <View style={styles.div_8}>
                      <View style={{ marginTop: 30 }}>
                        <Text style={styles.text_4}>Followers</Text>
                        <Text
                          style={{
                            letterSpacing: 1,
                            color: "#263238",
                            fontWeight: "bold",
                            textShadow: "1px 0 #263238"
                          }}>
                          {state.user?.followers?.length}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.div_8}>
                      <View style={{ marginTop: 30 }}>
                        <Text style={styles.text_4}>Followings</Text>
                        <Text
                          style={{
                            letterSpacing: 1,
                            color: "#263238",
                            fontWeight: "bold",
                            textShadow: "1px 0 #263238"
                          }}>
                          {state.user?.followings?.length}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.div_9}>
                <View style={styles.div_10}>
                  <Icon
                    name='cart-arrow-down'
                    type='font-awesome-5'
                    color='#757575'
                    onPress={() => navigation.navigate("MyOrder")}
                    containerStyle={{
                      width: 50,
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid #C9CCD1",
                      padding: "auto",
                      borderRadius: 30,
                      boxShadow: "1px 3px 6px 1px #C9CCD1"
                    }}
                  />

                  <Text style={styles.text_2}>My Order</Text>
                </View>
                <View style={styles.div_10}>
                  <Icon
                    name='receipt'
                    type='font-awesome-5'
                    color='#757575'
                    // onPress={() => navigation.navigate("User", { screen: "MyBill" })}
                    containerStyle={{
                      width: 50,
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid #C9CCD1",
                      padding: "auto",
                      borderRadius: 30,
                      boxShadow: "1px 3px 6px 1px #C9CCD1"
                    }}
                  />
                  <Text style={styles.text_2}>My Bill</Text>
                </View>
              </View>
              {/*{state.user.role === "resturant-owner" ||*/}
              {/*restaurentState.myRestaurent !== null ? (*/}
              {/*  <Button*/}
              {/*    title='View Business Profile'*/}
              {/*    onPress={() =>*/}
              {/*      navigation.navigate("MyRestaurent", {*/}
              {/*        id: state.user.resturantId._id*/}
              {/*      })*/}
              {/*    }*/}
              {/*    containerStyle={{*/}
              {/*      height: 50,*/}
              {/*      width: "90%",*/}
              {/*      paddingHorizontal: "auto",*/}
              {/*      marginHorizontal: "auto",*/}
              {/*      borderRadius: 20,*/}
              {/*      backgroundColor: "#29b6f6",*/}
              {/*      border: "1px solid #C9CCD1",*/}
              {/*      boxShadow: "1px 3px 6px 1px #C9CCD1",*/}
              {/*      elevation: 2*/}
              {/*    }}*/}
              {/*    buttonStyle={{*/}
              {/*      height: 50,*/}
              {/*      borderRadius: 20,*/}
              {/*      backgroundColor: "#29b6f6"*/}
              {/*    }}*/}
              {/*    titleStyle={{*/}
              {/*      // marginVertical: "auto",*/}
              {/*      marginHorizontal: "auto",*/}
              {/*      fontWeight: "bold",*/}
              {/*      color: "#ffffff",*/}
              {/*      letterSpacing: 3,*/}
              {/*      fontSize: width <= 320 && height <= 500 ? 15 : 18,*/}
              {/*      textShadow: "1px 0 #ffffff",*/}
              {/*      fontFamily: "Roboto Slab"*/}
              {/*    }}*/}
              {/*  />*/}
              {/*) : (*/}
              {/*  <TouchableOpacity*/}
              {/*    style={styles.button_1}*/}
              {/*    onPress={() => navigation.navigate("BusinessForm")}>*/}
              {/*    <Text*/}
              {/*      style={{*/}
              {/*        marginVertical: "auto",*/}
              {/*        marginHorizontal: "auto",*/}
              {/*        fontWeight: "bold",*/}
              {/*        color: "#ffffff",*/}
              {/*        letterSpacing: 3,*/}
              {/*        fontSize: 15,*/}
              {/*        textShadow: "1px 0 #ffffff"*/}
              {/*      }}>*/}
              {/*      Upgrade to business profile*/}
              {/*    </Text>*/}
              {/*  </TouchableOpacity>*/}
              {/*)}*/}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 20,
                  width: "100%"
                }}>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    marginBottom: 10,
                    fontWeight: "800",
                    letterSpacing: 1,
                    fontSize: 18,
                    fontFamily: "Open Sans",
                    color: "#455a64",
                    textShadow: "1px 0 #455a64"
                  }}>
                  Posts
                </Text>
                <GridContent route={route} />
              </View>
            </ScrollView>
          </View>
        ) : (
          <View
            style={{
              width: width * 0.8,
              height,
              justifyContent: "center",
              marginHorizontal: "auto",
              marginVertical: "auto",
              backgroundColor: "#ffffff",
              alignItems: "center"
            }}>
            <ActivityIndicator
              size='large'
              color='#82b1ff'
              style={{
                margin: "auto"
              }}
            />
          </View>
        )}
      </View>
      <Portal>
        <Dialog
          visible={openProfilePic}
          onDismiss={closeProfilePicDialog}
          style={{ justifyContent: "center" }}>
          <img
            src={state.user?.photo}
            style={{
              flex: 1
            }}
            alt={state.user?.username}
          />
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              height: 30,
              width: 30,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              backgroundColor: "#ffffff"
            }}>
            <Icon
              name='close'
              type='ionicon'
              color='#757575'
              size={24}
              onPress={closeProfilePicDialog}
            />
          </View>
          {/* <Icon
            name='times'
            type='font-awesome'
            color='#757575'
            size={24}
            onPress={closeProfilePicDialog}
            containerStyle={{
              position: "absolute",
              top: 10,
              right: 10
            }}
          /> */}
        </Dialog>
      </Portal>
    </Refresh>
  )
}

export default ProfileBio

const styles = StyleSheet.create({
  container: {
    height,
    backgroundColor: "#ffffff"
  },
  div_1: {
    marginTop: "30px",
    marginHorizontal: "auto",
    borderRadius: 20,
    width: "90%",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px 0 #cfd8dc, 0 6px 20px 0 #cfd8dc"
  },
  div_2: {
    width: "100%",
    height: height * 0.5,
    borderRadius: 20,
    boxShadow: "0 2px 4px 0 #cfd8dc, 0 3px 10px 0 #cfd8dc"
  },
  div_3: {
    height: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    width: "100%",
    letterSpacing: 2,
    alignItems: "center"
  },
  div_4: {
    marginVertical: 10,
    width: "100%",
    height: 30
  },
  div_5: {
    width: "100%",
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  div_6: {
    width: "100%",
    height: 100,
    alignItems: "center"
  },
  div_7: {
    width: "70%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  div_8: {
    textAlign: "center",
    alignItems: "center",
    height: 20
  },
  div_9: {
    flexDirection: "row",
    width: "100%",
    padding: 20,
    justifyContent: "space-around"
  },
  div_10: {
    textAlign: "center",
    justifyContent: "center"
  },
  text_1: {
    marginLeft: 25,
    marginBottom: 20,
    fontWeight: "bold",
    letterSpacing: 3,
    fontSize: 20,
    fontFamily: "Open Sans",
    color: "#455a64",
    textShadow: "1px 0 #455a64"
  },
  text_2: {
    marginTop: 15,
    fontWeight: "bold",
    letterSpacing: 1,
    fontSize: 15,
    fontFamily: "Open Sans",
    color: "#455a64",
    textShadow: "1px 0 #455a64",
    textAlign: "center"
  },
  text_3: {
    textAlign: "center",
    width: "70%",
    fontWeight: "bold",
    fontFamily: "Open Sans",
    color: "#b0bec5"
  },
  text_4: {
    // marginVertical: "auto",
    marginHorizontal: "auto",
    fontWeight: "400",
    fontFamily: "Open Sans",
    color: "#b0bec5",
    textShadow: "1px 0 #b0bec5",
    letterSpacing: 2
  },
  span_1: {
    letterSpacing: 1,
    marginLeft: 15,
    color: "#263238",
    fontWeight: "bold",
    textShadow: "1px 0 #263238"
  },
  image_1: {
    marginLeft: 20,
    height: 15,
    width: 15,
    backgroundColor: "#ffffff"
  },
  image_2: {
    marginRight: 20,
    height: 15,
    width: 15,
    backgroundColor: "#ffffff"
  },
  image_3: { width: 50, height: 50, marginTop: 10 },
  button_1: {
    height: 50,
    width: "90%",
    paddingHorizontal: "auto",
    marginHorizontal: "auto",
    borderRadius: 20,
    backgroundColor: "#29b6f6",
    border: "1px solid #C9CCD1",
    boxShadow: "1px 3px 6px 1px #C9CCD1",
    elevation: 2
  }
})
