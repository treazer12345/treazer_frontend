import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image, Icon, Input } from "react-native-elements";
import { Snackbar } from "react-native-paper";
import axios from "axios";
import BASE_URL from "../../api";
import * as ImagePicker from "expo-image-picker";
import { PostContext } from "../../context/postContext";
const { height } = Dimensions.get("window");

const AddPost = () => {
  const { dispatch: postDispatch } = useContext(PostContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sendImgReq, setSendImgReq] = useState(true);
  const [image, setImage] = useState(null);
  const [postRecieved, setPostRecieved] = useState(false);
  const [PostMessage, setPostMessage] = useState("");
  const [postReq, setpostReq] = useState(true);
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const onDismissSnackBar = () => setPostRecieved(false);
  //image upload
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    console.log("result", result);
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
          const pic = `https://res.cloudinary.com/treazer/image/upload/q_30/${data1.secure_url.split("/")[6]
            }/${data1.secure_url.split("/")[7].split(".")[0]}.webp`;
          setImage(pic);
          setSendImgReq(true);
          console.log(pic);
        })
        .catch((err) => {
          console.log(err);
          alert("An Error Occured While Uploading");
        });
    }
  };

  const addPost = () => {
    setpostReq(false);
    axios
      .post(
        `${BASE_URL}/api/posts/createpost`,
        { title, photo: image, description },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "x-token": token,
            "x-refresh-token": refreshtoken,
          },
        }
      )
      .then((res) => {
        const { success, msg, post } = res.data;
        console.log(msg, post, success);
        postDispatch({ type: "ADD_MY_POST", payload: post });
        setPostMessage(msg);
        setPostRecieved(success);
        setTitle("");
        setDescription("");
        setImage(null);
        setpostReq(true);
      })
      .catch((err) => {
        // console.log(err.response.data);
        const { msg, success } = err.response?.data;
        console.log(msg, success);
        setPostMessage(msg);
        setPostRecieved(true);
        setpostReq(true);
      });
  };

  return (
    <View style={styles.container}>
      <Icon
        name='arrow-back'
        type='ionicon'
        color='black'
        size={30}
        onPress={() => window.history.back()}
        containerStyle={{
          marginBottom: 10,
          width: 40,
        }}
      />

      <ScrollView style={{ paddingBottom: 20, width: "100%" }}>
        {image ? (
          <View
            style={{
              width: "95%",
              marginHorizontal: "auto",
              // height: height * 0.3,
            }}>
            <Image
              source={{ uri: image }}
              containerStyle={{
                width: "100%",
                marginHorizontal: "auto",
                height: height * 0.5,
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
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Input
            label='Title *'
            value={title}
            onChangeText={(text) => setTitle(text)}
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
              letterSpacing: 1,
              fontSize: 15,
              fontFamily: "Open Sans",
              padding: 10,
              height: 40,
              fontWeight: "600",
            }}
          />
          <Input
            label={`What's in your mind *`}
            value={description}
            onChangeText={(text) => setDescription(text)}
            multiline
            numberOfLines={6}
            inputContainerStyle={{
              paddingHorizontal: 10,
              boxShadow: "1px 2px 4px 1px #C9CCD1",
              borderRadius: 20,
              height: 120,
            }}
            labelStyle={{
              paddingLeft: 10,
              marginVertical: 10,
            }}
            containerStyle={{
              width: "100%",
              marginHorizontal: "auto",
            }}
            inputStyle={{
              letterSpacing: 1,
              fontSize: 15,
              fontFamily: "Open Sans",
              padding: 10,
              height: 120,
              fontWeight: "600",
            }}
          />
          {postReq ? (
            <TouchableOpacity
              onPress={addPost}
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 10,
                backgroundColor: "#4fc3f7",
                borderRadius: 25,
                width: "90%",
                marginHorizontal: "auto",
                height: 50,
                boxShadow: "3px 4px 6px #bdbdbd, -3px -4px 6px #eeeeee",
              }}>
              <Text
                style={{
                  fontWeight: "800",
                  letterSpacing: 2,
                  fontSize: 18,
                  fontFamily: "Open Sans",
                  color: "#ffffff",
                  textShadow: "1px 0 #ffffff",
                }}>
                Upload
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                marginVertical: 10,
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

          <Snackbar
            visible={postRecieved}
            onDismiss={onDismissSnackBar}
            style={{
              backgroundColor:
                PostMessage === "Something went wrong" ? "#ff5252" : "#43a047",
            }}
            action={{
              label: "Close",
              onPress: () => {
                onDismissSnackBar();
              },
            }}>
            {PostMessage}
          </Snackbar>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddPost;

const styles = StyleSheet.create({
  container: {
    height: height * 0.95,
    width: "100%",
    backgroundColor: "#ffffff",
    // alignItems: "center",
    padding: 20,
  },
  div_2: {
    width: "95%",
    marginHorizontal: "auto",
    height: height * 0.5,
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
});
