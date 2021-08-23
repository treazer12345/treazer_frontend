import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LazyLoadImage } from "react-lazy-load-image-component";
const Restaurantlist = ({ item, onSelectCategory, dishFilterReq }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.2}
      disabled={dishFilterReq ? false : true}
      style={{
        padding: 10,
        paddingBottom: 20,
        backgroundColor: "#f5f5f5",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        marginLeft: 10,
        boxShadow: "0px 4px 4px 0px #C9CCD1, 0px 0px 2px #C9CCD1",
        elevation: 2,
      }}
      onPress={() => onSelectCategory(item.name)}>
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          boxShadow: "2px 2px 2px #bdbdbd",
          elevation: 2,
        }}>
        {dishFilterReq ? (
          <LazyLoadImage
            style={{
              width: 30,
              height: 30,
              resizeMode: "contain",
            }}
            src={item.icon}
            effect='blur'
            placeholderSrc='https://png.pngtree.com/png-vector/20190830/ourlarge/pngtree-food-icon-design-vector-png-image_1708316.jpg'
          />
        ) : (
          <ActivityIndicator
            size='small'
            color='#82b1ff'
            style={{
              margin: "auto",
            }}
          />
        )}
      </View>

      <Text
        style={{
          marginTop: 10,
          color: "#212121",
          fontWeight: "600",
          fontFamily: "Open Sans",
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default Restaurantlist;

const styles = StyleSheet.create({});
