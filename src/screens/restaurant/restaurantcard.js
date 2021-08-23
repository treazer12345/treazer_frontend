import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { RestaurentContext } from "../../context/restaurentContext";
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// import { Image } from "react-native-elements";
const Restaurantcard = ({ scrollPosition }) => {
  const navigation = useNavigation();
  const { state: restaurentState } = useContext(RestaurentContext);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user && user._id;

  return restaurentState.allRestaurent ? (
    restaurentState.allRestaurent.length === 0 ? (
      <View
        style={{
          width: "80%",
          height: 300,
          margin: "auto",
          justifyContent: "center",
          alignItem: "center",
        }}>
        <LazyLoadImage
          style={{
            marginBottom: 10,
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
            textAlign: "center",
            fontFamily: "Open Sans",
            fontWeight: "700",
            color: "#212121",
            fontSize: 15,
            letterSpacing: 2,
            marginVertical: 10,
          }}>
          No restaurant within 6km.
        </Text>
      </View>
    ) : (
      restaurentState.allRestaurent.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={{ marginBottom: 20 }}
          onPress={() => {
            if (userId && item._id.toString() === userId.toString()) {
              navigation.navigate("MyRestaurant", {
                id: item._id,
              });
            } else {
              navigation.navigate("Restaurant", {
                id: item._id,
              });
            }
          }}>
          <View
            style={{
              marginBottom: 0,
              backgroundColor: "#ffffff",
            }}>
            <LazyLoadImage
              src={item.coverPic}
              resizemode='cover'
              effect='blur'
              scrollPosition={scrollPosition}
              placeholderSrc={require("../../assets/images/lazyimage.webp")}
              style={{
                width: "100%",
                flex: 1,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                boxShadow: "0 4px 8px 0 #C9CCD1, 0 6px 20px 0 #C9CCD1",
              }}
            />
            {/* <Image
              source={{ uri: item.coverPic }}
              style={{
                width: "100%",
                height: 200,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                boxShadow: "0 4px 8px 0 #C9CCD1, 0 6px 20px 0 #C9CCD1",
                elevation: 2,
              }}
              PlaceholderContent={
                <ActivityIndicator
                  size='large'
                  color='#ffffff'
                  style={{
                    margin: "auto",
                  }}
                />
              }
            /> */}
            {/* <View
            style={{
              position: "absolute",
              flexDirection: "row",
              bottom: 0,
              height: 30,
              width: 80,
              borderBottomColor: "#ffffff",
              backgroundColor: "#ffffff",
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Icon
              name='star'
              type='font-awesome-5'
              color='#424242'
              size={15}
              iconStyle={{
                marginHorizontal: 5,
              }}
            />

            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                fontFamily: "Open Sans",
                marginVertical: 10,
              }}>
              3.6
            </Text>
          </View> */}
          </View>

          {/* Restaurant Info */}
          <View
            style={{
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginTop: 0,
              marginBottom: 10,
              flexDirection: "column",
              marginHorizontal: "auto",
              borderTopColor: "#ffffff",
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 8px 0 #C9CCD1",
            }}>
            <Text
              style={{
                textAlign: "center",
                color: "#263238",
                fontSize: 20,
                letterSpacing: 1,
                fontWeight: "bold",
                fontFamily: "Roboto Slab",
                marginVertical: 10,
              }}>
              {item.resturant_name}
            </Text>
          </View>
        </TouchableOpacity>
      ))
    )
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
        style={{ marginHorizontal: 20 }}
      />
      {/* <Loading /> */}
    </View>
  );
};

export default trackWindowScroll(Restaurantcard);
