import React, { useContext, useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Dialog from "@material-ui/core/Dialog";
import { Button, PricingCard } from "react-native-elements";
import { CartContext } from "../../context/cartContext";
import { makeOrder } from "../../functions/orderfunction";
import { RestaurentContext } from "../../context/restaurentContext";
import { NotificationContext } from "../../context/notificationContext";
import Axios from "axios";
import BASE_URL from "../../api";

const Paymentform = ({
  open,
  Transition,
  handleClose,
  route,
  lng,
  lat,
  landmark,
  houseNo,
  setuserError,
  setOpen2,
  setrestaurentError,
  setlocationError,
  setlandmarkError,
  sethouseError,
  setcartError,
  setResponseError,
  setOrderReq,
  orderDispatch,
  cartDispatch,
  setOrderSuccess,
  setHouseNo,
  setLandmark,
  setOpen,
}) => {
  const navigation = useNavigation();
  const { state: cartState } = useContext(CartContext);
  const { state: restaurentState, dispatch: restaurentDispatch } =
    useContext(RestaurentContext);
  const { dispatch: notiDispatch } = useContext(NotificationContext);

  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : "";
  const resturantId = route.params ? route.params.ResturantId : "";
  const [paymentReq, setPaymentReq] = useState(true);
  const handleOrder = () => {
    makeOrder(
      cartState,
      userId,
      token,
      refreshtoken,
      resturantId,
      lng,
      lat,
      landmark,
      houseNo,
      setuserError,
      setOpen2,
      setrestaurentError,
      setlocationError,
      setlandmarkError,
      sethouseError,
      setcartError,
      setResponseError,
      setOrderReq,
      orderDispatch,
      cartDispatch,
      setOrderSuccess,
      setHouseNo,
      setLandmark,
      setOpen,
      navigation,
      handleClose,
      setPaymentReq,
      notiDispatch
    );
  };

  useEffect(() => {
    getSingleRestaurant();
  }, []);

  const getSingleRestaurant = () => {
    if (restaurentState.allRestaurent.length === 0) {
      Axios.get(`${BASE_URL}/api/resturant/${resturantId}/getOneResturant`)
        .then((res) => {
          console.log(res.data);
          const { resturant, restaurentOrder } = res.data;
          restaurentDispatch({ type: "ADD_RESTAURENT", payload: resturant });
          orderDispatch({
            type: "GET_SINGLE_RESTAURENT_ORDER",
            payload: restaurentOrder,
          });
        })
        .catch((err) => console.log(err));
    } else {
      restaurentDispatch({ type: "FILTER_RESTAURENT", payload: resturantId });
    }
  };

  // const handlePay = () => {
  //   const amount = cartState.cart?.price;
  //   Axios.post(
  //     `${BASE_URL}/api/order/payment`,
  //     { amount },
  //     {
  //       headers: {
  //         // Authorization: `Bearer ${token}`,
  //         "x-token": token,
  //         "x-refresh-token": refreshtoken,
  //       },
  //     }
  //   )
  //     .then((res) => {
  //       console.log(res.data);
  //       const options = {
  //         description: "Credits towards consultation",
  //         image: "https://i.imgur.com/3g7nmJC.png",
  //         currency: res.data.currency,
  //         key: "rzp_test_CDdnUrt3mxVUy5",
  //         amount: res.data.amount,
  //         name: "Acme Corp",
  //         order_id: res.data.order_id, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
  //         prefill: {
  //           contact: user.mobile_no,
  //           name: user.username,
  //         },
  //         theme: { color: "#53a20e" },
  //       };
  //       const rzp1 = new Razorpay(options);
  //       rzp1
  //         .open(options)
  //         .then((data) => {
  //           // handle success
  //           console.log(data);
  //           alert(`Success: ${data.razorpay_payment_id}`);
  //           Axios.post(
  //             `${BASE_URL}/api/order/paymentcapture/${data.razorpay_payment_id}`,
  //             { amount },
  //             {
  //               headers: {
  //                 // Authorization: `Bearer ${token}`,
  //                 "x-token": token,
  //                 "x-refresh-token": refreshtoken,
  //               },
  //             }
  //           )
  //             .then((res2) => {
  //               const status = res2.data;
  //               console.log(status);
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //             });
  //         })
  //         .catch((error) => {
  //           // handle failure
  //           console.log(error);
  //           alert(`Error: ${error.code} | ${error.description}`);
  //         });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted>
      <PricingCard
        color='#4f9deb'
        title='Total Price'
        price={`Rs.${parseInt(cartState.cartItems?.price)}`}
        info={[
          `Dish Price Rs.${restaurentState.singleRestaurent &&
            restaurentState.singleRestaurent.length > 0 &&
            restaurentState.singleRestaurent[0].deliveryType === "self"
            ? cartState.cartItems?.price -
            restaurentState.singleRestaurent[0].deliveryPrice
            : cartState.cartItems?.price - 24
          }`,
          `${restaurentState.singleRestaurent &&
            restaurentState.singleRestaurent.length > 0 &&
            restaurentState.singleRestaurent[0].deliveryType === "self"
            ? `Delivery Charge Rs.${restaurentState.singleRestaurent[0].deliveryPrice}`
            : `Delivery Charge Rs.19`
          }`,
          `${restaurentState.singleRestaurent &&
            restaurentState.singleRestaurent.length > 0 &&
            restaurentState.singleRestaurent[0].deliveryType === "self"
            ? ""
            : "Convenience Fee Rs.5"
          }`,
        ]}
        button={
          paymentReq ? (
            <View>
              {/* <Button
            onPress={handlePay}
            title='PAY ONLINE'
            raised
            buttonStyle={{
              backgroundColor: "#4fc3f7",
              width: "100%",
              borderRadius: 10,
            }}
            containerStyle={{
              marginVertical: 10,
              width: "100%",
              marginHorizontal: "auto",
              borderRadius: 10,
              border: "none",
              boxShadow: "3px 4px 6px #C9CCD1, -3px -4px 6px #ffffff",
            }}
            titleStyle={{
              fontSize: 12,
              textShadow: "1px 0 #ffffff",
              fontWeight: "400",
              letterSpacing: 3,
              fontFamily: "Roboto Slab",
            }}
          /> */}
              <Button
                onPress={handleOrder}
                title='Place Order'
                raised
                buttonStyle={{
                  backgroundColor: "#4fc3f7",
                  width: "100%",
                  borderRadius: 10,
                }}
                containerStyle={{
                  marginVertical: 10,
                  width: "100%",
                  marginHorizontal: "auto",
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "3px 4px 6px #C9CCD1, -3px -4px 6px #ffffff",
                }}
                titleStyle={{
                  fontSize: 12,
                  textShadow: "1px 0 #ffffff",
                  fontWeight: "400",
                  letterSpacing: 3,
                  fontFamily: "Roboto Slab",
                }}
              />
            </View>
          ) : (
            <View
              style={{
                width: "100%",
                marginVertical: 20,
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
          )
        }
      />
    </Dialog>
  );
};

export default Paymentform;

// const styles = StyleSheet.create({});
