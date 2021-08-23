import React, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Axios from "axios";
import BASE_URL from "../../api";
import { OrderContext } from "../../context/ordercontext";
import MyorderDetails from "./myorderDetails";
const { height } = Dimensions.get("window");
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const Myorder = ({ scrollPosition }) => {
  const { state: orderState, dispatch: orderDispatch } = useContext(
    OrderContext
  );
  const [orderReq, setOrderReq] = useState(true);
  useEffect(() => {
    getOrder();
  }, []);

  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const getOrder = () => {
    if (orderState.myOrder === null) {
      setOrderReq(false);
      Axios.get(`${BASE_URL}/api/order/getorder`, {
        headers: {
          "x-token": token,
          "x-refresh-token": refreshtoken,
        },
      })
        .then((res) => {
          const { order } = res.data;
          if (order.length !== 0) {
            orderDispatch({ type: "PLACE_MY_ORDER", payload: order });
          }
          // console.log(order);
          setOrderReq(true);
        })
        .catch((err) => {
          console.log(err);
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
        My Orders
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
            {orderState.myOrder && orderState.myOrder.length > 0 ? (
              orderState.myOrder.map((order, idx) =>
                !order.isRestaurantOwnerVerify &&
                  !order.isRestaurantOwnerReject ? (
                  <View
                    key={idx}
                    style={{
                      backGroundColor: "#ffffff",
                      width: "100%",
                      height: 100,
                      padding: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <View
                      style={{
                        width: "100%",
                        height: 80,
                        borderRadius: 10,
                        backgroundColor: "#eeeeee",
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        marginHorizontal: "auto",
                        boxShadow: "0 1px 2px 0 #bdbdbd, 0 2px 4px 0 #bdbdbd",
                      }}>
                      <Text
                        style={{
                          color: "#616161",
                          fontSize: 15,
                          fontWeight: "700",
                          fontFamily: "Open Sans",
                          letterSpacing: 1,
                        }}>
                        Restaurant will verify your order
                      </Text>
                    </View>
                  </View>
                ) : order.isRestaurantOwnerReject ? (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: "#ffffff",
                      width: "100%",
                      height: 100,
                      padding: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <View
                      style={{
                        width: "100%",
                        height: 80,
                        borderRadius: 10,
                        backgroundColor: "#ffccbc",
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        marginHorizontal: "auto",
                        boxShadow: "0 1px 2px 0 #bdbdbd, 0 2px 4px 0 #bdbdbd",
                      }}>
                      <Text
                        style={{
                          color: "#616161",
                          fontSize: 15,
                          fontWeight: "700",
                          fontFamily: "Open Sans",
                          letterSpacing: 1,
                        }}>
                        Your order has been rejected
                      </Text>
                    </View>
                  </View>
                ) : (
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
                      />
                    </View>
                  </View>
                )
              )
            ) : orderState.myOrder ? (
              <SafeAreaView style={styles.v1}>
                <FlatList
                  data={orderState.myOrder.orderItems}
                  renderItem={renderItem}
                  keyExtractor={(item) => item._id}
                  showsHorizontalScrollIndicator={true}
                  style={{ width: "100%" }}
                />
              </SafeAreaView>
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
                    marginVertical: 10,
                    letterSpacing: 3,
                    fontWeight: "700",
                    fontFamily: "Open Sans",
                    color: "#424242",
                  }}>
                  You don't have any orders!!!
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

// export default Myorder;
export default trackWindowScroll(Myorder);
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
