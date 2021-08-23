import React, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Axios from "axios";
import BASE_URL from "../../api";
import { OrderContext } from "../../context/ordercontext";
import MyorderDetails from "../proile/myorderDetails";
const { height } = Dimensions.get("window");
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const Restaurentorderlist = ({ scrollPosition }) => {
  const [orderReq, setOrderReq] = useState(true);
  const { state: orderState, dispatch: orderDispatch } = useContext(
    OrderContext
  );
  const user = JSON.parse(localStorage.getItem("user"));
  const resturantId = user && user.resturantId?._id;
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");

  useEffect(() => {
    if (resturantId) {
      getMyRestaurent();
    }
  }, [resturantId]);

  const getMyRestaurent = () => {
    if (orderState.myRestaurentOrder === null) {
      setOrderReq(false);
      Axios.get(`${BASE_URL}/api/resturant/${resturantId}/getOwnerResturant`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "x-token": token,
          "x-refresh-token": refreshtoken,
        },
      })
        .then((res) => {
          console.log(res.data);
          const { restaurentOrder } = res.data;
          orderDispatch({
            type: "GET_MY_RESTAURENT_ORDER",
            payload: restaurentOrder,
          });
          setOrderReq(true);
        })
        .catch((err) => {
          const error = err.response.data.error;
          console.log(error);
        });
    }
  };
  const renderItem = ({ item }) => {
    return (
      <View style={styles.v2}>
        <LazyLoadImage
          src={item.product.photo}
          resizemode='cover'
          effect='blur'
          scrollPosition={scrollPosition}
          style={{
            width: 150,
            height: 100,
            borderRadius: 10,
          }}
        />
        <View
          style={{ width: 100, height: 100, justifyContent: "space-evenly" }}>
          <Text
            style={{
              width: "100%",
              fontSize: 15,
              fontWeight: "600",
              fontFamily: "Open Sans",
              textAlign: "center",
            }}>
            {item.product.name}
          </Text>
          <Text
            style={{
              width: "100%",
              fontSize: 15,
              fontWeight: "600",
              fontFamily: "Open Sans",
              textAlign: "center",
            }}>
            ₹{item.product.price}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}>
      <Text
        style={{
          width: "100%",
          textAlign: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: "600",
          color: "#90a4ae",
          letterSpacing: 3,
          fontFamily: "Open Sans",
        }}>
        Restaurant Orders
      </Text>
      <View
        style={{
          marginTop: 20,
          width: "100%",
          height: height * 0.65,
          backgroundColor: "#ffffff",
        }}>
        {orderReq ? (
          <ScrollView
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
            }}>
            {orderState.myRestaurentOrder &&
              orderState.myRestaurentOrder.length > 0 ? (
              orderState.myRestaurentOrder.map((order, idx) => (
                <View key={idx}>
                  <SafeAreaView style={styles.v1}>
                    <FlatList
                      data={order.orderItems}
                      renderItem={renderItem}
                      keyExtractor={(item) => item._id}
                      showsHorizontalScrollIndicator={true}
                      style={{ width: "100%" }}
                    />
                  </SafeAreaView>
                  <View
                    style={{
                      width: "90%",
                      height: 150,
                      marginHorizontal: "auto",
                      marginBottom: 20,
                      backgroundColor: "#eeeeee",
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                      alignItems: "center",
                      boxShadow: "1px 3px 6px 1px #C9CCD1",
                    }}>
                    <MyorderDetails
                      orderPrice={order.totalPrice}
                      orderOTP={order.OTP}
                      orderPayment={order.isPaid}
                      orderId={order._id}
                      isRestaurantOwnerVerify={order.isRestaurantOwnerVerify}
                      isRestaurantOwnerReject={order.isRestaurantOwnerReject}
                      userId={order.userId}
                      resturantId={order.resturantId}
                    />
                  </View>
                </View>
              ))
            ) : (
              <View
                style={{
                  height: 300,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: "auto",
                }}>
                <LazyLoadImage
                  style={{
                    marginTop: 10,
                    width: 220,
                    height: 200,
                    marginLeft: 20,
                    resizeMode: "cover",
                  }}
                  src={require("../../assets/images/home page no nearby.webp")}
                  effect='blur'
                />
                <Text
                  style={{
                    textAlign: "Center",
                    fontSize: 30,
                    letterSpacing: 3,
                    fontWeight: "700",
                    fontFamily: "Open Sans",
                    color: "#424242",
                  }}>
                  You have no orders!!!
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <ActivityIndicator
              size='large'
              color='#82b1ff'
              style={{
                marginVertical: "auto",
                marginHorizontal: 30,
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

// export default Restaurentorderlist;
export default trackWindowScroll(Restaurentorderlist);
const styles = StyleSheet.create({
  v1: {
    width: "90%",
    height: 150,
    marginHorizontal: "auto",
    marginTop: 20,
    backgroundColor: "#eeeeee",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    boxShadow: "1px 3px 6px 1px #C9CCD1",
  },
  v2: {
    width: "90%",
    height: "90%",
    marginVertical: 20,
    marginHorizontal: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
