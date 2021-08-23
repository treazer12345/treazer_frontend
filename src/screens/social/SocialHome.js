import React, { useContext, useState, useEffect } from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import Refresh from "../refresh"
import TreazerSocial from "./TreazerSocial"
import SocialHeader from "./SocialHeader"
import { PostContext } from "../../context/postContext"
import { getAllPosts } from "../../functions/postfunction"
import { getNotifications } from "../../functions/notificationfunction";
import { NotificationContext } from "../../context/notificationContext"

const { height } = Dimensions.get("window")

const SocialHome = ({ route }) => {
  const { state: postState, dispatch: postDispatch } = useContext(PostContext)
  const { state: notiState, dispatch: notiDispatch } = useContext(
    NotificationContext
  );

  const [postReq, setpostReq] = useState(true)
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user && user._id;
  const resturantId = user && user.resturantId?._id;

  useEffect(() => {
    if (!postState.allPosts || postState.allPosts?.length === 0) {
      getAllPosts(
        postDispatch,
        { setpostReq },
        {
          setsinglePostReq: undefined,
          postId: undefined
        },
        { offSet: postState.allPosts.length }
      )
    }
    if (
      notiState.userNotifications === null &&
      notiState.restaurantNotifications === null && userId !== null
    ) {
      getNotifications(userId, resturantId, notiDispatch);
    }
  }, [])
  return (
    <Refresh>
      <View style={styles.container}>
        <SocialHeader />
        <TreazerSocial route={route} postReq={postReq} />
      </View>
    </Refresh>
  )
}

export default SocialHome

const styles = StyleSheet.create({
  container: {
    height,
    width: "100%",
    backgroundColor: "#ffffff"
  }
})

{
  /* <iframe
src='https://lottiefiles.com/iframe/62035-walk-cycle-animation'
height={60}
width={60}></iframe> */
}
