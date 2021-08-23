import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import { Icon, Button } from "react-native-elements";
import axios from "axios";
import BASE_URL from "../../api";
import { OrderContext } from "../../context/ordercontext";
// import { NotificationContext } from "../context/notificationContext";

const MyorderDetails = ({
  orderPrice,
  orderOTP,
  orderPayment,
  orderId,
  isRestaurantOwnerVerify,
  userId,
  isRestaurantOwnerReject,
}) => {
  const [activeStep] = useState(0);

  const { dispatch: orderDispatch } = useContext(OrderContext);
  // const { dispatch: notiDispatch } = useContext(NotificationContext);
  const getSteps = () => {
    return [
      <Icon name='store-alt' type='font-awesome-5' color='#757575' size={20} />,
      <Icon name='biking' type='font-awesome-5' color='#757575' size={20} />,
      <Icon name='home' type='font-awesome-5' color='#757575' size={20} />,
    ];
  };
  const steps = getSteps();

  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const [handleOrderReq, setHandleOrderReq] = useState(true);
  const acceptOrder = () => {
    setHandleOrderReq(false);
    let uid;
    if (userId !== undefined) {
      uid = userId;
    }
    axios
      .post(
        `${BASE_URL}/api/order/restaurantownerverify`,
        { orderId, userId: uid },
        {
          headers: {
            "x-token": token,
            "x-refresh-token": refreshtoken,
          },
        }
      )
      .then((res) => {
        const { order, msg } = res.data;
        console.log(order, msg);
        orderDispatch({ type: "ACCEPT_ORDER", payload: order });
        setHandleOrderReq(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const rejectOrder = () => {
    setHandleOrderReq(false);
    let uid;
    if (userId !== undefined) {
      uid = userId;
    }
    axios
      .post(
        `${BASE_URL}/api/order/restaurantownerreject`,
        { orderId, userId: uid },
        {
          headers: {
            "x-token": token,
            "x-refresh-token": refreshtoken,
          },
        }
      )
      .then((res) => {
        const { order, msg } = res.data;
        console.log(order, msg);
        orderDispatch({ type: "REJECT_ORDER", payload: order });
        setHandleOrderReq(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        width: "95%",
        height: 140,
        marginBottom: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        style={{
          width: "90%",
          padding: 10,
        }}>
        {steps.map((label, idx) => (
          <Step
            key={idx}
            style={{
              width: "100%",
            }}>
            <View
              style={{
                flex: 1,
                width: "100%",
              }}>
              {label}
            </View>
          </Step>
        ))}
      </Stepper>
      <View
        style={{
          paddingBottom: 10,
          paddingHorizontal: 10,
          height: 100,
        }}>
        <Text
          style={{
            fontFamily: "Open Sans",
            fontWeight: 400,
            fontSize: 14,
          }}>
          Order-ID:
          <Text
            style={{
              fontWeight: "700",
              fontFamily: "Roboto Slab",
              marginLeft: 5,
            }}>
            {orderId}
          </Text>
        </Text>
        {!isRestaurantOwnerReject ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
            <View>
              <Text
                style={{
                  fontFamily: "Open Sans",
                  fontWeight: 400,
                  fontSize: 14,
                  marginTop: 5,
                }}>
                Total Price:
                <Text
                  style={{
                    fontWeight: "700",
                    fontFamily: "Roboto Slab",
                    marginLeft: 5,
                  }}>
                  {orderPrice}
                </Text>
              </Text>

              <Text
                style={{
                  fontFamily: "Open Sans",
                  fontWeight: 400,
                  fontSize: 14,
                  marginTop: 5,
                }}>
                OTP:
                <Text
                  style={{
                    fontWeight: "700",
                    fontFamily: "Roboto Slab",
                    marginLeft: 5,
                  }}>
                  {orderOTP}
                </Text>
              </Text>

              <Text
                style={{
                  fontFamily: "Open Sans",
                  fontWeight: 400,
                  fontSize: 14,
                  marginTop: 5,
                }}>
                Payment:
                <Text
                  style={{
                    fontWeight: "700",
                    fontFamily: "Roboto Slab",
                    marginLeft: 5,
                  }}>
                  {orderPayment ? "Done" : "Not Done"}
                </Text>
              </Text>
            </View>
            {isRestaurantOwnerVerify !== undefined &&
              isRestaurantOwnerReject !== undefined &&
              !isRestaurantOwnerVerify &&
              !isRestaurantOwnerReject ? (
              <View>
                {handleOrderReq ? (
                  <View
                    style={{
                      marginVertical: "auto",
                    }}>
                    <Button
                      onPress={acceptOrder}
                      title='Accept'
                      raised
                      buttonStyle={{
                        backgroundColor: "#4caf50",
                        width: 70,
                        height: 20,
                        padding: 0,
                      }}
                      containerStyle={{
                        marginTop: 5,
                        width: 70,
                        height: 20,
                        marginVertical: 10,
                        border: "none",
                      }}
                      titleStyle={{
                        fontSize: 10,
                        textShadow: "1px 0 #ffffff",
                        fontWeight: "400",
                        letterSpacing: 2,
                        fontFamily: "Roboto Slab",
                      }}
                    />
                    <Button
                      onPress={rejectOrder}
                      title='Decline'
                      raised
                      buttonStyle={{
                        backgroundColor: "#d84315",
                        width: 70,
                        height: 20,
                        padding: 0,
                      }}
                      containerStyle={{
                        marginTop: 5,
                        width: 70,
                        height: 20,
                        border: "none",
                      }}
                      titleStyle={{
                        fontSize: 10,
                        textShadow: "1px 0 #ffffff",
                        fontWeight: "400",
                        letterSpacing: 2,
                        fontFamily: "Roboto Slab",
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <ActivityIndicator
                      size='small'
                      color='#82b1ff'
                      style={{
                        marginVertical: "auto",
                        marginHorizontal: 20,
                      }}
                    />
                  </View>
                )}
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Icon
                  name='check'
                  type='font-awesome-5'
                  color='#00e676'
                  size={30}
                />
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Icon
              name='times'
              type='font-awesome-5'
              color='#ff3d00'
              size={40}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default MyorderDetails;

const styles = StyleSheet.create({});
