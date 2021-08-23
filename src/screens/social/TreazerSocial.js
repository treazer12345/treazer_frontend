import React, { useState, useContext } from "react"
import {
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
  View,
  TouchableOpacity
} from "react-native"
import Skeleton from "@material-ui/lab/Skeleton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"
import "react-lazy-load-image-component/src/effects/black-and-white.css"
import { Snackbar } from "react-native-paper"
import { Image } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native"
import PostActions from "./PostActions"
import { PostContext } from "../../context/postContext"
import { getAllPosts } from "../../functions/postfunction"
import Loading from "../../navigation/Loading";

const { height, width } = Dimensions.get("window")
const SPACING = 10
const ITEM_SIZE = width * 0.75
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2

const TreazerSocial = ({ route, postReq }) => {
  const navigation = useNavigation()

  const { state: postState, dispatch: postDispatch } = useContext(PostContext)

  const [isLogin, setisLogin] = useState(false)
  const onDismissSnackBar = () => setisLogin(false)

  const addSinglePost = id => {
    postDispatch({
      type: "GET_SINGLE_POST",
      payload: id
    })
    navigation.navigate("Social", {
      screen: "PostDetails",
      params: { postId: id }
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      {postReq ? (
        <FlatList
          showsHorizontalScrollIndicator={true}
          data={postState?.allPosts}
          keyExtractor={item => item._id}
          horizontal={true}
          bounces={true}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (postState?.allPosts.length >= 10) {
              getAllPosts(
                postDispatch,
                { setpostReq: undefined },
                {
                  setsinglePostReq: undefined,
                  postId: undefined
                },
                { offSet: postState.allPosts.length }
              )
            }
          }}
          decelerationRate='normal'
          contentContainerStyle={{ alignItems: "center" }}
          snapToInterval={ITEM_SIZE}
          snapToAlignment='start'
          scrollEventThrottle={16}
          renderItem={({ item, index }) => {
            if (!item.photo) {
              return <View style={{ width: EMPTY_ITEM_SIZE }} />
            }
            return (
              <View
                key={index}
                style={{
                  width: width < 500 ? width * 0.75
                    : width > 500 && width < 700 ? width * 0.65
                      : width > 700 && width < 900 ? width * 0.55
                        : width > 900 && width < 1100 ? width * 0.45
                          : width * 0.3,
                  height: height * 0.8,
                  marginHorizontal: "auto",
                  justifyContent: "center",

                }}>
                <View
                  style={{
                    marginHorizontal: SPACING,
                    marginTop: SPACING,
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: 24
                    // border: "1px solid black",
                  }}>
                  <TouchableOpacity
                    style={{
                      position: "relative",
                      width: "100%",
                      height: width > 500 ? height * 0.6 : ITEM_SIZE * 1.2,
                      resizeMode: "cover",
                      borderTopRightRadius: 20,
                      borderTopLeftRadius: 20,
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 8px 0 #C9CCD1, 0 6px 20px 0 #C9CCD1"
                    }}
                    onPress={() => addSinglePost(item._id)}>
                    <Image
                      source={{ uri: item?.photo }}
                      style={{
                        width: "100%",
                        height: width > 500 ? height * 0.6 : height * 0.5,
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20,
                      }}
                      transition
                      transitionDuration={360}
                      resizeMode="center"
                    />
                  </TouchableOpacity>
                  <PostActions
                    post={item}
                    route={route}
                    setisLogin={setisLogin}
                  />
                </View>
              </View>
            )
          }}
        />
      ) : (
        <Loading />
      )}
      <Snackbar
        visible={isLogin}
        onDismiss={onDismissSnackBar}
        style={{ bottom: 50 }}
        duration={3000}
        action={{
          label: "Close",
          onPress: () => {
            onDismissSnackBar()
          }
        }}>
        You are not logged in
      </Snackbar>
    </SafeAreaView>
  )
}

export default TreazerSocial

const styles = StyleSheet.create({
  container: {
    height: height * 0.85,
    width: "100%",
    backgroundColor: "#ffffff"
  },
})


                  //  <img
                  //   src={item?.photo}
                  //   alt={item?.title}
                  //   onClick={() => addSinglePost(item._id)}
                  //   style={{
                  //     position: "absolute",
                  //     width: "100%",
                  //     flex: 1,
                  //     maxHeight: ITEM_SIZE * 1.2,
                  //     resizeMode: "cover",
                  //     borderTopRightRadius: 20,
                  //     borderTopLeftRadius: 20
                  //   }}
                  // /> 

