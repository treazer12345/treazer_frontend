import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
// import { LazyLoadImage } from "react-lazy-load-image-component";
// import Searchbar from "./searchbar";
import { useNavigation } from "@react-navigation/native";
import { LocationContext } from "../../context/locationcontext";
const Header = () => {
  const navigation = useNavigation();
  const { state: locationState } = useContext(LocationContext);
  return (
    <View style={{ flexDirection: "column", backgroundColor: "#ffffff" }}>
      <View
        style={{
          coureser: "pointer",
          flexDirection: "row",
          height: 50,
          backgroundColor: "white",
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <img
            src={require("../../assets/images/brand_logo.png")}
            alt='Treazer'
            style={{
              marginLeft: 10,
              marginTop: 10,
              width: 140,
              height: 40,
            }}
          />
          {/* <LazyLoadImage
            src={require("../assets/images/treazer logo.webp")}
            resizemode='cover'
            effect='blur'
            alt='Treazer_logo'
            style={{
              marginLeft: 20,
              marginTop: 10,
              width: 120,
              height: 40,
            }}
          /> */}
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 5,
            // border: "1px solid black",
          }}>
          {/* <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              fontFamily: "Open Sans",
              textAlign: "center",
              // color: "#bdbdbd",
            }}>
            {locationState.landmark}
          </Text> */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              fontFamily: "Open Sans",
              letterSpacing: 1,
              textAlign: "center",
              marginTop: 20,
            }}>
            {locationState.landmark?.slice(0, 25)}...
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("UserLocation")}
          style={{
            marginRight: 20,
            justifyContent: "center",
          }}>
          <Icon
            name='map-marker-alt'
            type='font-awesome-5'
            color='#424242'
            size={20}
            style={{ marginTop: 10 }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: "100%",
          background: "none",
        }}>
        {/* <Searchbar /> */}
      </View>
    </View>
  );
};

export default Header;

// const styles = StyleSheet.create({});
