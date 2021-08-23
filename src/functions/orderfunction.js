import BASE_URL from "../api";
import Axios from "axios";
import { getNotifications } from "./notificationfunction";
const user1 = JSON.parse(localStorage.getItem("user"));
const resturantId1 = user1 && user1.resturantId?._id;
const makeOrder = (
  cartState,
  userId,
  token,
  refreshtoken,
  resturantId,
  lng,
  lat,
  landmark,
  houseNo,
  setuserError,
  setOpen2,
  setrestaurentError,
  setlocationError,
  setlandmarkError,
  sethouseError,
  setcartError,
  setResponseError,
  setOrderReq,
  orderDispatch,
  cartDispatch,
  setOrderSuccess,
  setHouseNo,
  setLandmark,
  setOpen,
  navigation,
  handleClose,
  setPaymentReq,
  notiDispatch
) => {
  const cartItems = cartState?.cartItems?.cartItem.map(
    (item) => item.productId._id
  );

  const cartId = cartState?.cartItems?._id;
  // console.log({
  //   cartId: cartState?.cartItems?._id,
  //   cartItems,
  //   price: cartState?.cartItems?.price,
  //   userId,
  //   resturantId,
  //   longitude: lng,
  //   latitude: lat,
  //   landmark: landmark,
  //   flatNo: houseNo,
  // });
  if (!userId) {
    setuserError("Login First");
    setOpen2(true);
  } else if (!resturantId) {
    setrestaurentError("You have to order from a registered restaurant");
    setOpen2(true);
  } else if (!lng || !lat) {
    setlocationError(
      "!!OOPS... you have to select location before making order"
    );
    setOpen2(true);
  } else if (!landmark) {
    // setPaymentHandle(true);
    setlandmarkError(
      "!!OOPS... you have to select a landmark before making order"
    );
    setOpen2(true);
  } else if (!houseNo) {
    sethouseError(
      "!!OOPS... you have to select a house No. before making order"
    );
    setOpen2(true);
  } else if (!cartState.cartItems && cartId) {
    setcartError("you have to visit cart then checkout to make orders.");
    setOpen2(true);
  } else {
    setOrderReq(false);
    setPaymentReq(false);
    Axios.post(
      `${BASE_URL}/api/order/createorder`,
      {
        cartId: cartState?.cartItems?._id,
        cartItems,
        price: cartState?.cartItems?.price,
        userId,
        resturantId,
        longitude: lng,
        latitude: lat,
        landmark: landmark,
        flatNo: houseNo,
      },
      {
        headers: {
          "x-token": token,
          "x-refresh-token": refreshtoken,
        },
      }
    )
      .then((res) => {
        const { message, success } = res.data;
        Axios.get(`${BASE_URL}/api/order/getorder`, {
          headers: {
            "x-token": token,
            "x-refresh-token": refreshtoken,
          },
        })
          .then((response) => {
            const { order } = response.data;
            if (order.length !== 0) {
              orderDispatch({ type: "PLACE_MY_ORDER", payload: order });
              cartDispatch({ type: "CLEAR_CART" });
              success === true
                ? setOrderSuccess(message)
                : setOrderSuccess("Can't Place order");
              setHouseNo("");
              setLandmark("");
              setOrderReq(true);
              setPaymentReq(true);
              setOpen(true);
              navigation.navigate("User", { screen: "MyOrder" });
              handleClose();
              getNotifications(userId, resturantId1, notiDispatch);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        let successmsg;
        if (err.response && err.response.data) {
          const { message, success } = err.response.data;
          console.log(message)
          successmsg = success;
        }
        if (!successmsg) {
          setResponseError("Can't Make order.. Check your cart and make order");
          setOpen2(true);
          setOrderReq(true);
        }
        // console.log(txtmsg, successmsg);
        console.log(err);
      });
  }
};

export { makeOrder };
