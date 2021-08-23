import React, { useState, useEffect, useContext, Fragment } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Icon, Avatar, Image, Button } from "react-native-elements";
import { Portal, Dialog, Snackbar } from "react-native-paper";
import axios from "axios";
import BASE_URL from "../../api";
import { AuthContext } from "../../context/userContext";
import { PostContext } from "../../context/postContext";
import FriendPosts from "./FriendPosts";
import { followORunfollow } from "../../functions/postfunction";
import Loading from "../../navigation/Loading";
const { width, height } = Dimensions.get("window");

const UserProfile = ({ route }) => {
  const { state: userState, dispatch: userDispatch } = useContext(AuthContext);
  const { dispatch: postDispatch } = useContext(PostContext);

  const { friendId } = route.params;
  const [frndReq, setfrndReq] = useState(true);

  const [isLogin, setisLogin] = useState(false);
  const onDismissSnackBar = () => setisLogin(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const token = localStorage.getItem("token")
  const refreshtoken = localStorage.getItem("refresh-token")

  const [openProfilePic, setopenProfilePic] = useState(false);
  const closeProfilePicDialog = () => setopenProfilePic(false);

  useEffect(() => {
    if (friendId) {
      getFriendProfile();
      getFriendPosts();
    }
  }, [friendId]);
  const follow = (id) => {
    followORunfollow(
      id,
      { postId: undefined },
      { userDispatch, postDispatch },
      {
        setisLogin,
        setFollowMsg: undefined,
        setfollowSnackbarOpen: undefined,
      },
      { token, refreshtoken }

    );
  };
  const getFriendProfile = () => {
    setfrndReq(false);
    axios
      .post(`${BASE_URL}/api/user/friendprofile`, { friendId })
      .then((res) => {
        const { friend } = res.data;
        // console.log(friend);
        userDispatch({ type: "GET_FRIEND'S_PROFILE", payload: friend });
        setfrndReq(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [frndPostReq, setfrndPostReq] = useState(true);
  const getFriendPosts = () => {
    setfrndPostReq(false);
    axios
      .post(`${BASE_URL}/api/posts/getfriendposts`, { friendId })
      .then((res) => {
        const { friendPosts } = res.data;
        // console.log(friendPosts);
        postDispatch({ type: "GET_MY_FRIEND'S_POSTS", payload: friendPosts });
        setfrndPostReq(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      <View style={styles.container}>
        {frndReq ? (
          <View style={{ height: height * 0.95 }}>
            <ScrollView style={styles.div_1}>
              <View style={styles.div_2}>
                <Image
                  source={{ uri: userState.friend?.photo }}
                  onPress={() => setopenProfilePic(true)}
                  containerStyle={{
                    height: height * 0.3,
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 15,
                    height: 30,
                    width: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                    backgroundColor: "#ffffff",
                  }}>
                  <Icon
                    name='arrow-back'
                    type='ionicon'
                    color='#424242'
                    size={20}
                    onPress={() => window.history.back()}
                  />
                </View>
                <View style={styles.div_3}>
                  <Avatar
                    source={{ uri: userState.friend?.photo }}
                    size={100}
                    rounded
                    activeOpacity={1}
                    onPress={() => setopenProfilePic(true)}
                    containerStyle={{
                      borderWidth: 5,
                      borderColor: "#ffffff",
                    }}
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
                  <Text style={styles.text_1}>
                    {userState.friend?.username}
                  </Text>
                  <Button
                    title={
                      userState.friend?.followers?.includes(userId?.toString())
                        ? "Unfollow"
                        : "Follow"
                    }
                    type='outline'
                    onPress={() => follow(userState.friend?._id)}
                    containerStyle={{
                      height: 30,
                      width: 70,
                      borderRadius: 10,
                      marginTop: 5,
                      backgroundColor: "#ffffff",
                      boxShadow:
                        "0px 2px 4px 0px #eeeeee, 0px 2px 4px 0 #eeeeee",
                    }}
                    buttonStyle={{
                      height: 30,
                      borderRadius: 10,
                      backgroundColor: "#ffffff",
                    }}
                    titleStyle={{
                      fontWeight: "600",
                      color: "#40c4ff",
                      letterSpacing: 1,
                      fontSize: 12,
                      fontFamily: "Open Sans",
                    }}
                  />
                  <View
                    style={{
                      width: "90%",
                      marginHorizontal: "auto",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 20,
                    }}>
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 15,
                          fontWeight: "600",
                          fontFamily: "Open Sans",
                          color: "#bdbdbd",
                        }}>
                        Followers
                      </Text>
                      <Text
                        style={{
                          marginHorizontal: "auto",
                          fontFamily: "Open Sans",
                          fontWeight: "700",
                          fontSize: 15,
                          color: "#757575",
                        }}>
                        {userState.friend?.followers?.length}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 15,
                          fontWeight: "600",
                          fontFamily: "Open Sans",
                          color: "#bdbdbd",
                        }}>
                        Followings
                      </Text>
                      <Text
                        style={{
                          marginHorizontal: "auto",
                          fontFamily: "Open Sans",
                          fontWeight: "700",
                          fontSize: 15,
                          color: "#757575",
                        }}>
                        {userState.friend?.followings?.length}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 20,
                  width: "100%",
                }}>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    marginBottom: 10,
                    fontWeight: "800",
                    letterSpacing: 1,
                    fontSize: 18,
                    fontFamily: "Open Sans",
                    color: "#455a64",
                    textShadow: "1px 0 #455a64",
                  }}>
                  Photos
                </Text>
                {frndPostReq ? (
                  <FriendPosts route={route} />
                ) : (
                  <Loading />
                )}
              </View>
            </ScrollView>
          </View>
        ) : (
          <View
            style={{
              width,
              flex: 1,
              backfaceVisibility: "#ffffff",
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
      </View>
      <Portal>
        <Dialog
          visible={openProfilePic}
          onDismiss={closeProfilePicDialog}
          style={{ justifyContent: "center" }}>
          <img
            src={userState.friend?.photo}
            style={{
              flex: 1,
            }}
            alt={userState.friend?.username}
          />
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              height: 30,
              width: 30,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              backgroundColor: "#ffffff",
            }}>
            <Icon
              name='close'
              type='ionicon'
              color='#757575'
              size={24}
              onPress={closeProfilePicDialog}
            />
          </View>
        </Dialog>
      </Portal>
      <Portal>
        <Snackbar
          visible={isLogin}
          onDismiss={onDismissSnackBar}
          style={{ bottom: 50 }}
          action={{
            label: "Close",
            onPress: () => {
              onDismissSnackBar();
            },
          }}>
          You are not logged in
        </Snackbar>
      </Portal>
    </Fragment>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    height,
    backgroundColor: "#ffffff",
  },
  div_1: {
    marginTop: "30px",
    marginHorizontal: "auto",
    borderRadius: 20,
    width: "90%",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px 0 #cfd8dc, 0 6px 20px 0 #cfd8dc",
  },
  div_2: {
    width: "100%",
    height: height * 0.6,
    borderRadius: 20,
    boxShadow: "0 2px 4px 0 #cfd8dc, 0 3px 10px 0 #cfd8dc",
  },

  div_3: {
    width: "100%",
    position: "absolute",
    top: height * 0.2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  text_1: {
    marginVertical: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    fontSize: 15,
    fontFamily: "Open Sans",
    color: "#455a64",
    textShadow: "1px 0 #455a64",
    textAlign: "center",
    paddingHorizontal: "auto",
  },
});
