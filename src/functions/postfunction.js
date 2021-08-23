import axios from "axios";
import BASE_URL from "../api";

const token = localStorage.getItem("token");
const refreshtoken = localStorage.getItem("refresh-token");

const getUserPosts = (postDispatch) => {
  if (token && refreshtoken) {
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

        postDispatch({ type: "GET_MY_POSTS", payload: posts });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};


const findSinglePost = (postDispatch, postId, navigation) => {
  axios
    .post(`${BASE_URL}/api/posts/getsinglepost`, { postId })
    .then((res) => {
      const { singlePost } = res.data
      // console.log(singlePost);
      postDispatch({
        type: "FIND_SINGLE_POST",
        payload: singlePost,
      })
      if (navigation !== undefined) {
        navigation.navigate("Social", {
          screen: "PostDetails",
          params: { postId: postId }
        })
      }
    })
    .catch((err) => console.log(err))
}


const getSinglePost = (postDispatch, postId) => {
  postDispatch({
    type: "GET_SINGLE_POST",
    payload: postId,
  })

};


const getAllPosts = (postDispatch, { setpostReq }, { postId }, { offSet }) => {
  setpostReq !== undefined && setpostReq(false);
  axios
    .post(`${BASE_URL}/api/posts/getallposts`, { offSet })
    .then((res) => {
      let { posts } = res.data;
      posts.sort(() => Math.random() - 0.5);
      postDispatch({ type: "GET_ALL_POSTS", payload: posts });
      let afterRefreshedPost;
      if (postDispatch !== undefined && postId !== undefined) {
        afterRefreshedPost = posts.find((post) => post._id.toString() === postId.toString())
      }
      setpostReq !== undefined && setpostReq(true);
      if (postDispatch !== undefined && postId !== undefined && afterRefreshedPost) {
        getSinglePost(postDispatch, postId);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


const followORunfollow = (
  id,
  { postId },
  { userDispatch, postDispatch },
  { setisLogin, setFollowMsg, setfollowSnackbarOpen },
) => {
  if (!token && setisLogin !== undefined) {
    setisLogin(true);
  } else {
    axios
      .post(
        `${BASE_URL}/api/user/followorunfollowuser`,
        { userId_to_follow_or_unfollow: id },
        {
          headers: {
            "x-token": token,
            "x-refresh-token": refreshtoken,
          },
        }
      )
      .then((res) => {
        const { msg, followORunfolluser, currentUser } = res.data;
        console.log(msg, followORunfolluser, currentUser);
        setFollowMsg !== undefined && setFollowMsg(msg);
        userDispatch({
          type: "FOLLOW_UNFOLLOW_USER",
          payload: { currentUser, followORunfolluser },
        });
        postDispatch({
          type: "FOLLOW_UNFOLLOW_USER",
          payload: { followORunfolluser, postId },
        });
        setfollowSnackbarOpen !== undefined && setfollowSnackbarOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};


const makeComment = (postId, comment,
  { setisLogin, setcomment },
  { postDispatch }) => {
  if (setisLogin !== undefined && token !== undefined && token === null) {
    console.log(token)
    setisLogin(true);
  } else {
    axios
      .post(
        `${BASE_URL}/api/posts/createcomment`,
        { postId, comment },
        {
          headers: {
            "x-token": token,
            "x-refresh-token": refreshtoken,
          },
        }
      )
      .then((res) => {
        const { comments } = res.data;
        postDispatch({
          type: "ADD_COMMENT_TO_POST",
          payload: { postId, comments },
        });
        // postDispatch({ type: "ADD_COMMENT_TO_MYPOST", payload: {postId, comments} });
        postDispatch({ type: "GET_SINGLE_POST", payload: postId });
        setcomment !== undefined && setcomment("");
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
};


export {
  getUserPosts,
  getAllPosts,
  followORunfollow,
  getSinglePost,
  findSinglePost,
  makeComment
};
