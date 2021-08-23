import React, { useEffect, useContext, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native"
import { Icon, Badge, Avatar, Image, Input } from "react-native-elements";
import { Portal, Dialog } from "react-native-paper";
import { Dialog as CommentDialog, DialogContent } from '@material-ui/core';
import { PostContext } from "../../context/postContext";
import axios from "axios";
import BASE_URL from "../../api";
import * as Sharing from "expo-sharing";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { makeComment } from "../../functions/postfunction.js"
const { width, height } = Dimensions.get("window");


const GridContent = ({ route }) => {
  const navigation = useNavigation()
  const { state: postState, dispatch: postDispatch } = useContext(PostContext);
  const [deleteDialog, setdeleteDialog] = useState(false);
  const closedeleteDialog = () => setdeleteDialog(false);
  const [deletePostId, setdeletePostId] = useState(null);
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const [comment, setComment] = useState("");
  const [post, setPost] = useState(null);
  const [dialog, setdialog] = useState(false)

  const toggleDialog = () => {
    setdialog(!dialog)
  }
  useEffect(() => {
    if (postState.myPosts.length === 0) {
      getUserPosts();
    }
  }, []);
  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (dialog) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [dialog]);
  const getUserPosts = () => {
    axios
      .post(
        `${BASE_URL}/api/posts/getuserposts`,
        {},
        {
          headers: {
            "x-token": token,
            "x-refresh-token": refreshtoken,
          },
        }
      )
      .then((res) => {
        const { posts } = res.data;
        // console.log(posts);
        if (route.name === "FriendProfile") {
          postDispatch({ type: "GET_MY_FRIEND'S_POSTS", payload: posts });
        } else {
          postDispatch({ type: "GET_MY_POSTS", payload: posts });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [deletePostReq, setdeletePostReq] = useState(true);
  const [commentInput, setCommentInput] = useState(false);
  const deletePost = (postId) => {
    setdeletePostReq(false);
    axios
      .post(
        `${BASE_URL}/api/posts/deletepost`,
        { postId },
        {
          headers: {
            "x-token": token,
            "x-refresh-token": refreshtoken,
          },
        }
      )
      .then((res) => {
        const { msg } = res.data;
        console.log(msg);
        postDispatch({ type: "DELETE_POST", payload: postId });
        setdeletePostReq(true);
        closedeleteDialog();
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const commentOnPost = (postId) => {
    makeComment(postId, comment,
      { setisLogin: undefined, setcomment: undefined },
      { postDispatch })
    setComment("")
    setCommentInput(false)
  }

  const sharePost = async (postId) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }
    Sharing.shareAsync(`https://treazer.com/social/postdetails/${postId}`);
  };

  return postState?.myPosts?.length === 0 ? (
    <View
      style={{
        width: "100%",
        height: 50,
        alignContent: "center",
        justifyContent: "center",
        letterSpacing: 1,
        marginBottom: 10,
      }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 15,
          fontWeight: "700",
          fontFamily: "Roboto Slab",
          color: "#bdbdbd",
        }}>
        You don't have any post
      </Text>
    </View>
  ) : (
    <View>
      {postState.myPosts?.map((post, idx) => (
        <View style={styles.container} key={idx}>
          <LazyLoadImage
            src={post.photo}
            resizemode='cover'
            effect='blur'
            placeholderSrc={require("../../assets/images/lazyimage.webp")}
            style={{
              marginLeft: "auto",
              width: "100%",
              flex: 1,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}
          />
          <View
            style={{
              backgroundColor: "#ffffff",
              width: "100%",
              height: 40,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 5,
            }}>
            <View
              style={{
                height: 35,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                backgroundColor: "#ffffff",
                flexDirection: "row",
                // boxShadow: "0px 2px 4px 0px #eeeeee, 0px 2px 4px 0px #eeeeee",
              }}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='ionicon'
                viewBox='0 0 512 512'
                width={18}
                height={18}>
                <title>Heart</title>
                <path
                  d='M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z'
                  fill='#ffffff'
                  stroke='#ff5252'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='32'
                />
              </svg>
              {post.likes.length > 0 && (
                <Badge
                  status='error'
                  value={post.likes.length}
                  containerStyle={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                />
              )}
            </View>
            <View
              style={{
                height: 35,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                backgroundColor: "#ffffff",
                flexDirection: "row",
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='ionicon'
                viewBox='0 0 512 512'
                width={18}
                height={18}
                onClick={() => {
                  setPost(post)
                  toggleDialog()
                }
                }
              >
                <title>Chatbox</title>
                <path
                  d='M408 64H104a56.16 56.16 0 00-56 56v192a56.16 56.16 0 0056 56h40v80l93.72-78.14a8 8 0 015.13-1.86H408a56.16 56.16 0 0056-56V120a56.16 56.16 0 00-56-56z'
                  fill='#ffffff'
                  stroke='#4caf50'
                  strokeLinejoin='round'
                  strokeWidth='32'
                />
              </svg>
              {post.comments.length > 0 && (
                <Badge
                  status='success'
                  value={post.comments.length}
                  containerStyle={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                />
              )}
            </View>
            <View
              style={{
                height: 35,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                backgroundColor: "#ffffff",
                flexDirection: "row",
              }}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='ionicon'
                viewBox='0 0 512 512'
                width={18}
                height={18}
                onClick={() => sharePost(post._id)}>
                <title>Share Social</title>
                <circle
                  cx='128'
                  cy='256'
                  r='48'
                  fill='#ffffff'
                  stroke='#40c4ff'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='32'
                />
                <circle
                  cx='384'
                  cy='112'
                  r='48'
                  fill='#ffffff'
                  stroke='#40c4ff'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='32'
                />
                <circle
                  cx='384'
                  cy='400'
                  r='48'
                  fill='#ffffff'
                  stroke='#40c4ff'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='32'
                />
                <path
                  fill='none'
                  stroke='#40c4ff'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='32'
                  d='M169.83 279.53l172.34 96.94M342.17 135.53l-172.34 96.94'
                />
              </svg>
            </View>
          </View>
          <Icon
            name='pen'
            type='font-awesome-5'
            color='#4caf50'
            size={15}
            containerStyle={{
              position: "absolute",
              top: 10,
              left: 10,
              borderRadius: 20,
              width: 30,
              height: 30,
              justifyContent: "center",
              backgroundColor: "#ffffff",
            }}
          />
          <Icon
            name='trash'
            type='font-awesome-5'
            color='#ff5252'
            size={15}
            onPress={() => {
              setdeletePostId(post._id);
              setdeleteDialog(true);
            }}
            containerStyle={{
              position: "absolute",
              top: 10,
              right: 10,
              borderRadius: 20,
              width: 30,
              height: 30,
              justifyContent: "center",
              backgroundColor: "#ffffff",
            }}
          />
        </View>
      ))}
      <Portal>
        <Dialog
          visible={deleteDialog}
          onDismiss={closedeleteDialog}
          style={{ justifyContent: "center" }}>
          <View>
            <Text
              style={{
                marginVertical: 20,
                textAlign: "center",
                fontSize: 15,
                fontWeight: "700",
                fontFamily: "Open Sans",
              }}>
              Do you want to delete this post?
            </Text>
            {deletePostReq ? (
              <View
                style={{
                  width: "100%",
                  height: 50,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginBottom: 10,
                }}>
                <TouchableOpacity onPress={() => deletePost(deletePostId)}>
                  <Icon
                    name='check'
                    type='font-awesome-5'
                    color='#81d4fa'
                    size={26}
                    containerStyle={{
                      width: 40,
                      height: 40,
                      borderRadius: 25,
                      boxShadow: "1px 3px 6px 1px #C9CCD1",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={closedeleteDialog}>
                  <Icon
                    name='times'
                    type='font-awesome-5'
                    color='#ff8a65'
                    size={26}
                    containerStyle={{
                      width: 40,
                      height: 40,
                      borderRadius: 25,
                      boxShadow: "1px 3px 6px 1px #C9CCD1",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <ActivityIndicator
                size='large'
                color='#82b1ff'
                style={{
                  marginVertical: 10,
                }}
              />
            )}
          </View>
        </Dialog>
      </Portal>
      {post &&
        <CommentDialog
          open={dialog}
          onClose={toggleDialog}
          scroll="paper"
          fullWidth={true}
          maxWidth="80%"
        >
          <DialogContent dividers={true}
            style={{
              width: "100%", height: 500, padding: 0
            }}>
            {post.comments.length === 0 ? <View
              style={{
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
            </View> : post?.comments.map((comment, idx) =>
              <View key={idx} style={{
                flexDirection: "row",
                marginTop: 15,
                marginHorizontal: 10,
              }}>
                <Avatar
                  source={
                    comment.creator?.photo
                      ? { uri: comment.creator.photo }
                      : require("../../assets/icons/user.png")
                  }
                  size={40}
                  rounded
                  onPress={() => {
                    navigation.navigate("Social", {
                      screen: "FriendProfile",
                      params: { friendId: comment.creator?._id }
                    });
                    toggleDialog()
                  }
                  }
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
                <View
                  style={{
                    maxWidth: "80%",
                    borderRadius: 15,
                    backgroundColor: "#eeeeee",
                    marginLeft: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    // marginVertical: 10
                  }}>
                  <Text
                    onPress={() => {
                      navigation.navigate("Social", {
                        screen: "FriendProfile",
                        params: { friendId: comment.creator?._id }
                      });
                      toggleDialog()
                    }
                    }
                    style={{
                      width: "100%",
                      // marginHorizontal:"auto",
                      fontSize: 12,
                      fontWeight: "700",
                      color: "black",
                      fontFamily: "Open Sans",
                    }}>
                    {comment.creator?.username}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "400",
                      color: "black",
                      fontFamily: "Open Sans",
                    }}>
                    {comment.body}
                  </Text>
                </View>
              </View>
            )}
            <Input
              placeholder='Write a comment...'
              value={comment}
              onChangeText={(text) => setComment(text)}
              inputContainerStyle={{
                paddingHorizontal: 10,
                backgroundColor: "#ffffff",
                borderColor: "#212121",
                borderRadius: 20,
                height: 40,
                width: "100%",
                border: "1px solid black"
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
                display: commentInput ? "block" : "none",
                position: "absolute",
                bottom: 0,
                width: "70%",
                marginHorizontal: "auto",

              }}
              inputStyle={{
                letterSpacing: 1,
                fontSize: 15,
                fontFamily: "Open Sans",
                padding: 10,
                height: 40,
                width: "60%",
                fontWeight: "600",
              }}
            />
            <Icon
              raised
              name='comment-alt'
              type='font-awesome-5'
              color='#4caf50'
              size={24}
              onPress={() => setCommentInput(!commentInput)}
              containerStyle={{
                position: "absolute",
                right: 10,
                bottom: 10,
                backgroundColor: '#bdbdbd',
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </DialogContent>
        </CommentDialog>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginHorizontal: "auto",
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    boxShadow: "0px 2px 4px 0px #bdbdbd",
  },
  gridView: {
    marginTop: 10,
    width: "100%",
  },
  itemContainer: {
    borderRadius: 20,
    height: 250,
  },
});

export default GridContent;
