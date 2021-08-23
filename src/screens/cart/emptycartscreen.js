import React from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-elements";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Emptycartscreen = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        height: "100%",
        width: "100%",
      }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}>
        <LazyLoadImage
          style={{
            marginBottom: 10,
            width: 220,
            height: 200,
            resizeMode: "cover",
          }}
          src={require("../../assets/images/lovecouple.webp")}
          effect='blur'
        />
        <Text
          style={{
            marginTop: 20,
            marginBottom: 10,
            fontSize: 15,
            letterSpacing: 1,
            fontWeight: "600",
            fontFamily: "Open Sans",
          }}>
          GOOD FOOD IS ALWAYS COOKING
        </Text>
        <Text
          style={{
            marginTop: 10,
            color: "#90a4ae",
            fontSize: 13,
            letterSpacing: 1,
            fontWeight: "400",
            fontFamily: "Open Sans",
          }}>
          Your cart is empty
        </Text>
        <Text
          style={{
            marginBottom: 10,
            color: "#90a4ae",
            fontSize: 13,
            letterSpacing: 1,
            fontWeight: "400",
            fontFamily: "Open Sans",
          }}>
          Add something from the menu
        </Text>
        <Button
          onPress={() => navigation.navigate("Home", { screen: "Index" })}
          title='BROWSE RESTAURANT'
          type='outline'
          buttonStyle={{
            backgroundColor: "#ffffff",
            borderRadius: 10,
          }}
          containerStyle={{
            marginVertical: 10,
            width: "70%",
            marginHorizontal: "auto",
            borderRadius: 10,
            border: "none",
            boxShadow: "3px 4px 6px #C9CCD1, -3px -4px 6px #ffffff",
          }}
          titleStyle={{
            fontSize: 13,
            textShadow: "1px 0 #ffffff",
            fontWeight: "600",
            letterSpacing: 3,
            fontFamily: "Roboto Slab",
          }}
        />
      </View>
    </View>
  );
};

export default Emptycartscreen;

