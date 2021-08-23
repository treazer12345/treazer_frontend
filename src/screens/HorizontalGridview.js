import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import Skeleton from "@material-ui/lab/Skeleton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PostActions from "./social/";

const useStyles = makeStyles(() => ({
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
}));
const { width, height } = Dimensions.get("window");
const ITEM_SIZE = width * 0.75;
const SPACING = 10;
const HorizontalGridview = ({ route, allPosts, addSinglePost, setisLogin }) => {
  const classes = useStyles();
  return (
    <View style={styles.container}>
      <GridList
        className={classes.gridList}
        cols={10}
        style={{ height: "100%" }}>
        {allPosts.map((post, idx) => (
          <View
            key={idx}
            style={{
              width: width * 0.75,
              marginHorizontal: "auto",
              marginVertical: 10,
            }}>
            <View
              style={{
                marginHorizontal: SPACING,
                marginTop: SPACING,
                alignItems: "center",
                backgroundColor: "#ffffff",
                borderRadius: 24,
                // border: "1px solid black",
              }}>
              <LazyLoadImage
                src={post?.photo}
                resizemode='cover'
                placeholder={
                  <View
                    style={{
                      width: width * 0.7,
                      height: ITEM_SIZE * 1.2,
                      justifyContent: "space-between",
                    }}>
                    <Skeleton variant='text' animation='wave' />
                    <Skeleton
                      variant='circle'
                      width={60}
                      height={60}
                      animation='wave'
                    />
                    <Skeleton variant='text' animation='pulse' />
                    <Skeleton
                      variant='rect'
                      animation='pulse'
                      width={width * 0.7}
                      height={ITEM_SIZE}
                    />
                  </View>
                }
                threshold={50}
                onClick={() => addSinglePost(post._id)}
                style={{
                  width: "100%",
                  height: ITEM_SIZE * 1.2,
                  resizeMode: "cover",
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                  boxShadow: "0 4px 8px 0 #C9CCD1, 0 6px 20px 0 #C9CCD1",
                }}
              />

              <PostActions post={post} route={route} setisLogin={setisLogin} />
            </View>
          </View>
        ))}
      </GridList>
    </View>
  );
};

export default HorizontalGridview;

const styles = StyleSheet.create({
  container: {
    width,
    height: height * 0.8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
});
