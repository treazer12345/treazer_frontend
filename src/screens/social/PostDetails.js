import React, { useState, useContext, useEffect, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ActivityIndicator
} from "react-native"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"
import { Icon } from "react-native-elements"
import { Snackbar } from "react-native-paper"
import PostActions from "./PostActions"
import SocialHeader from "./SocialHeader"
import { PostContext } from "../../context/postContext"
// import { useNavigation } from "@react-navigation/native"
import { getAllPosts, findSinglePost } from "../../functions/postfunction"
import GridImageview from "./GridImageview"
// import axios from "axios"
// import BASE_URL from "../../api"
const { width, height } = Dimensions.get("window")

const PostDetails = ({ route }) => {
  // const navigation = useNavigation()
  const { postId } = route?.params
  const { state: postState, dispatch: postDispatch } = useContext(PostContext)
  const [showMore, setShowMore] = useState(false)
  const [isLogin, setisLogin] = useState(false)
  const onDismissSnackBar = () => setisLogin(false)

  useEffect(() => {
    if (postState.allPosts?.length === 0) {
      getAllPosts(
        postDispatch,
        { setpostReq: undefined },
        { postId },
        { offSet: postState.allPosts.length }
      )
    }
  }, [postId])

  useEffect(() => {
    if (!postState.singlePost) {
      findSinglePost(postDispatch, postId)
    }
  }, [])

  const scrollRef = useRef(null)
  const scrollViewRef = useRef(null)
  const handleScroll = () => {
    if (
      scrollRef.current &&
      scrollRef.current.scrollTop < 1 &&
      postState.allPosts?.length >= 10
    ) {
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
  }
  return (
    <SafeAreaView style={styles.container} ref={scrollRef}>
      <SocialHeader />
      {postState.allPosts?.length > 0 ? (
        <ScrollView
          ref={scrollViewRef}
          style={{ paddingTop: 10 }}
          decelerationRate='normal'
          scrollEventThrottle={1000}
          onScroll={handleScroll}>
          {postState.singlePost ? (
            <View
              style={{
                width: "90%",
                marginHorizontal: "auto"
              }}>
              <View
                style={{
                  width: "100%",
                  marginHorizontal: "auto"
                }}>
                <View style={{
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                  boxShadow: "0 4px 8px 0 #C9CCD1, 0 6px 20px 0 #C9CCD1"
                }}>
                  <LazyLoadImage
                    src={postState.singlePost?.photo}
                    resizemode='cover'
                    effect="blur"
                    style={{
                      width: "100%",
                      flex: 1,
                      borderTopRightRadius: 20,
                      borderTopLeftRadius: 20,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      height: 30,
                      width: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 20,
                      backgroundColor: "#ffffff",
                      border: "1px solid #eeeeee",
                      // boxShadow: "0 2px 2px 0 #C9CCD1, 0 4px 4px 0 #C9CCD1"
                    }}>
                    <Icon
                      name='arrow-back'
                      type='ionicon'
                      color='black'
                      size={20}
                      onPress={() => window.history.back()}
                    />
                  </View>
                </View>
                <PostActions
                  post={postState?.singlePost}
                  // post={postTofind}
                  route={route}
                  setisLogin={setisLogin}
                />
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  marginHorizontal: "auto"
                }}>
                <Text
                  style={{
                    marginTop: 20,
                    marginBottom: 10,
                    fontWeight: "800",
                    letterSpacing: 1,
                    fontSize: 18,
                    fontFamily: "Open Sans",
                    color: "#455a64",
                    textShadow: "1px 0 #455a64"
                  }}>
                  {postState.singlePost?.title}
                </Text>
                <Text
                  style={{
                    fontWeight: "400",
                    letterSpacing: 1,
                    fontSize: 15,
                    fontFamily: "Open Sans",
                    color: "#455a64",
                    // textAlign: "center",
                    textShadow: "1px 0 #455a64"
                  }}>
                  {postState.singlePost?.description?.slice(0, 70)}
                  <Text
                    style={{
                      marginRight: 10,
                      // textAlign: "center",
                      display: `${showMore ? "block" : "none"}`
                    }}>
                    {postState.singlePost?.description?.slice(70, 2000)}
                  </Text>
                  <Text
                    style={{
                      color: "#4fc3f7",
                      textShadow: "1px 0 #4fc3f7",
                      marginRight: 40
                    }}
                    onPress={() => setShowMore(!showMore)}>
                    {showMore ? "view less..." : "...view more"}
                  </Text>
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                width: width * 0.8,
                height: 100,
                justifyContent: "center",
                marginHorizontal: "auto",
                marginVertical: "auto",
                alignItems: "center",
                backgroundColor: "#ffffff"
              }}>
              <Text
                style={{
                  fontWeight: "600",
                  letterSpacing: 2,
                  fontSize: 15,
                  fontFamily: "Open Sans",
                  color: "#455a64",
                  textAlign: "center",
                  textShadow: "1px 0 #455a64"
                }}>
                Opps!!! you have refreshed the screen. pick your food from below
              </Text>
              <Icon
                name='hand-point-down'
                type='font-awesome-5'
                color='#212121'
                size={30}
                containerStyle={{
                  marginTop: 10
                }}
              />
            </View>
          )}

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {postState?.allPosts && (
              <GridImageview
                allPosts={postState.allPosts}
                scrollViewRef={scrollViewRef}
              />
            )}
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            width,
            height,
            justifyContent: "center",
            marginHorizontal: "auto",
            marginVertical: "auto",
            alignItems: "center"
          }}>
          <ActivityIndicator
            size='large'
            color='#82b1ff'
            style={{
              margin: "auto"
            }}
          />
        </View>
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

export default PostDetails

const styles = StyleSheet.create({
  container: {
    width,
    height: height * 0.95,
    backgroundColor: "#ffffff"
    // border: "1px solid black",
  },
  posterImage: {
    width: "100%",
    // height: height * 0.6,
    flex: 1,
    resizeMode: "cover",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    boxShadow: "0 4px 8px 0 #C9CCD1, 0 6px 20px 0 #C9CCD1",
    elevation: 2
  },
  gridView: {
    marginTop: 10,
    width: "100%"
  },
  itemContainer: {
    border: "1px solid black",
    borderRadius: 20,
    height: 250
  },
  itemName: {
    fontSize: 16,
    color: "#424242",
    fontWeight: "600",
    marginHorizontal: "auto"
  }
})
