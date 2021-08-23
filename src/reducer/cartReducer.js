export const initialState = {
  cart: null,
  itemIds: [],
  cartItems: null,
  error: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cart: action.payload.newCart,
        itemIds: action.payload.itemIds,
      };
    case "ADD_CART_ITEMS":
      return {
        ...state,
        cartItems: action.payload.cart,
        itemIds: action.payload.itemIds,
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: {
          quantity: action.payload.quantity,
          _id: action.payload,
          userId: action.payload.userId,
          price: action.payload.price,
          createdAt: action.payload.createdAt,
          updatedAt: action.payload.updatedAt,
          _v: action.payload._v,
          cartItem: state.cartItems.cartItem.filter((item) =>
            action.payload.cartItem.find(
              (i) => item.productId._id.toString() === i.productId.toString()
            )
          ),
        },
      };
    case "ADD_ADDRESS":
      return {
        ...state,
        orders: action.payload,
      };
    case "REMOVE_WHOLE_CART":
      return {
        ...state,
        cartItems: null,
        cart: null,
      };
    case "CLEAR_CART":
      return {
        ...state,
        cart: null,
        cartItems: null,
      };
    case "EDIT_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order._id.toString() === action.payload.toString()) {
            order.isDelivered = true;
            return order;
          } else {
            return order;
          }
        }),
      };
  }
};
