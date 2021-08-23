import React, { useContext } from "react";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { CartContext } from "../../context/cartContext";

const ItemQuantity = ({ itemId }) => {
  const { state: cartState } = useContext(CartContext);

  let quantity;

  if (cartState.cartItems.cartItem && cartState.cartItems.cartItem.length > 0) {
    const quantityItem = cartState.cartItems.cartItem.find(
      (item) => item.productId._id.toString() === itemId.toString() && item
    );

    if (quantityItem !== undefined) {
      quantity = quantityItem.quantity;
    }
  }
  console.log(quantity);
  return (
    <Text
      style={{
        height: 25,
        border: "none",
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 18,
        fontWeight: 900,
        color: "#9e9e9e",
        fontFamily: "Open Sans",
      }}>
      {quantity}
    </Text>
  );
};

export default ItemQuantity;

const styles = StyleSheet.create({});
