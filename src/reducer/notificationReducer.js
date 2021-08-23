export const initialState = {
  userNotifications: null,
  restaurantNotifications: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "GET_NOTIFICATIONS":
      return {
        ...state,
        userNotifications: action.payload,
      };
    case "GET_NOTIFICATIONS_RESTAURANT":
      return {
        ...state,
        restaurantNotifications: action.payload,
      };
    case "DELETE_USER_NOTIFICATION":
      return {
        ...state,
        userNotifications: state.userNotifications.filter(
          (noti) => noti._id.toString() !== action.payload.toString()
        ),
      };
    case "DELETE_RESTAURANT_NOTIFICATION":
      return {
        ...state,
        restaurantNotifications: state.restaurantNotifications.filter(
          (noti) => noti._id.toString() !== action.payload.toString()
        ),
      };
    case "DELETE_ALL_NOTIFICATIONS":
      return {
        ...state,
        userNotifications: null,
        restaurantNotifications: null
      };
  }
};
