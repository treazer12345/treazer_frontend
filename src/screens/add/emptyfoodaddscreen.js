import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/userContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Emptyfoodaddscreen = () => {
  const navigation = useNavigation();
  const { state: userState } = useContext(AuthContext);
  // const user = JSON.parse(localStorage.getItem("user"));

  const notLoggedIn = () => {
    if (userState && !userState.isLogin) {
      return (
        <Button
          onPress={() => navigation.navigate("User", { screen: "Login" })}
          title='LOGIN FIRST'
          type='outline'
          buttonStyle={{
            backgroundColor: "#ffffff",
            borderRadius: 10,
          }}
          containerStyle={{
            marginVertical: 10,
            width: "60%",
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
      );
    } else {
      return (
        <Button
          onPress={() => navigation.navigate("AddItem", { screen: "AddFood" })}
          title='ADD DISH FOR CUSTOMERS'
          type='outline'
          buttonStyle={{
            backgroundColor: "#ffffff",
            borderRadius: 10,
          }}
          containerStyle={{
            marginVertical: 10,
            width: "90%",
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
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}>
        <LazyLoadImage
          style={{
            marginBottom: 10,
            width: 220,
            height: 200,
            resizeMode: "cover",
          }}
          src={require("../../assets/images/dish.webp")}
          effect='blur'
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}>
          <Text
            style={{
              marginTop: 20,
              marginBottom: 10,
              fontSize: 15,
              letterSpacing: 1,
              fontWeight: "600",
              fontFamily: "Open Sans",
              textAlign: "center",
            }}>
            OOPS!! YOU DON'T HAVE ANY RESTAURANT
          </Text>
          <Text
            style={{
              marginBottom: 10,
              color: "#90a4ae",
              fontSize: 13,
              letterSpacing: 1,
              fontWeight: "400",
              fontFamily: "Open Sans",
              textAlign: "center",
            }}>
            create restaurant for your customers
          </Text>
          {notLoggedIn()}
        </View>
      </View>
    </View>
  );
};

export default Emptyfoodaddscreen;

// const styles = StyleSheet.create({});

// else if (userState && userState.user && userState.user.role === "user") {
//   return (
//     <Button
//       onPress={() =>
//         navigation.navigate("User", { screen: "BusinessForm" })
//       }
//       title='UPGRADE TO BUSINESS PROFILE'
//       type='outline'
//       buttonStyle={{
//         backgroundColor: "#ffffff",
//         borderRadius: 10,
//       }}
//       containerStyle={{
//         marginVertical: 10,
//         width: "90%",
//         marginHorizontal: "auto",
//         borderRadius: 10,
//         border: "none",
//         boxShadow: "3px 4px 6px #C9CCD1, -3px -4px 6px #ffffff",
//       }}
//       titleStyle={{
//         fontSize: 13,
//         textShadow: "1px 0 #ffffff",
//         fontWeight: "600",
//         letterSpacing: 3,
//         fontFamily: "Roboto Slab",
//       }}
//     />
//   );
// }
