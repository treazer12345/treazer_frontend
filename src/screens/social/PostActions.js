import React, { useState, useContext } from "react"
import {
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity
} from "react-native"
import { Button, Badge, Avatar } from "react-native-elements"
import axios from "axios"
import BASE_URL from "../../api"
import CommentDrawer from "./CommentDrawer"
import { Portal, Dialog, Snackbar } from "react-native-paper"
import { PostContext } from "../../context/postContext"
import { AuthContext } from "../../context/userContext"
import * as Sharing from "expo-sharing"
import { useNavigation } from "@react-navigation/native"
import { followORunfollow } from "../../functions/postfunction"
const { width, height } = Dimensions.get("window")

const PostActions = ({ route, post, setisLogin }) => {
  const navigation = useNavigation()
  const { dispatch: postDispatch } = useContext(PostContext)
  const { state: userState, dispatch: userDispatch } = useContext(AuthContext)
  const [drawer, setdrawer] = useState(false)
  const toggleDrawer = () => {
    setdrawer(!drawer)
  }

  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user?._id
  const token = localStorage.getItem("token")
  const refreshtoken = localStorage.getItem("refresh-token")
  const likePost = postId => {
    if (!userState.isLogin) {
      setisLogin(true)
    } else {
      axios
        .post(
          `${BASE_URL}/api/posts/likeonpost`,
          { postId },
          {
            headers: {
              "x-token": token,
              "x-refresh-token": refreshtoken
            }
          }
        )
        .then(res => {
          const { msg, likes } = res.data
          // console.log(msg, likes)
          postDispatch({ type: "GET_SINGLE_POST", payload: postId })
          postDispatch({ type: "LIKE_A_POST", payload: { postId, likes } })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  const [followSnackbarOpen, setfollowSnackbarOpen] = useState(false)
  const closefollowSnackbar = () => setfollowSnackbarOpen(false)
  const [followMsg, setFollowMsg] = useState("")
  const follow = (id, postId) => {
    followORunfollow(
      id,
      { postId },
      { userDispatch, postDispatch },
      { setisLogin, setFollowMsg, setfollowSnackbarOpen },
    )
  }

  const sharePost = async postId => {
    if (!userState.isLogin) {
      setisLogin(true)
    } else {
      if (!(await Sharing.isAvailableAsync())) {
        alert(`Uh oh, sharing isn't available on your platform`)
        return
      }
      Sharing.shareAsync(`https://treazer-app.firebaseapp.com/social/postdetails/${postId}`)
    }
  }

  return (
    <View
      style={{
        width: "100%",
        height: route?.name === "FriendProfile" ? 35 : height * 0.18,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        backgroundColor: "#ffffff",
        boxShadow:
          route?.name === "FriendProfile" ? "none" : "0 4px 8px 0 #C9CCD1",
        flexDirection: "column",
        justifyContent: "space-between",
      }}>
      {route?.name !== "FriendProfile" && (
        <View
          style={{
            width: "100%",
            paddingHorizontal: 10,
            marginHorizontal: "auto",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10
          }}>
          <TouchableOpacity
            style={{
              flexDirection: "row"
            }}
            onPress={() =>
              navigation.navigate("Social", {
                screen: "FriendProfile",
                params: { friendId: post.creator?._id }
              })
            }>
            <Avatar
              source={
                post.creator?.photo
                  ? { uri: post.creator?.photo }
                  : require("../../assets/icons/user.png")
              }
              size={40}
              rounded
              onPress={() =>
                navigation.navigate("Social", {
                  screen: "FriendProfile",
                  params: { friendId: post.creator?._id }
                })
              }
              activeOpacity={1}
              renderPlaceholderContent={
                <ActivityIndicator
                  size='small'
                  color='#ffffff'
                  style={{
                    margin: "auto"
                  }}
                />
              }
            />
            <Text
              style={{
                fontSize: route.name === "PostDetails" ? 15 : 12,
                fontWeight: "bold",
                fontFamily: "Open Sans",
                textAlign: "center",
                paddingVertical: 5,
                paddingHorizontal: 5,
                width: route.name === "PostDetails" ? 180 : 120
              }}>
              {route.name === "PostDetails"
                ? post?.creator?.username.slice(0, 25)
                : post?.creator?.username.slice(0, 22)}
            </Text>
          </TouchableOpacity>

          <Button
            title={
              post.creator?.followers?.includes(userId?.toString())
                ? "Unfollow"
                : "Follow"
            }
            type='outline'
            onPress={() => follow(post.creator?._id, post._id)}
            containerStyle={{
              height: 30,
              width: 70,
              borderRadius: 10,
              marginTop: 5,
              backgroundColor: "#ffffff",
              boxShadow: "0px 2px 4px 0px #eeeeee, 0px 2px 4px 0 #eeeeee"
            }}
            buttonStyle={{
              height: 30,
              borderRadius: 10,
              backgroundColor: "#ffffff"
            }}
            titleStyle={{
              fontWeight: "600",
              color: "#40c4ff",
              letterSpacing: 1,
              fontSize: 12,
              fontFamily: "Open Sans"
            }}
          />
        </View>
      )}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent:
            route?.name === "FriendProfile" ? "space-between" : "space-around",
          marginBottom: route?.name === "FriendProfile" ? 0 : 15
        }}>
        <TouchableOpacity
          style={{
            height: 35,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            backgroundColor: "#ffffff",
            flexDirection: "row",
          }}>
          {post.likes.length > 0 && post.likes.includes(userId?.toString()) ? (
            <TouchableOpacity
              onPress={() => likePost(post._id)}
              style={{
                borderRadius: 20,
                width: 35,
                height: 35,
                justifyContent: "center",
                alignItems: "center",
                boxShadow:
                  route?.name === "FriendProfile"
                    ? "none"
                    : "0px 2px 4px 0px #eeeeee, 0px 2px 4px 0px #eeeeee"
              }}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='ionicon'
                viewBox='0 0 512 512'
                width={18}
                height={18}
              >
                <title>Heart</title>
                <path
                  fill='#ff5252'
                  d='M256 448a32 32 0 01-18-5.57c-78.59-53.35-112.62-89.93-131.39-112.8-40-48.75-59.15-98.8-58.61-153C48.63 114.52 98.46 64 159.08 64c44.08 0 74.61 24.83 92.39 45.51a6 6 0 009.06 0C278.31 88.81 308.84 64 352.92 64c60.62 0 110.45 50.52 111.08 112.64.54 54.21-18.63 104.26-58.61 153-18.77 22.87-52.8 59.45-131.39 112.8a32 32 0 01-18 5.56z'
                />
              </svg>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => likePost(post._id)}
              style={{
                borderRadius: 20,
                width: 35,
                height: 35,
                justifyContent: "center",
                alignItems: "center",
                boxShadow:
                  route?.name === "FriendProfile"
                    ? "none"
                    : "0px 2px 4px 0px #eeeeee, 0px 2px 4px 0px #eeeeee"
              }}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='ionicon'
                viewBox='0 0 512 512'
                width={18}
                height={18}
              >
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
            </TouchableOpacity>
          )}
          {post.likes.length > 0 && (
            <Badge
              onPress={() => likePost(post._id)}
              status='error'
              value={post.likes.length}
              containerStyle={{
                position: "absolute",
                top: 0,
                right: 0
              }}
            />
          )}
        </TouchableOpacity>
        <View
          style={{
            height: 35,
            width: 35,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            backgroundColor: "#ffffff",
            flexDirection: "row",
            boxShadow:
              route?.name === "FriendProfile"
                ? "none"
                : "0px 2px 4px 0px #eeeeee, 0px 2px 4px 0px #eeeeee"
          }}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='ionicon'
            viewBox='0 0 512 512'
            width={18}
            height={18}
            onClick={toggleDrawer}>
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
                right: 0
              }}
            />
          )}
        </View>
        <View
          style={{
            height: 35,
            width: 35,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            backgroundColor: "#ffffff",
            boxShadow:
              route?.name === "FriendProfile"
                ? "none"
                : "0px 2px 4px 0px #eeeeee, 0px 2px 4px 0px #eeeeee"
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
      <CommentDrawer post={post} drawer={drawer} toggleDrawer={toggleDrawer} />
      <Portal>
        <Dialog
          visible={followSnackbarOpen}
          onDismiss={closefollowSnackbar}
          style={{ justifyContent: "center" }}>
          <Snackbar
            visible={followSnackbarOpen}
            onDismiss={closefollowSnackbar}
            style={{
              width: width * 0.85,
              marginHorizontal: "auto",
            }}
            duration={4000}>
            <Text
              style={{
                width: width * 0.8,
                textAlign: "center",
                fontFamily: "Open Sans",
                fontSize: 15,
                letterSpacing: 2,
                fontWeight: "600"
              }}>
              {followMsg}
            </Text>
          </Snackbar>
        </Dialog>
      </Portal>
    </View>
  )
}

export default PostActions
