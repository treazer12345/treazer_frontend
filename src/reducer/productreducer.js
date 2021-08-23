export const initialState = {
  restaurentProducts: null,
  myrestaurentProducts: [],
  filtered_products: [],
  error: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "GET_RESTAURENT_PRODUCTS":
      return {
        ...state,
        restaurentProducts: action.payload,
      };
    case "ADD_MY_RESTAURENT_PRODUCT":
      return {
        ...state,
        myrestaurentProducts: [...state.myrestaurentProducts, action.payload],
      };
    case "GET_MY_RESTAURENT_PRODUCTS":
      return {
        ...state,
        myrestaurentProducts: action.payload,
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
    case "FILTER_PRODUCT":
      return {
        ...state,
        filtered_products: action.payload,
      };
    case "CHANGE_PRODUCT_AVAILABLITY":
      return {
        ...state,
        myrestaurentProducts: state.myrestaurentProducts.map((product) => {
          if (product._id.toString() === action.payload._id.toString()) {
            console.log("matched");
            product.isAvailable = action.payload.isAvailable;
            return product;
          } else {
            console.log(" not matched");
            return product;
          }
        }),
      };
    default:
      break;
  }
};
