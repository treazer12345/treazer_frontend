import React, { useContext, useEffect } from 'react'
import {
    Text, View,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native'
import { Icon, Avatar } from "react-native-elements";
import { PostContext } from "../../context/postContext";
import { useNavigation } from "@react-navigation/native"
import { getAllPosts, findSinglePost } from "../../functions/postfunction"


const NotificationBar = ({ noti, deleteNotification }) => {
    const { state: postState, dispatch: postDispatch } = useContext(PostContext)
    const navigation = useNavigation()
    let postId = ""
    let profilePic = ""
    let postNoti = ""
    let whoLiked = ""
    if (noti.postId !== undefined) {
        postId = noti.postId
        profilePic = noti?.body?.split(" ")[5]
        postNoti = noti?.body?.split(".")[0]
        whoLiked = noti?.body?.split("id")[1]
    }
    const post = postState?.allPosts?.find((p) => p._id.toString() === postId.toString())
    const singlePostId = postState?.singlePost?._id.toString()
    useEffect(() => {
        if (postState?.allPosts?.length === 0) {
            getAllPosts(
                postDispatch,
                { setpostReq: undefined },
                {
                    setsinglePostReq: undefined,
                    postId: undefined
                },
                { offSet: 0 }
            )
        }
    }, [])

    return (
        <View
            style={{
                backGroundColor: "#ffffff",
                width: "100%",
                // height: 100,
                justifyContent: "center",
                alignItems: "center",
                // border: "1px solid black"
            }}>
            <TouchableOpacity
                style={{
                    width: "100%",
                    height: 80,
                    borderBottomWidth: 1,
                    borderBottomColor: "#90a4ae",
                    backgroundColor: "#f5f5f5",
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginHorizontal: "auto",
                }}
                onPress={() => {
                    if (noti.postId !== undefined && post !== undefined) {
                        postDispatch({
                            type: "FIND_SINGLE_POST",
                            payload: post
                        })
                        navigation.navigate("Social", {
                            screen: "PostDetails",
                            params: { postId: noti.postId }
                        })
                    } else if (singlePostId !== noti.postId.toString()) {
                        findSinglePost(postDispatch, noti.postId, navigation)
                    } else {
                        navigation.navigate("Social", {
                            screen: "PostDetails",
                            params: { postId: noti.postId }
                        })
                    }
                }
                }
            >
                <View style={{
                    flexDirection: "row"
                }}>
                    <Avatar
                        source={
                            profilePic ? profilePic :
                                "https://res.cloudinary.com/treazer/image/upload/v1625674774/logo/man_btyjgf.png"

                        }
                        size={40}
                        rounded
                        onPress={() => {
                            if (whoLiked && whoLiked !== undefined) {
                                navigation.navigate("Social", {
                                    screen: "FriendProfile",
                                    params: { friendId: whoLiked }
                                })
                            }
                        }
                        }
                        activeOpacity={1}
                        renderPlaceholderContent={
                            <ActivityIndicator
                                size='small'
                                color='#bdbdbd'
                                style={{
                                    margin: "auto"
                                }}
                            />
                        }
                    />
                    <Text
                        style={{
                            color: "#b0bec5",
                            fontSize: 14,
                            fontWeight: "700",
                            fontFamily: "Open Sans",
                            textAlign: "center",
                            marginLeft: 15,
                            marginVertical: "auto"
                        }}>
                        {postNoti || noti.body}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() =>
                        deleteNotification(
                            noti._id,
                            noti.resturantId,
                            noti.userId
                        )
                    }>
                    <Icon
                        name='trash'
                        type='font-awesome'
                        color='#e91e63'
                        size={20}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    )
}

export default NotificationBar

// const styles = StyleSheet.create({})
