export const initialState = {
  user: null,
  friend: null,
  isLogin: localStorage.getItem("token") ? true : false,
  userRole: "user",
  isBeamToken: true,
  error: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_USER":
      return {
        ...state,
        user: action.payload,
        isLogin: true,
      };
    case "USER_PROFILE":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT_USER":
      return {
        ...state,
        isLogin: false,
      };
    case "BEAM_TOKEN_CLEAR":
      return {
        ...state,
        isBeamToken: false,
      };
    case "SET_USER_ROLE":
      return {
        ...state,
        userRole: "resturant-owner",
      };
    case "FOLLOW_UNFOLLOW_USER":
      return {
        ...state,
        user: action.payload.currentUser,
        friend: action.payload.followORunfolluser,
      };
    case "GET_FRIEND'S_PROFILE":
      return {
        ...state,
        friend: action.payload,
      };
    // case "ADD_ADDRESS":
    //   return {
    //     ...state,
    //     user: action.payload,
    //   };
    case "USER_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    default:
      break;
  }
};
