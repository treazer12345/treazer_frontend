import React, { useContext, useState } from "react"
import { StyleSheet, View, Text, Dimensions } from "react-native"
import { Snackbar, Portal, Dialog } from "react-native-paper"
import { PostContext } from "../../context/postContext"
import { LazyLoadImage } from "react-lazy-load-image-component"
import PostActions from "./PostActions"

const { width, height } = Dimensions.get("window")
const FriendPosts = ({ route }) => {
  // console.log(route);
  const { state: postState } = useContext(PostContext)

  const [isLogin, setisLogin] = useState(false);
  const onDismissSnackBar = () => setisLogin(false);

  return (
    <View style={{ width: "90%" }}>
      {postState?.friendPosts?.map((post, idx) => (
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
              paddingHorizontal: 20,

            }}>
            <PostActions post={post} route={route} setisLogin={setisLogin} />
          </View>
        </View>
      ))}
      <Portal>
        <Dialog
          visible={isLogin}
          onDismiss={onDismissSnackBar}
          style={{ justifyContent: "center" }}>
          <Snackbar
            visible={isLogin}
            onDismiss={onDismissSnackBar}
            style={{
              bottom: 50,
              backgroundColor: "#ff5252",
            }}
            duration={3000}>
            <Text
              style={{
                textAlign: "center",
                width: "100%",
                fontFamily: "Open Sans",
                fontWeight: "700",
                fontSize: 15,
              }}>
              You are not logged in
            </Text>
          </Snackbar>
        </Dialog>
      </Portal>
    </View>
  );
};

export default FriendPosts;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "auto",
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    boxShadow: "0px 2px 4px 0px #bdbdbd",
  },
});
