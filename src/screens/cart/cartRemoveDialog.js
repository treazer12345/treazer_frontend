import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Icon } from "react-native-elements";
import Dialog from "@material-ui/core/Dialog";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../../context/cartContext";
import BASE_URL from "../../api";
const CartRemoveDialog = ({ dialog2, Transition, handleDialogClose2 }) => {
  const [reqDeleteCart, setReqDeleteCart] = useState(true);
  const navigation = useNavigation();
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const deleteCart = () => {
    setReqDeleteCart(false);
    import("axios").then((Axios) => {
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
          setReqDeleteCart(true);
          handleDialogClose2();
          navigation.navigate("Cart", { screen: "Cart-Item" });
        })
        .catch((err) => console.log(err));
    });
  };

  return (
    <Dialog
      open={dialog2}
      TransitionComponent={Transition}
      onClick={handleDialogClose2}
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
            It's the last item remaining in the cart
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
            Do you want to remove it?
          </Text>
        </View>
        {reqDeleteCart ? (
          <View
            style={{
              width: "100%",
              height: 50,
              flexDirection: "row",
              justifyContent: "space-around",
              marginVertical: "auto",
            }}>
            <TouchableOpacity onPress={deleteCart}>
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
            <TouchableOpacity onPress={handleDialogClose2}>
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

export default CartRemoveDialog;

const styles = StyleSheet.create({});
