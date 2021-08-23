export const initialState = {
  myPosts: [],
  friendPosts: [],
  singlePost: null,
  allPosts: []
}

export const reducer = (state, action) => {
  switch (action.type) {
    case "GET_ALL_POSTS":
      action.payload.forEach((post) => {
        state.allPosts.push(post)
      })
      return {
        ...state,
        allPosts: state.allPosts
      }
    case "GET_MY_POSTS":
      return {
        ...state,
        myPosts: action.payload
      }
    case "GET_MY_FRIEND'S_POSTS":
      return {
        ...state,
        friendPosts: action.payload
      }
    case "GET_SINGLE_POST":
      return {
        ...state,
        singlePost: state.allPosts.find(
          post => post._id.toString() === action.payload.toString()
        )
      }
    case "FIND_SINGLE_POST":
      return {
        ...state,
        singlePost: action.payload,
      }
    case "ADD_MY_POST":
      return {
        ...state,
        myPosts: [action.payload, ...state.myPosts],
        allPosts: [action.payload, ...state.allPosts]
      }
    case "DELETE_POST":
      return {
        ...state,
        myPosts: state.myPosts.filter(
          post => post._id.toString() !== action.payload.toString()
        ),
        allPosts: state.allPosts.filter(
          post => post._id.toString() !== action.payload.toString()
        )
      }
    case "ADD_COMMENT_TO_POST":
      return {
        ...state,
        allPosts: state.allPosts.map(post => {
          if (post._id.toString() === action.payload.postId.toString()) {
            post.comments = action.payload.comments
            return post
          } else {
            return post
          }
        }),
        friendPosts: state.friendPosts.map(post => {
          if (post._id.toString() === action.payload.postId.toString()) {
            post.comments = action.payload.comments
            return post
          } else {
            return post
          }
        }),
        myPosts: state.myPosts.map((post) => {
          if (post._id.toString() === action.payload.postId.toString()) {
            post.comments = action.payload.comments
            return post
          } else {
            return post
          }
        })
      }
    case "LIKE_A_POST":
      return {
        ...state,
        allPosts: state.allPosts.map(post => {
          if (post._id.toString() === action.payload.postId.toString()) {
            post.likes = action.payload.likes
            return post
          } else {
            return post
          }
        }),
        friendPosts: state.friendPosts.map(post => {
          if (post._id.toString() === action.payload.postId.toString()) {
            post.likes = action.payload.likes
            return post
          } else {
            return post
          }
        })
      }

    case "SHARE_A_POST":
      return {
        ...state,
        allPosts: state.allPosts.map(post => {
          if (post._id.toString() === action.payload.postId.toString()) {
            post.sharecount = action.payload.sharecount
            return post
          } else {
            return post
          }
        })
      }
    case "FOLLOW_UNFOLLOW_USER":
      return {
        ...state,
        allPosts: state.allPosts.map(post => {
          if (
            post.creator._id.toString() ===
            action.payload.followORunfolluser._id.toString()
          ) {
            post.creator = action.payload.followORunfolluser
            return post
          } else {
            return post
          }
        })
      }
  }
}
