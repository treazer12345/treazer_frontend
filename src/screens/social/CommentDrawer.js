import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Icon, Input, Avatar, Image } from "react-native-elements";
import { Snackbar } from "react-native-paper";
import Drawer from "@material-ui/core/Drawer";
import { PostContext } from "../../context/postContext";
import { AuthContext } from "../../context/userContext";
import { makeComment } from "../../functions/postfunction.js"
const { height } = Dimensions.get("window");

const CommentDrawer = ({ post, drawer, toggleDrawer }) => {
  // console.log(post)
  const { dispatch: postDispatch } = useContext(PostContext);
  const [comment, setcomment] = useState("");
  const [isLogin, setisLogin] = useState(false);
  const onDismissSnackBar = () => setisLogin(false);

  const commentOnPost = (postId) => {
    makeComment(postId, comment,
      { setisLogin, setcomment },
      { postDispatch })
  }

  return (
    <Drawer anchor='bottom' open={drawer} onClose={toggleDrawer}>
      <SafeAreaView
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          height: height * 0.9,
        }}>
        <View
          style={{
            height: 50,
            width: "100%",
            backgroundColor: "#ffffff",
            borderBottomWidth: 1,
            borderBottomColor: "#bdbdbd",
          }}>
          <Icon
            name='arrow-left'
            type='font-awesome-5'
            color='#757575'
            size={20}
            onPress={toggleDrawer}
            containerStyle={{
              left: 10,
              marginVertical: "auto",
              width: 30,
            }}
          />
        </View>

        <ScrollView
          style={{
            backgroundColor: "#ffffff",
            width: "100%",
            padding: 10,
          }}>
          {post.comments.length !== 0 ? (
            post.comments.map((Comment, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  marginVertical: 20,
                }}>
                <Avatar
                  source={
                    Comment.creator?.photo
                      ? { uri: Comment.creator.photo }
                      : require("../../assets/icons/user.png")
                  }
                  size={40}
                  rounded
                  onPress={() => console.log("Works!")}
                  activeOpacity={1}
                  renderPlaceholderContent={
                    <ActivityIndicator
                      size='small'
                      color='#ffffff'
                      style={{
                        margin: "auto",
                      }}
                    />
                  }
                />
                <View>
                  <View
                    style={{
                      width: "80%",
                      borderRadius: 15,
                      backgroundColor: "#eeeeee",
                      marginLeft: 10,
                      paddingHorizontal: 10,
                      paddingBottom: 10,
                      paddingTop: 5,
                    }}>
                    <Text
                      style={{
                        width: "90%",
                        // marginHorizontal:"auto",
                        fontSize: 12,
                        fontWeight: "700",
                        color: "black",
                        fontFamily: "Open Sans",
                      }}>
                      {Comment.creator?.username}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: "black",
                        fontFamily: "Open Sans",
                      }}>
                      {Comment.body}
                    </Text>
                  </View>
                  {/*<View style={{ marginTop: 5, marginLeft: 10 }}>*/}
                  {/*  <Text>2h</Text>*/}
                  {/*</View>*/}
                </View>
              </View>
            ))
          ) : (
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Image
                source={require("../../assets/images/comment.webp")}
                style={{
                  width: 200,
                  height: 200,
                  opacity: 0.2,
                  marginTop: 20,
                }}
                PlaceholderContent={
                  <ActivityIndicator
                    size='large'
                    color='#ffffff'
                    style={styles.posterImage}
                  />
                }
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#bdbdbd",
                  fontFamily: "Open Sans",
                  marginTop: 30,
                }}>
                No Comments Yet
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "400",
                  color: "#bdbdbd",
                  fontFamily: "Open Sans",
                }}>
                Be the first to comment.
              </Text>
            </View>
          )}
        </ScrollView>

        <Input
          placeholder='Write a comment...'
          value={comment}
          onChangeText={(text) => setcomment(text)}
          inputContainerStyle={{
            paddingHorizontal: 10,
            backgroundColor: "#eeeeee",
            borderColor: "#ffffff",
            borderRadius: 20,
            height: 40,
          }}
          rightIcon={
            <Icon
              name='greater-than'
              type='font-awesome-5'
              color='#40c4ff'
              size={20}
              onPress={() => commentOnPost(post._id)}
            />
          }
          rightIconContainerStyle={{
            display: comment === "" ? "none" : "block",
            height: 20,
            paddingRight: 0,
            marginHorizontal: "auto",
            marginLeft: 5,
          }}
          containerStyle={{
            borderTopWidth: 1,
            borderTopColor: "#bdbdbd",
            width: "100%",
            marginHorizontal: "auto",
            paddingTop: 10,
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
        <Snackbar
          visible={isLogin}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Close",
            onPress: () => {
              onDismissSnackBar();
            },
          }}>
          You are not logged in
        </Snackbar>
      </SafeAreaView>
    </Drawer>
  );
};

export default CommentDrawer;

const styles = StyleSheet.create({
  posterImage: {
    width: "100%",
    height: height * 0.6,
    resizeMode: "cover",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});
