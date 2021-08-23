import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigation } from "@react-navigation/native";
// import { AuthContext } from "../context/userContext";
const { width, height } = Dimensions.get("window");

const SelectChoice = () => {
  const navigation = useNavigation();
  const user = JSON.parse(localStorage.getItem("user"));
  // const { state } = useContext(AuthContext);
  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View
        style={{
          width: "100%",
          marginHorizontal: "auto",
          marginVertical: "auto",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}>
          <LazyLoadImage
            src={require("../../assets/images/share_thought.webp")}
            resizemode='cover'
            effect='blur'
            style={{
              width: 160,
              height: 140,
            }}
          />
          <Button
            onPress={() =>
              navigation.navigate("AddItem", { screen: "AddPost" })
            }
            title='Share your thoughts'
            type='outline'
            buttonStyle={{
              backgroundColor: "#ffffff",
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
              fontSize: 13,
              textShadow: "1px 0 #ffffff",
              fontWeight: "600",
              letterSpacing: 3,
              fontFamily: "Roboto Slab",
            }}
          />
        </View>
        {user && user?.role === "resturant-owner" && (
          <View style={{
            justifyContent: "center", alignItems: "center",
          }}>
            <LazyLoadImage
              src={require("../../assets/images/upload_products.webp")}
              resizemode='cover'
              effect='blur'
              style={{
                width: 160,
                height: 140,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}
            />
            <Button
              onPress={() =>
                navigation.navigate("AddItem", { screen: "AddFood" })
              }
              title='Upload your product'
              type='outline'
              buttonStyle={{
                backgroundColor: "#ffffff",
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
                fontSize: 13,
                textShadow: "1px 0 #ffffff",
                fontWeight: "600",
                letterSpacing: 3,
                fontFamily: "Roboto Slab",
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default SelectChoice;

