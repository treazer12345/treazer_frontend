export const initialState = {
  myOrder: null,
  myRestaurentOrder: null,
  singleRestaurentOrder: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "PLACE_MY_ORDER":
      return {
        ...state,
        myOrder: action.payload,
      };
    case "GET_SINGLE_RESTAURENT_ORDER":
      return {
        ...state,
        singleRestaurentOrder: action.payload,
      };
    case "GET_MY_RESTAURENT_ORDER":
      return {
        ...state,
        myRestaurentOrder: action.payload,
      };
    case "REMOVE_ORDERS":
      return {
        ...state,
        myOrder: null,
        myRestaurentOrder: null,
      };
    case "ACCEPT_ORDER":
      return {
        ...state,
        myRestaurentOrder: state.myRestaurentOrder.map((order) => {
          if (order._id.toString() === action.payload._id.toString()) {
            order.isRestaurantOwnerVerify = true;
            return order;
          } else {
            return order;
          }
        }),
      };
    case "REJECT_ORDER":
      return {
        ...state,
        myRestaurentOrder: state.myRestaurentOrder.map((order) => {
          if (order._id.toString() === action.payload._id.toString()) {
            order.isRestaurantOwnerReject = true;
            return order;
          } else {
            return order;
          }
        }),
      };
  }
};
