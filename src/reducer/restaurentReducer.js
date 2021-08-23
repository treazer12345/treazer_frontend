export const initialState = {
  singleRestaurent: [],
  myRestaurent: null,
  allRestaurent: [],
  error: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_RESTAURENT":
      return {
        ...state,
        singleRestaurent: action.payload,
      };
    case "GET_ALL_RESTAURENT":
      return {
        ...state,
        allRestaurent: action.payload,
      };
    case "ADD_MY_RESTAURENT":
      return {
        ...state,
        myRestaurent: action.payload,
        allRestaurent: [...state.allRestaurent, action.payload],
      };
    case "ADD_ONLY_MY_RESTAURENT":
      return {
        ...state,
        myRestaurent: action.payload,
      };
    case "FILTER_RESTAURENT":
      return {
        ...state,
        singleRestaurent: state.allRestaurent.filter(
          (item) => item._id.toString() === action.payload.toString()
        ),
      };
    case "ADD_ADDRESS":
      return {
        ...state,
        user: action.payload,
      };
    case "OPEN/CLOSE RESTAURENT":
      return {
        ...state,
        myRestaurent: [
          state.myRestaurent.find(
            (item) =>
              item._id.toString() === action.payload.toString() &&
              (item.isOpened = !item.isOpened)
          ),
        ],
      };
    case "REMOVE_MY_RESTAURANT":
      return {
        ...state,
        myRestaurent: null,
      };
    default:
      break;
  }
};
