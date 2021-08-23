import React, { useState, useContext, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Icon, Input, CheckBox, Image } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import Axios from "axios";
import BASE_URL from "../../api";
import { ProductContext } from "../../context/productcontext";
// import { RestaurentContext } from "../context/restaurentContext";
import "react-lazy-load-image-component/src/effects/blur.css";
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
const { height } = Dimensions.get("window");
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const Additems = () => {
  // const navigation = useNavigation();
  const { dispatch: productDispatch } = useContext(ProductContext);
  // const { state: restaurentState } = useContext(RestaurentContext);

  const [sendImgReq, setSendImgReq] = useState(true);
  const [image, setImage] = useState(null);
  const [isVeg, setIsVeg] = useState(false);
  const [isNonVeg, setIsNonVeg] = useState(true);
  const [dishName, setDishName] = useState("");
  const [dishQuantity, setDishQuantity] = useState("");
  const [dishType, setDishType] = useState("Rice");
  const [dishPrice, setDishPrice] = useState(0);
  const [aboutDish, setAboutDish] = useState("");
  const [foodReq, setFoodReq] = useState(true);
  const [addDishError, setAddDishError] = useState("");

  useEffect(() => {
    if (isNaN(dishPrice)) {
      setDishPrice(0);
    }
  }, [dishPrice]);

  //success prompt
  const [open2, setOpen2] = useState(false);
  const handleClose2 = () => {
    setOpen2(false);
  };

  //error prompt
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  //image upload
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    console.log(result);
    if (!result.cancelled) {
      let data = {
        file: result.uri,
        upload_preset: "treazer",
        api_key: 489227552964764,
      };
      setSendImgReq(false);
      fetch("https://api.cloudinary.com/v1_1/treazer/image/upload", {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      })
        .then((res) => res.json())
        .then((data1) => {
          const pic = `https://res.cloudinary.com/treazer/image/upload/ar_4:3,c_fill/c_scale,q_30,w_auto,dpr_auto/${data1.secure_url.split("/")[6]
            }/${data1.secure_url.split("/")[7].split(".")[0]}.webp`;

          console.log(pic);
          setImage(pic);
          setSendImgReq(true);
        })
        .catch((err) => {
          console.log(err);
          alert("An Error Occured While Uploading");
        });
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const resturantId = user && user.resturantId;
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const deliveryCharge =
    resturantId.deliveryType === "treazer" ? 24 : resturantId.deliveryPrice;
  //add dish
  const addDish = () => {
    console.log(
      isVeg,
      isNonVeg,
      dishName,
      dishQuantity,
      dishType,
      dishPrice,
      aboutDish
    );
    setFoodReq(false);
    Axios.post(
      `${BASE_URL}/api/product/addproduct`,
      {
        name: dishName,
        description: aboutDish,
        resturantId,
        price: dishPrice + deliveryCharge,
        category: dishType,
        photo: image,
        veg: isVeg ? "Yes" : "No",
        quantity: dishQuantity,
      },
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          "x-token": token,
          "x-refresh-token": refreshtoken,
        },
      }
    )
      .then((res) => {
        const { product } = res.data;
        console.log(product);
        productDispatch({
          type: "ADD_MY_RESTAURENT_PRODUCT",
          payload: product,
        });
        setDishName("");
        setDishPrice("");
        setDishQuantity("");
        setImage(null);
        setAboutDish("");
        setOpen2(true);
        setFoodReq(true);
        // navigation.navigate("User", { screen: "Profile" });
      })
      .catch((err) => {
        err.response && console.log(err.response.data);
        const error =
          err.response && err.response.data.err
            ? err.response.data.err
            : err.response.data.message;
        setAddDishError(error);
        setFoodReq(true);
        setOpen(true);
      });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          height: height * 0.95,
          paddingVertical: 20,
          paddingHorizontal: 5,
        }}>
        <ScrollView style={styles.div_1}>
          {image ? (
            <View style={{ width: "95%", marginHorizontal: "auto" }}>
              <Image
                source={{ uri: image }}
                containerStyle={{
                  width: "100%",
                  marginHorizontal: "auto",
                  height: 180,
                  borderRadius: 20,
                  boxShadow: "1px 3px 6px 1px #C9CCD1",
                  resizeMode: "contain",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  flexDirection: "row",
                  right: 0,
                  background: "none",
                  width: 30,
                  marginRight: 20,
                  marginTop: 15,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                }}>
                <TouchableOpacity onPress={() => setImage(null)}>
                  <Icon
                    name='times-circle'
                    type='font-awesome-5'
                    color='#ffffff'
                    size={26}
                    iconStyle={{
                      marginHorizontal: 10,
                    }}
                    containerStyle={{
                      backgroundColor: "#90a4ae",
                      height: 30,
                      width: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 20,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : sendImgReq ? (
            <TouchableOpacity style={styles.div_2} onPress={pickImage}>
              <Icon
                name='plus'
                type='font-awesome-5'
                color='#9e9e9e'
                size={30}
                iconStyle={{
                  marginTop: 20,
                }}
              />
              <Text style={styles.text_1}>Add Product Image Here</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.div_2}>
              <ActivityIndicator
                size='large'
                color='#82b1ff'
                style={{
                  margin: "auto",
                }}
              />
            </View>
          )}

          <View>
            <Input
              label='Name of your dish *'
              value={dishName}
              onChangeText={(text) => setDishName(text)}
              inputContainerStyle={{
                paddingHorizontal: 10,
                boxShadow: "1px 2px 4px 1px #C9CCD1",
                borderRadius: 20,
                height: 40,
              }}
              labelStyle={{
                paddingLeft: 10,
                marginVertical: 10,
              }}
              containerStyle={{
                marginTop: 20,
                width: "100%",
                marginHorizontal: "auto",
              }}
              inputStyle={{
                letterSpacing: 2,
                fontSize: 15,
                fontFamily: "Open Sans",
              }}
            />
            <Text
              style={{
                fontFamily: "Open Sans",
                fontSize: 15,
                fontWeight: "700",
                marginTop: 20,
                marginLeft: 20,
                color: "rgb(134, 147, 158)",
              }}>
              Dish Type *
            </Text>
            <Picker
              selectedValue={dishType}
              onValueChange={(itemValue, itemIndex) => setDishType(itemValue)}
              style={{
                marginTop: 10,
                width: "95%",
                height: 40,
                borderRadius: 20,
                marginHorizontal: "auto",
                boxShadow: "1px 2px 4px 1px #C9CCD1",
                paddingVertical: 10,
                paddingHorizontal: 10,
                background: "#f5f5f5",
                border: "none",
                color: "#757575",
                fontWeight: "bold",
                letterSpacing: 2,
                fontSize: 15,
                fontFamily: "Open Sans",
              }}>
              <Picker.Item label='Rice' value='Rice' />
              <Picker.Item label='Noodles' value='Noodles' />
              <Picker.Item label='Tandoori' value='Tandoori' />
              <Picker.Item label='Fast Food' value='Fast Food' />
              <Picker.Item label='Mughlai' value='Mughlai' />
              <Picker.Item label='Chinese' value='Chinese' />
              <Picker.Item label='Thali' value='Thali' />
              <Picker.Item label='Cake' value='Cake' />
              <Picker.Item label='Desserts' value='Desserts' />
              <Picker.Item label='Others...' value='Others' />
            </Picker>
            <Input
              label='Add Quantity *'
              value={dishQuantity}
              onChangeText={(text) => setDishQuantity(text)}
              inputContainerStyle={{
                paddingHorizontal: 10,
                boxShadow: "1px 2px 4px 1px #C9CCD1",
                borderRadius: 20,
                height: 40,
              }}
              labelStyle={{
                paddingLeft: 10,
                marginVertical: 10,
              }}
              containerStyle={{
                marginTop: 20,
                width: "100%",
                marginHorizontal: "auto",
              }}
              inputStyle={{
                letterSpacing: 2,
                fontSize: 15,
                fontFamily: "Open Sans",
              }}
            />
            <Input
              label='Price of your dish *'
              value={dishPrice}
              keyboardType='number-pad'
              placeholder='Rs.'
              onChangeText={(text) => {
                setDishPrice(parseInt(text));
              }}
              inputContainerStyle={{
                paddingHorizontal: 10,
                boxShadow: "1px 2px 4px 1px #C9CCD1",
                borderRadius: 20,
                height: 40,
              }}
              labelStyle={{
                paddingLeft: 10,
                marginVertical: 10,
              }}
              containerStyle={{
                marginTop: 20,
                width: "100%",
                marginHorizontal: "auto",
              }}
              inputStyle={{
                letterSpacing: 2,
                fontSize: 15,
                fontFamily: "Open Sans",
              }}
            />
            <Text
              style={{
                fontFamily: "Open Sans",
                fontSize: 12,
                fontWeight: "400",
                // marginTop: 5,
                marginBottom: 20,
                marginLeft: 20,
                color: "#bdbdbd",
              }}>
              Total =
              {resturantId.deliveryType === "self"
                ? dishPrice + resturantId.deliveryPrice
                : dishPrice + 24}
              (Delivery + Convienence)
            </Text>
            <CheckBox
              title='Veg'
              checked={isVeg}
              onPress={() => {
                setIsVeg(!isVeg);
                setIsNonVeg(!isNonVeg);
              }}
              fontFamily='Open Sans'
            />
            <CheckBox
              title='Non-veg'
              checked={isNonVeg}
              onPress={() => {
                setIsVeg(!isVeg);
                setIsNonVeg(!isNonVeg);
              }}
              fontFamily='Open Sans'
            />
            <Input
              label='Description of the dish *'
              value={aboutDish}
              onChangeText={(text) => setAboutDish(text)}
              multiline
              numberOfLines={4}
              inputContainerStyle={{
                paddingHorizontal: 10,
                boxShadow: "1px 2px 4px 1px #C9CCD1",
                borderRadius: 20,
                height: 85,
              }}
              labelStyle={{
                paddingLeft: 10,
                marginVertical: 10,
              }}
              containerStyle={{
                marginTop: 20,
                width: "100%",
                marginHorizontal: "auto",
              }}
              inputStyle={{
                letterSpacing: 2,
                fontSize: 15,
                fontFamily: "Open Sans",
              }}
            />
          </View>
          <Text
            style={{
              fontFamily: "Open Sans",
              fontSize: 15,
              fontWeight: "700",
              marginTop: 20,
              marginLeft: 20,
              color: "rgb(134, 147, 158)",
            }}>
            * fields are required
          </Text>
          {foodReq ? (
            <TouchableOpacity style={styles.button_1} onPress={addDish}>
              <Text
                style={{
                  color: "#ffffff",
                  textShadow: "1px 0 #ffffff",
                  letterSpacing: 3,
                  marginVertical: 10,
                }}>
                Add Dish
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                marginVertical: 20,
              }}>
              <ActivityIndicator
                size='large'
                color='#82b1ff'
                style={{
                  margin: "auto",
                }}
              />
            </View>
          )}
          <Dialog open={open2} onClose={handleClose2}>
            <Alert onClose={handleClose2} severity='success'>
              New food is added to menu
            </Alert>
          </Dialog>
          <View style={{ width: "100%", height: 10 }}></View>
          {addDishError && (
            <Dialog open={open} onClose={handleClose}>
              <Alert severity='error'>* {addDishError}</Alert>
            </Dialog>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Additems;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  div_1: {
    marginHorizontal: "auto",
    marginVertical: 10,
    width: "95%",
    backgroundColor: "#fafafa",
    borderRadius: 20,
    padding: 10,
    boxShadow: "1px 2px 2px 1px #C9CCD1, -1px -2px 2px 1px #C9CCD1",
  },
  div_2: {
    width: "95%",
    marginHorizontal: "auto",
    height: "20%",
    backgroundColor: "#eeeeee",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRadius: 20,
    boxShadow: "1px 3px 6px 1px #C9CCD1",
  },
  text_1: {
    marginVertical: 10,
    color: "#9e9e9e",
    letterSpacing: 1,
    fontSize: 20,
    textShadow: "1px 0 #e0e0e0",
  },
  button_1: {
    marginHorizontal: "auto",
    marginVertical: 20,
    width: "80%",
    height: 40,
    borderRadius: 20,
    textAlign: "center",
    backgroundColor: "#29b6f6",
    boxShadow: "1px 3px 6px 1px #C9CCD1",
  },
});
