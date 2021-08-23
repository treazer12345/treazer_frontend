import BASE_URL from "../api";
import Axios from "axios";

const getCartItems = (id, cartDispatch, setCartReq) => {
  setCartReq !== undefined && setCartReq(false);
  if (id) {
    Axios.get(`${BASE_URL}/api/cart/${id}/getcart`)
      .then((res) => {
        const { cart } = res.data;
        // console.log(cart);
        const itemIds = cart?.cartItem.map((item) => item.productId._id);
        cartDispatch({ type: "ADD_CART_ITEMS", payload: { cart, itemIds } });
        setCartReq !== undefined && setCartReq(true);
      })
      .catch((err) => console.log(err));
  }
};

const addTocart = (
  productId,
  price,
  userState,
  setOpen2,
  setOpen,
  setLoading,
  user,
  cartDispatch,
  token,
  refreshtoken,
  setReplaceOrderReq,
  handleClose
) => {
  if (!userState.isLogin) {
    setOpen2(true);
  } else {
    setLoading(false);
    Axios.post(
      `${BASE_URL}/api/cart/${user._id}/addcart`,
      { productId, price },
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          "x-token": token,
          "x-refresh-token": refreshtoken,
        },
      }
    )
      .then((res) => {
        const { newCart } = res.data;
        // console.log(newCart, success);
        const itemIds = newCart.cartItem.map((item) => item.productId);
        cartDispatch({ type: "ADD_TO_CART", payload: { newCart, itemIds } });
        setLoading(true);
        setOpen(true);

        if (setReplaceOrderReq !== undefined && handleClose !== undefined) {
          setReplaceOrderReq(true);
          handleClose();
        }
        getCartItems(user._id, cartDispatch);
      })
      .catch((err) => console.log(err));
  }
};

const removeFromCart = (
  productId,
  price,
  userState,
  setOpen2,
  setOpen,
  setLoading,
  user,
  cartDispatch,
  token,
  refreshtoken
) => {
  if (!userState.isLogin) {
    setOpen2(true);
  } else {
    setLoading(false);
    Axios.post(
      `${BASE_URL}/api/cart/${user._id}/removeitem`,
      { productId, price },
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          "x-token": token,
          "x-refresh-token": refreshtoken,
        },
      }
    )
      .then((res) => {
        const { cart } = res.data;
        cartDispatch({ type: "REMOVE_FROM_CART", payload: cart });
        setLoading(true);
        setOpen(true);
        getCartItems(user._id, cartDispatch);
      })
      .catch((err) => console.log(err));
  }
};

export { getCartItems, addTocart, removeFromCart };
