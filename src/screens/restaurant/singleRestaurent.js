import React, { useEffect, useContext, useState } from "react";
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
import { OrderContext } from "../../context/ordercontext";
// import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const { width, height } = Dimensions.get("window");
import Axios from "axios";
import BASE_URL from "../../api";
import * as Sharing from "expo-sharing";
const SingleRestaurent = ({ route, navigation }) => {
  const { state: resaurentState, dispatch: restaurentDispatch } =
    useContext(RestaurentContext);
  const { dispatch: orderDispatch } = useContext(OrderContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getSingleRestaurant();
  }, []);
  // const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);
  // const resturantId = user ? user.resturantId : null;
  const id = route.params ? route.params.id : "";
  const getSingleRestaurant = () => {
    if (resaurentState.allRestaurent.length === 0) {
      setIsLoading(false);
      Axios.get(`${BASE_URL}/api/resturant/${id}/getOneResturant`)
        .then((res) => {
          // console.log(res.data);
          const { resturant, restaurentOrder } = res.data;
          restaurentDispatch({ type: "ADD_RESTAURENT", payload: resturant });
          orderDispatch({
            type: "GET_SINGLE_RESTAURENT_ORDER",
            payload: restaurentOrder,
          });
          setIsLoading(true);
        })
        .catch((err) => console.log(err));
    } else {
      restaurentDispatch({ type: "FILTER_RESTAURENT", payload: id });
    }
  };
  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(`https://treazer-app.firebaseapp.com/home/singleRestaurent/${id}`);
  };

  return isLoading ? (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {resaurentState.singleRestaurent &&
        resaurentState.singleRestaurent.length > 0 ? (
        <View style={styles.div_1}>
          <View style={styles.div_2}>
            <TouchableOpacity onPress={() => window.history.back()}>
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
            <View>
              <img
                src={resaurentState.singleRestaurent[0].coverPic}
                style={{
                  width: "100%",
                  flex: 1,
                  borderBottomRightRadius: 40,
                  borderBottomLeftRadius: 40,
                  boxShadow: "0 4px 8px 0 #bdbdbd, 0 6px 20px 0 #bdbdbd",
                }}
              />

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
            <View>
              <Text style={styles.text_2}>
                {resaurentState.singleRestaurent[0].resturant_name}
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
                {resaurentState.singleRestaurent &&
                  resaurentState.singleRestaurent[0].address.slice(0, 50)}
                ...
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                height: 50,
                marginTop: 10,
                alignItems: "center",
                justifyContent: "space-around",
              }}>
              {/* <TouchableOpacity>
                <Icon
                  name='comments'
                  type='font-awesome-5'
                  color='#757575'
                  size={20}
                />
              </TouchableOpacity> */}
              <TouchableOpacity onPress={openShareDialogAsync}>
                <Icon
                  name='share-alt'
                  type='font-awesome-5'
                  color='#757575'
                  size={20}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity>
                <Icon
                  name='flag'
                  type='font-awesome-5'
                  color='#757575'
                  size={20}
                />
              </TouchableOpacity> */}
            </View>

            <TouchableOpacity
              style={styles.button_1}
              onPress={() =>
                navigation.navigate("Menu", {
                  id: resaurentState.singleRestaurent[0]._id,
                  isOpen: resaurentState.singleRestaurent[0].isOpened,
                })
              }>
              <Text style={styles.text_5}>Order Food Online</Text>
            </TouchableOpacity>
          </ScrollView>

          <View
            style={{
              height: 50,
              width: "100%",
            }}></View>
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
          margin: "auto",
        }}
      />
    </View>
  );
};

export default SingleRestaurent;

const styles = StyleSheet.create({
  div_1: {
    width: "100%",
    backgroundColor: "#ffffff",
    alignItems: "center",
    // height: width <= 360 && height <= 640 ? "95%" : "75%",
    height: height,
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
    letterSpacing: 3,
    fontWeight: "bold",
    color: "#263238",
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
    fontWeight: "700",
    letterSpacing: 2,
    color: "#212121",
    fontFamily: "Open Sans",
  },
  text_4: {
    marginLeft: 5,
    marginVertical: 5,
    fontSize: 16,
    color: "#263238",
    fontWeight: "600",
    letterSpacing: 1,
    fontFamily: "Roboto Slab",
  },
  text_5: {
    marginLeft: 10,
    marginVertical: 10,
    fontSize: width <= 320 && height <= 500 ? 15 : 20,
    color: "#ffffff",
    letterSpacing: 3,
    fontWeight: "700",
    fontFamily: "Open Sans",
    textShadow: "1px 0 #ffffff",
  },
  button_1: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: "auto",
    width: "90%",
    // height: 50,
    height: width <= 320 && height <= 500 ? 40 : 50,
    backgroundColor: "#29b6f6",
    borderRadius: 20,
    boxShadow: "0 2px 4px 0 #bdbdbd, 0 3px 6px 0 #bdbdbd",

    // border: "1px solid black",
  },
});
