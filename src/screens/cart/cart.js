import React, { useContext, useState } from "react";
import { CartContext } from "../../context/cartContext";
import { AuthContext } from "../../context/userContext";
import { RestaurentContext } from "../../context/restaurentContext";
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Dialog from "@material-ui/core/Dialog";
import MuiAlert from "@material-ui/lab/Alert";
import Axios from "axios";
import BASE_URL from "../../api";
const { height } = Dimensions.get("window");
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const Cart = () => {
  const navigation = useNavigation();
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { state: userState } = useContext(AuthContext);
  const { state: productState } = useContext(RestaurentContext);

  const [deletCartReq, setDeletCartReq] = useState(true);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleCheckout = (ResturantId) => {
    if (!userState.isLogin) {
      setOpen(true);
    } else {
      navigation.navigate("Home", {
        screen: "Location",
        params: { ResturantId },
      });
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false);
  };
  const removeWholeItem = (productId) => {
    if (!userState.isLogin) {
      setOpen(true);
    } else {
      setDeletCartReq(false);
      Axios.post(
        `${BASE_URL}/api/cart/${user._id}/removewholeitem`,
        { productId },
        {
          headers: {
            "x-token": token,
            "x-refresh-token": refreshtoken,
          },
        }
      )
        .then((res) => {
          const { updatedCart } = res.data;

          if (updatedCart.cartItem.length === 0) {
            Axios.post(
              `${BASE_URL}/api/cart/deleteCart`,
              { cartId: cartState.cartItems._id },
              {
                headers: {
                  "x-token": token,
                  "x-refresh-token": refreshtoken,
                },
              }
            )
              .then(() => {
                cartDispatch({ type: "REMOVE_WHOLE_CART" });
                setDeletCartReq(true);
              })
              .catch((err) => console.log(err));
          } else {
            cartDispatch({
              type: "REMOVE_FROM_CART",
              payload: updatedCart,
            });
            setDeletCartReq(true);
          }
          // console.log(updatedCart);
        })
        .catch((err) => console.log(err));
    }
  };
  const [open2, setOpen2] = useState(false);
  return (
    <View style={styles.div_1}>
      <View style={styles.div_1}>
        <View style={styles.div_2}>
          <TouchableOpacity
            onPress={() => {
              if (!productState.restaurentProducts) {
                // navigation.goBack();
                window.history.back();
              } else {
                navigation.navigate("Home", {
                  screen: "Menu",
                  params: {
                    id: cartState.cartItems.cartItem[0].productId.resturantId,
                  },
                });
              }
            }}>
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
          <Text style={styles.text_1}>MY CART</Text>
          {/* <Icon
            name='angle-left'
            type='font-awesome-5'
            color='#9e9e9e'
            size={26}
            containerStyle={styles.image_1}
          />
          <Text style={styles.text_1}>MY CART</Text> */}
        </View>
        <View
          style={{
            width: "100%",
            height: height * 0.7,
            // maxHeight: width <= 320 && height <= 500 ? 400 : 500,
          }}>
          <ScrollView style={styles.div_3}>
            {cartState.cartItems !== null &&
              cartState.cartItems.cartItem &&
              cartState.cartItems.cartItem.map((item, idx) => (
                <View style={styles.div_5} key={idx}>
                  <Image
                    style={{
                      borderRadius: 10,
                      height: 70,
                      width: 70,
                      boxShadow: "1px 3px 6px 1px #C9CCD1",
                    }}
                    source={item.productId?.photo}
                  />
                  <View
                    style={{
                      marginHorizontal: "auto",
                      marginVertical: "auto",
                      width: "75%",
                      maxWidth: 1600,
                      height: 75,
                    }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 45,
                        flexWrap: "wrap",
                      }}>
                      <View
                        style={{
                          width: "90%",
                          height: "100%",
                          justifyContent: "space-between",
                        }}>
                        <Text
                          style={{
                            marginLeft: 15,
                            fontSize: 15,
                            color: "#9e9e9e",
                            fontWeight: "bold",
                            letterSpacing: 1,
                            fontFamily: "Open Sans",
                          }}>
                          {item.productId?.name.slice(0, 20)}...
                        </Text>
                        <Text
                          style={{
                            fontWeight: "600",
                            marginLeft: 15,
                            marginTop: 5,
                            color: "#424242",
                            fontSize: 12,
                            fontFamily: "Open Sans",
                            letterSpacing: 1,
                          }}>
                          {item.productId.description.slice(0, 22)}...
                        </Text>
                        <Text
                          style={{
                            fontWeight: "700",
                            marginLeft: 15,
                            marginTop: 15,
                            color: "#424242",
                            fontSize: 12,
                            fontFamily: "Open Sans",
                            letterSpacing: 1,
                          }}>
                          Qty - {item.quantity}
                        </Text>
                      </View>
                      {deletCartReq ? (
                        <TouchableOpacity
                          onPress={() => removeWholeItem(item.productId?._id)}
                          style={{ height: 20 }}>
                          <Icon
                            name='times'
                            type='font-awesome'
                            color='#e91e63'
                            size={20}
                          />
                        </TouchableOpacity>
                      ) : (
                        <View>
                          <ActivityIndicator
                            size='small'
                            color='#82b1ff'
                            style={{
                              marginHorizontal: "auto",
                            }}
                          />
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row-reverse",
                        justifyContent: "space-between",
                        //   marginTop: 20,
                      }}>
                      <Text
                        style={{
                          // marginLeft: 15,
                          fontSize: 25,
                          color: "#424242",
                          fontWeight: "bold",
                          letterSpacing: 1,
                          fontFamily: "Roboto Slab",
                        }}>
                        ₹{item.price}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
          </ScrollView>
          <Dialog open={open2} onClose={handleClose2} style={{ bottom: 120 }}>
            <Alert onClose={handleClose2} severity='success'>
              Food has added to cart
            </Alert>
          </Dialog>
          <Dialog open={open} onClose={handleClose} style={{ bottom: 120 }}>
            <Alert
              onClose={handleClose}
              severity='error'
              style={{ textAlign: "center" }}>
              You are not logged in!!! Log in first
            </Alert>
          </Dialog>
        </View>
        <View style={styles.div_4}>
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: "#424242",
                letterSpacing: 2,
                fontFamily: "Open Sans",
              }}>
              TOTAL
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#64b5f6",
                letterSpacing: 2,
                textShadow: "1px 0 #64b5f6",
                fontFamily: "Open Sans",
              }}>
              ₹{cartState.cartItems.price}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button_1}
            onPress={() =>
              handleCheckout(
                cartState.cartItems.cartItem[0].productId.resturantId
              )
            }>
            <Text
              style={{
                color: "#ffffff",
                textShadow: "1px 0 #ffffff",
                letterSpacing: 2,
                fontFamily: "Open Sans",
                fontWeight: "600",
              }}>
              CHECKOUT
            </Text>
            <Icon
              name='arrow-right'
              type='font-awesome'
              color='#ffffff'
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  div_1: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 5,
    backgroundColor: "#ffffff",
  },
  div_2: {
    flexDirection: "row",
    width: "100%",
    height: 70,
    backgroundColor: "#ffffff",
    top: 0,
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  image_1: {
    marginLeft: 20,
    marginTop: 5,
    backgroundColor: "#ffffff",
  },
  text_1: {
    textAlign: "center",
    width: 300,
    fontSize: 20,
    letterSpacing: 3,
    fontWeight: "bold",
    color: "#212121",
    textShadow: "1px 0 #212121",
    fontFamily: "Roboto Slab",
  },
  div_3: {
    width: "100%",
    marginHorizontal: "auto",
  },
  div_4: {
    paddingVertical: 20,
    flex: 1,
    width: "100%",
    height: 70,
    maxHeight: 80,
    bottom: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  div_5: {
    flexDirection: "row",
    padding: 15,
    width: "95%",
    height: 110,
    border: "1px solid #29b6f6",
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    marginHorizontal: "auto",
    backgroundColor: "#e3f2fd",
    boxShadow: "3px 3px 6px 1px #eeeeee",
  },
  button_1: {
    alignItems: "center",
    borderRadius: 5,
    height: 40,
    width: 150,
    backgroundColor: "#64b5f6",
    flexDirection: "row",
    justifyContent: "space-evenly",
    boxShadow: "1px 3px 6px 1px #C9CCD1",
  },
});
