import React, { useContext } from "react"
import { StyleSheet, Dimensions, View, Text } from "react-native"
import { makeStyles } from "@material-ui/core/styles"
import GridList from "@material-ui/core/GridList"
import GridListTile from "@material-ui/core/GridListTile"
import GridListTileBar from "@material-ui/core/GridListTileBar"
import IconButton from "@material-ui/core/IconButton"
// import InfoIcon from "@material-ui/icons/Info"
import { PostContext } from "../../context/postContext"

const { width } = Dimensions.get("window")
const useStyles = makeStyles(() => ({
  gridList: {
    width: "100%",
    height: Dimensions.get("window").heigh
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
}))

const GridImageview = ({ allPosts, scrollViewRef }) => {
  const classes = useStyles()
  const { dispatch: postDispatch } = useContext(PostContext)

  const getSinglePost = (postId) => {
    postDispatch({
      type: "GET_SINGLE_POST",
      payload: postId
    })
    scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
  }
  return (
    <View style={styles.container}>
      <GridList cellHeight={180} className={classes.gridList}>
        <View
          style={{
            height: 50,
            width: width * 0.9,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: "auto",
            marginTop: 20
          }}>
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: 15,
              fontWeight: "700",
              fontStyle: "Open Sans"
            }}>
            More like this
          </Text>
        </View>

        {allPosts.map((post, idx) => (
          <GridListTile key={idx}>
            <img
              src={post?.photo}
              alt={post?.title}
              style={{ borderRadius: "20px" }}
              onClick={() => {
                // window.location.assign(`/social/postdetails/${post?._id}`)
                getSinglePost(post._id)
              }}
            />
            {post.title && (
              <GridListTileBar
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20
                  // backgroundColor:"#eeeeee"
                }}
                title={post?.title}
                actionIcon={
                  <IconButton
                    aria-label={`info about ${post?.title}`}
                    className={classes.icon}>
                    {/* <InfoIcon /> */}
                  </IconButton>
                }
              />
            )}
          </GridListTile>
        ))}
      </GridList>
    </View>
  )
}

export default GridImageview

const styles = StyleSheet.create({
  container: {
    width: width * 0.95,
    marginHorizontal: "auto",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: "#ffffff"
  }
})
