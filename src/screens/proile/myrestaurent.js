import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import { RestaurentContext } from "../../context/restaurentContext";
const { width, height } = Dimensions.get("window");
import Axios from "axios";
import BASE_URL from "../../api";
import { OrderContext } from "../../context/ordercontext";
import * as Sharing from "expo-sharing";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Refresh from "../refresh";
const MyRestaurent = ({ route, navigation }) => {
  const { state: resaurentState, dispatch: restaurentDispatch } =
    useContext(RestaurentContext);
  const { dispatch: orderDispatch } = useContext(OrderContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const resturantId = route?.params?.id
    ? route.params.id
    : user?.resturantId?._id;
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const myRestaurentId =
    resaurentState.myRestaurent &&
    resaurentState.myRestaurent.length > 0 &&
    resaurentState.myRestaurent[0]._id;
  const [resReq, setResReq] = useState(true);
  useEffect(() => {
    if (resturantId || resturantId === undefined) {
      getMyRestaurent();
    }
  }, [resturantId]);

  const getMyRestaurent = () => {
    if (
      resaurentState.myRestaurent === null ||
      myRestaurentId.toString() !== resturantId?.toString()
    ) {
      setResReq(false);
      Axios.get(
        `${BASE_URL}/api/resturant/${resturantId?.toString()}/getOwnerResturant`,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "x-token": token,
            "x-refresh-token": refreshtoken,
          },
        }
      )
        .then((res) => {
          // console.log(res.data);
          const { resturant, restaurentOrder } = res.data;
          restaurentDispatch({
            type: "ADD_ONLY_MY_RESTAURENT",
            payload: resturant,
          });
          orderDispatch({
            type: "GET_MY_RESTAURENT_ORDER",
            payload: restaurentOrder,
          });
          setResReq(true);
        })
        .catch((err) => {
          const error = err.response.data.error;
          console.log(error);
        });
    }
  };

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(
      `https://treazer-app.firebaseapp.com/home/singleRestaurent/${resturantId}`
    );
  };
  return (
    <Refresh>
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        {resReq && resaurentState.myRestaurent ? (
          <View style={styles.div_1}>
            <View style={styles.div_2}>
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Icon
                  name='angle-left'
                  type='font-awesome-5'
                  color='#757575'
                  size={26}
                  containerStyle={{
                    left: 15,
                    width: 40,
                    height: 30,
                    borderRadius: 25,
                    boxShadow: "1px 3px 6px 1px #C9CCD1",
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.text_1}>MY RESTAURANT</Text>
              {/* <TouchableOpacity>
              <Icon
                name='ellipsis-v'
                type='font-awesome-5'
                color='#757575'
                size={20}
                containerStyle={{
                  right: 15,
                }}
              />
            </TouchableOpacity> */}
            </View>
            <ScrollView style={styles.div_4}>
              <View
                style={
                  {
                    // height: width > 360 && height > 640 ? "41%" : "45%",
                  }
                }>
                {resaurentState.myRestaurent ? (
                  <LazyLoadImage
                    src={
                      resaurentState.myRestaurent.length > 0
                        ? resaurentState.myRestaurent[0].coverPic
                        : resaurentState.myRestaurent.coverPic
                    }
                    resizemode='cover'
                    effect='blur'
                    placeholderSrc={require("../../assets/images/singlerestaurant.webp")}
                    style={{
                      width: "100%",
                      flex: 1,
                      // height: width > 360 && height > 640 ? "50%" : "80%",
                      borderBottomRightRadius: "40px",
                      borderBottomLeftRadius: "40px",
                      boxShadow: "0 4px 8px 0 #bdbdbd, 0 6px 20px 0 #bdbdbd",
                      elevation: 2,
                    }}
                  />
                ) : (
                  <ActivityIndicator
                    size='large'
                    color='#82b1ff'
                    style={{
                      marginVertical: "auto",
                      marginHorizontal: "auto",
                    }}
                  />
                )}

                {/* <View
                  style={{
                    position: "absolute",
                    flexDirection: "row",
                    bottom: 0,
                    height: 50,
                    width: 100,
                    borderBottomColor: "#ffffff",
                    backgroundColor: "#ffffff",
                    borderTopRightRadius: 40,
                    borderBottomLeftRadius: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Icon
                    name='star'
                    type='font-awesome-5'
                    color='#424242'
                    size={20}
                    iconStyle={{
                      marginHorizontal: 10,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      fontFamily: "Open Sans",
                      marginVertical: 10,
                    }}>
                    3.8
                  </Text>
                </View> */}
              </View>
              {/* <View>
              <LazyLoadImage
                src={
                  resaurentState.myRestaurent &&
                  resaurentState.myRestaurent.length > 0
                    ? resaurentState.myRestaurent[0].coverPic
                    : resaurentState.myRestaurent.coverPic
                }
                resizemode='cover'
                effect='blur'
                style={{
                  width: "100%",
                  flex: 1,
                  // height: width > 360 && height > 640 ? "50%" : "80%",
                  borderBottomRightRadius: "40px",
                  borderBottomLeftRadius: "40px",
                  boxShadow: "0 4px 8px 0 #bdbdbd, 0 6px 20px 0 #bdbdbd",
                  elevation: 2,
                }}
              />
              <View
                  style={{
                    position: "absolute",
                    flexDirection: "row",
                    bottom: 0,
                    height: 50,
                    width: 100,
                    borderBottomColor: "#ffffff",
                    backgroundColor: "#ffffff",
                    borderTopRightRadius: 40,
                    borderBottomLeftRadius: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Icon
                    name='star'
                    type='font-awesome-5'
                    color='#424242'
                    size={20}
                    iconStyle={{
                      marginHorizontal: 10,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "400",
                      fontFamily: "Open Sans",
                      marginVertical: 10,
                    }}>
                    3.8
                  </Text>
                </View>
            </View> */}
              {resaurentState.myRestaurent ? (
                <View>
                  <Text style={styles.text_2}>
                    {resaurentState.myRestaurent &&
                      resaurentState.myRestaurent.length > 0
                      ? resaurentState.myRestaurent[0].resturant_name
                      : resaurentState.myRestaurent.resturant_name}
                  </Text>
                  <View style={{ flexDirection: "row", padding: 10 }}>
                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: 14,
                        color: "#212121",
                        letterSpacing: 1,
                        fontWeight: "500",
                        fontFamily: "Roboto Slab",
                      }}>
                      Quick Bites-
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        marginTop: 10,
                        fontSize: 14,
                        color: "#212121",
                        fontWeight: "400",
                        letterSpacing: 1,
                        fontFamily: "Open Sans",
                      }}>
                      North Indian, Chiness, Thali
                    </Text>
                  </View>
                  <Text style={styles.text_4}>
                    {" "}
                    {resaurentState.myRestaurent &&
                      resaurentState.myRestaurent.length > 0
                      ? resaurentState.myRestaurent[0].address
                      : resaurentState.myRestaurent.address.slice(0, 50)}
                    ...
                  </Text>
                </View>
              ) : (
                <ActivityIndicator
                  size='large'
                  color='#82b1ff'
                  style={{
                    marginVertical: "auto",
                    marginHorizontal: "auto",
                  }}
                />
              )}
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  height: 50,
                  marginTop: 10,
                  alignItems: "center",
                  justifyContent: "space-around",
                }}>
                <TouchableOpacity onPress={openShareDialogAsync}>
                  <Icon
                    name='share-alt'
                    type='font-awesome-5'
                    color='#757575'
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.button_1}
                onPress={() =>
                  navigation.navigate("MyMenu", {
                    id:
                      resaurentState.myRestaurent &&
                        resaurentState.myRestaurent.length > 0
                        ? resaurentState.myRestaurent[0]._id
                        : resaurentState.myRestaurent._id,
                  })
                }>
                <Text style={styles.text_5}>Order Food Online</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        ) : (
          <View
            style={{
              width,
              height,
              justifyContent: "center",
              marginHorizontal: "auto",
              backgroundColor: "#ffffff",
            }}>
            <ActivityIndicator
              size='large'
              color='#82b1ff'
              style={{
                marginVertical: "auto",
                marginHorizontal: "auto",
              }}
            />
          </View>
        )}
      </View>
    </Refresh>
  );
};

export default MyRestaurent;

const styles = StyleSheet.create({
  div_1: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    // height: width <= 360 && height <= 640 ? "95%" : "75%",
    height: height * 0.95,
  },
  div_2: {
    top: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  text_1: {
    textAlign: "center",
    width: 300,
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: "bold",
    color: "#212121",
    textShadow: "1px 0 #263238",
    fontFamily: "Roboto Slab",
  },

  div_4: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  text_2: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
    fontFamily: "Open Sans",
  },
  text_3: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 15,
    color: "#212121",
    fontWeight: "400",
    letterSpacing: 1,
    fontFamily: "Open Sans",
  },
  text_4: {
    marginLeft: 5,
    marginVertical: 5,
    fontSize: 16,
    color: "#757575",
    fontWeight: "600",
    letterSpacing: 1,
    fontFamily: "Open Sans",
  },
  text_5: {
    marginHorizontal: "auto",
    marginVertical: 10,
    fontSize: width <= 320 && height <= 500 ? 15 : 18,
    color: "#ffffff",
    fontWeight: "bold",
    letterSpacing: 3,
    fontFamily: "Roboto Slab",
    textShadow: "1px 0 #ffffff",
  },
  button_1: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: "auto",
    width: "90%",
    height: width <= 320 && height <= 500 ? 40 : 50,
    backgroundColor: "#29b6f6",
    borderRadius: 20,
    boxShadow: "0 2px 4px 0 #bdbdbd, 0 3px 6px 0 #bdbdbd",

    // border: "1px solid black",
  },
});
