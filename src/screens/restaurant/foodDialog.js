import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Dialog from "@material-ui/core/Dialog";
import { Icon } from "react-native-elements";
import { CartContext } from "../../context/cartContext";
import { getCartItems } from "../../functions/cartfunction";
import Axios from "axios";
import BASE_URL from "../../api";

const FoodDialog = ({ itemId, itemPrice, open, handleClose, Transition }) => {
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const [replaceOrderReq, setReplaceOrderReq] = useState(true);
  const removeWholeItem = () => {
    setReplaceOrderReq(false);
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
      .then((res) => {
        cartDispatch({ type: "REMOVE_WHOLE_CART" });

        Axios.post(
          `${BASE_URL}/api/cart/${user._id}/addcart`,
          { productId: itemId, price: itemPrice },
          {
            headers: {
              // Authorization: `Bearer ${token}`,
              "x-token": token,
              "x-refresh-token": refreshtoken,
            },
          }
        )
          .then((res2) => {
            const { newCart, success } = res2.data;
            console.log(newCart, success);
            cartDispatch({ type: "ADD_TO_CART", payload: newCart });
            setReplaceOrderReq(true);
            handleClose();
            getCartItems(user._id, cartDispatch);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClick={handleClose}
      keepMounted
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      style={{
        backgroundColor: "#90caf9",
      }}>
      <View
        style={{
          width: 250,
          height: 200,
          padding: 20,
        }}>
        <View
          style={{
            width: "100%",
            height: 100,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text
            style={{
              textAlign: "center",
              marginVertical: 10,
              marginHorizontal: "auto",
              fontSize: 15,
              fontWeight: "600",
              fontFamily: "Open Sans",
            }}>
            You have food from another restaurent in your cart..
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginBottom: 10,
              marginHorizontal: "auto",
              fontSize: 15,
              fontWeight: "600",
              fontFamily: "Open Sans",
            }}>
            Do you want to replace it?
          </Text>
        </View>
        {replaceOrderReq ? (
          <View
            style={{
              width: "100%",
              height: 50,
              flexDirection: "row",
              justifyContent: "space-around",
              marginVertical: "auto",
            }}>
            <TouchableOpacity onPress={removeWholeItem}>
              <Icon
                name='check'
                type='font-awesome-5'
                color='#81d4fa'
                size={26}
                containerStyle={{
                  width: 40,
                  height: 40,
                  borderRadius: 25,
                  boxShadow: "1px 3px 6px 1px #C9CCD1",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClose}>
              <Icon
                name='times'
                type='font-awesome-5'
                color='#ff8a65'
                size={26}
                containerStyle={{
                  width: 40,
                  height: 40,
                  borderRadius: 25,
                  boxShadow: "1px 3px 6px 1px #C9CCD1",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <ActivityIndicator
            size='large'
            color='
            #82b1ff'
            style={{
              margin: "auto",
            }}
          />
        )}
      </View>
    </Dialog>
  );
};

export default FoodDialog;

const styles = StyleSheet.create({});
