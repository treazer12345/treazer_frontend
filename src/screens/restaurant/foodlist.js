import React, { useState, useContext, useEffect } from "react"
import { Snackbar } from "react-native-paper"
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native"
const { width, height } = Dimensions.get("window")
import { Button, Icon, CheckBox, ListItem } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"
import { RestaurentContext } from "../../context/restaurentContext"
import { ProductContext } from "../../context/productcontext"
import { AuthContext } from "../../context/userContext"
import { CartContext } from "../../context/cartContext"
import Axios from "axios"
import BASE_URL from "../../api"
import FoodDialog from "./foodDialog"
import ItemQuantity from "./ItemQuantity"
import CartRemoveDialog from "../cart/cartRemoveDialog"
import Dialog from "@material-ui/core/Dialog"
import MuiAlert from "@material-ui/lab/Alert"
import LinearProgress from "@material-ui/core/LinearProgress"
import Slide from "@material-ui/core/Slide"
import { addTocart, removeFromCart } from "../../functions/cartfunction"
import {
  LazyLoadImage,
  trackWindowScroll
} from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"
import Refresh from "../refresh"
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})
const Foodlist = ({ route, scrollPosition }) => {
  const navigation = useNavigation()

  // FOOD DIALOG SETUP
  const [dialog, setDialog] = useState(false)
  const handleDialogClose = () => {
    setDialog(!dialog)
  }

  //GLOBAL STATE SET-UP
  const { state: restaurentState, dispatch: restaurentDispatch } =
    useContext(RestaurentContext)
  const { state: productState, dispatch: productDispatch } =
    useContext(ProductContext)
  const { state: userState } = useContext(AuthContext)
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext)

  //LOCAL VERIABLE FROM GLOBAL STATE
  const singleProduct =
    productState.restaurentProducts && productState.restaurentProducts[0]
  const singleRestaurent =
    restaurentState.singleRestaurent &&
      restaurentState.singleRestaurent.length > 0
      ? restaurentState.singleRestaurent[0]
      : restaurentState.singleRestaurent

  //LOCAL STATE-SETUP

  const [isChecked, setIsChecked] = useState(singleRestaurent?.isOpened)

  const [sendReq, setSendReq] = useState(true)
  const [sendFoodReq, setSendFoodReq] = useState(true)
  const [loading, setLoading] = useState(true)

  // LOCALSTORAGE USER AND TOKEN
  const user = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")
  const refreshtoken = localStorage.getItem("refresh-token")
  const resturantId = user ? user.resturantId?._id : null
  const id = route.params ? route.params.id : null

  //SNACKBAR SETUP
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen2(false)
  }

  useEffect(() => {
    if (id.toString() !== singleProduct?.resturantId.toString()) {
      getRestaurentProduct()
    }
    if (restaurentState.singleRestaurent.length === 0) {
      getSingleRestaurant()
    }
  }, [id, singleRestaurent])

  // const itemQuantity = cartState.cartItems.cartItem.find(
  //   (item) =>
  //     item.productId._id.toString() === l._id.toString() && item.quantity
  // );

  //GET RESTAURENT PRODUCT
  const getRestaurentProduct = () => {
    setSendFoodReq(false)
    Axios.post(`${BASE_URL}/api/product/getProductByCategory`, {
      resturantId: id
    })
      .then(res => {
        const { products } = res.data
        // console.log(products);
        productDispatch({
          type: "GET_RESTAURENT_PRODUCTS",
          payload: products
        })
        setSendFoodReq(true)
      })
      .catch(err => console.log(err))
  }
  const getSingleRestaurant = () => {
    Axios.get(`${BASE_URL}/api/resturant/${id}/getOneResturant`)
      .then(res => {
        console.log(res.data)
        const { resturant } = res.data
        restaurentDispatch({ type: "ADD_RESTAURENT", payload: resturant })
        if (Array.isArray(resturant) && resturant.length > 0) {
          setIsChecked(resturant[0].isOpened)
        }
      })
      .catch(err => console.log(err))
  }
  //OPEN OR CLOSE RESTAURENT
  const openClose = () => {
    if (!userState.isLogin) {
      setOpen2(true)
    } else {
      setSendReq(false)
      Axios.post(
        `${BASE_URL}/api/resturant/openresturant`,
        { resturantId: id },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "x-token": token,
            "x-refresh-token": refreshtoken
          }
        }
      )
        .then(res => {
          const { restaurant } = res.data
          if (singleRestaurent) {
            singleRestaurent.isOpened = !singleRestaurent.isOpened
          }

          if (restaurentState.myRestaurent) {
            restaurentState.myRestaurent[0].isOpened = restaurant.isOpened
          }

          setSendReq(true)
          setIsChecked(!isChecked)
        })
        .catch(err => console.log(err))
    }
  }

  //ADD ITEMS TO CART
  const [foodWantToAddId, setFoodWantToAddId] = useState("")
  const [foodWantToAddPrice, setFoodWantToAddPrice] = useState("")

  const addItem = (productId, price, ResturantId) => {
    if (!userState.isLogin) {
      setOpen2(true)
    } else {
      let existingRestaurent = null
      if (
        cartState.cartItems === null ||
        cartState.cartItems.cartItem.length === 0
      ) {
        addTocart(
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
        )
      } else if (
        cartState.cartItems !== null &&
        cartState.cartItems.cartItem.length > 0
      ) {
        existingRestaurent = cartState.cartItems.cartItem.find(
          item =>
            item.productId.resturantId.toString() === ResturantId.toString()
        )
      }
      if (existingRestaurent) {
        console.log("restaurent found")
        addTocart(
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
        )
      } else if (cartState.cartItems !== null) {
        setFoodWantToAddId(productId)
        setFoodWantToAddPrice(price)
        setDialog(true)
        console.log(productId, price)
      }
    }
  }

  //REMOVE SINGLE CART ITEM
  const [dialog2, setDialog2] = useState(false)
  const handleDialogClose2 = () => {
    setDialog2(false)
  }
  const removeItem = (productId, price) => {
    if (cartState.cartItems.quantity === 1) {
      setDialog2(true)
      console.log("1")
    } else {
      removeFromCart(
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
      )
    }
  }

  const handleOrder = (ResturantId, productId, price) => {
    if (!userState.isLogin) {
      setOpen2(true)
    } else {
      let existingRestaurent = null
      if (
        cartState.cartItems === null ||
        cartState.cartItems.cartItem.length === 0
      ) {
        addTocart(
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
        )
        if (!userState.isLogin) {
          setOpen2(true)
        } else {
          navigation.navigate("Home", {
            screen: "Location",
            params: { ResturantId }
          })
        }
      } else if (
        cartState.cartItems !== null &&
        cartState.cartItems.cartItem.length > 0
      ) {
        existingRestaurent = cartState.cartItems.cartItem.find(
          item =>
            item.productId.resturantId.toString() === ResturantId.toString()
        )
      }
      if (existingRestaurent) {
        console.log("restaurent found")
        // addTocart(
        //   productId,
        //   price,
        //   userState,
        //   setOpen2,
        //   setOpen,
        //   setLoading,
        //   user,
        //   cartDispatch,
        //   token,
        //   refreshtoken
        // );
        // if (!userState.isLogin) {
        //   setOpen2(true);
        // } else {
        navigation.navigate("Home", {
          screen: "Location",
          params: { ResturantId }
        })
        // }
      } else if (cartState.cartItems !== null) {
        setFoodWantToAddId(productId)
        setFoodWantToAddPrice(price)
        setDialog(true)
        console.log(productId, price)
      }
    }
  }

  return (
    <Refresh>
      <View style={styles.div_1}>
        <View style={styles.div_2}>
          <TouchableOpacity onPress={() => window.history.back()}>
            <Icon
              name='angle-left'
              type='font-awesome-5'
              color='#757575'
              size={26}
              containerStyle={{
                left: 15,
                width: 40,
                height: 30,
                borderRadius: 25,
                boxShadow: "1px 3px 6px 1px #C9CCD1"
              }}
            />
          </TouchableOpacity>
          <Text style={styles.text_1}>MY RESTAURANT</Text>
          {/* <TouchableOpacity>
          <Icon
            name='ellipsis-v'
            type='font-awesome-5'
            color='#757575'
            size={20}
            containerStyle={{
              marginRight: 5,
            }}
          />
        </TouchableOpacity> */}
        </View>
        <View style={styles.div_5}>
          {/* <View
          style={{
            flexDirection: "row",
            marginTop: 8,
          }}>
          <Icon name='star' type='font-awesome-5' color='#424242' size={15} />
          <Text
            style={{
              fontFamily: "Open Sans",
              fontSize: 15,
              fontWeight: "600",
              color: "#424242",
              marginLeft: 5,
            }}>
            4.6
          </Text>
        </View> */}
          <View style={{ textAlign: "center", marginLeft: 10, marginTop: 5 }}>
            {isChecked ? (
              <View style={{ flexDirection: "row" }}>
                <Icon
                  name='clock'
                  type='font-awesome-5'
                  color='#424242'
                  size={15}
                />
                <Text
                  style={{
                    fontFamily: "Roboto Slab",
                    fontSize: 12,
                    fontWeight: "700",
                    color: "#616161",
                    marginLeft: 5
                  }}>
                  33 mins
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  fontFamily: "Roboto Slab",
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#e53935"
                }}>
                Closed
              </Text>
            )}

            <Text
              style={{
                fontFamily: "Open Sans",
                fontSize: 12,
                fontWeight: "400",
                color: "#607d8b"
              }}>
              For Delivery
            </Text>
          </View>
          {!resturantId || resturantId.toString() !== id.toString() ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10
              }}>
              <Icon
                name='exclamation-circle'
                type='font-awesome-5'
                color='#ec407a'
                size={18}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  fontFamily: "Open Sans",
                  color: "#607d8b"
                }}>
                Not Authorized
              </Text>
            </View>
          ) : (
            <View>
              {sendReq ? (
                <CheckBox
                  title='Taking orders'
                  checked={isChecked}
                  onPress={openClose}
                  fontFamily='Open Sans'
                  containerStyle={{
                    backgroundColor: "#eeeeee",
                    border: "none",
                    width: 80,
                    padding: 0,
                    marginVertical: "auto"
                  }}
                />
              ) : (
                <ActivityIndicator
                  size='small'
                  color='#82b1ff'
                  style={{
                    marginVertical: "auto",
                    marginHorizontal: 30
                  }}
                />
              )}
            </View>
          )}
        </View>

        <View
          style={{
            width: "100%",
            height: height * 0.7
          }}>
          {sendFoodReq ? (
            <ScrollView style={styles.div_3}>
              {productState.restaurentProducts &&
                productState.restaurentProducts.length > 0 ? (
                productState.restaurentProducts.map((l, i) => (
                  <View
                    key={i}
                    style={{
                      justifyContent: "space-between",
                      width: "100%",
                      flexDirection: "row",
                      padding: 20,
                      boxShadow: "0 2px 4px 0 #bdbdbd, 0 3px 10px 0 #bdbdbd"
                    }}>
                    <ListItem.Content
                      style={{
                        height: 150,
                        justifyContent: "space-between"
                      }}>
                      <View style={{ width: "90%" }}>
                        <ListItem.Title
                          style={{
                            fontFamily: "Open Sans",
                            fontSize: 15,
                            fontWeight: "700"
                            // marginBottom: 10,
                          }}>
                          {l.name.slice(0, 20)}...
                        </ListItem.Title>
                        <ListItem.Subtitle
                          style={{
                            fontFamily: "Open Sans",
                            fontSize: 12,
                            fontWeight: "600",
                            marginTop: 10
                          }}>
                          {l.description.slice(0, 50)}...
                        </ListItem.Subtitle>
                      </View>

                      <View
                        style={{
                          width: "90%"
                        }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}>
                          <ListItem.Subtitle
                            style={{
                              fontFamily: "Roboto Slab",
                              fontSize: 25,
                              fontWeight: "bold"
                            }}>
                            ₹{l.price}
                          </ListItem.Subtitle>
                          {!l.isAvailable && (
                            <View
                              style={{
                                height: 50,
                                width: "50%"
                              }}>
                              <LazyLoadImage
                                src={require("../../assets/images/mhlnews_4187_out_stock_1.png")}
                                effect='blur'
                                scrollPosition={scrollPosition}
                                style={{
                                  height: 50,
                                  width: "100%",
                                  borderRadius: 5
                                }}
                              />
                            </View>
                          )}
                        </View>
                        {l.isAvailable && (
                          <Button
                            title='ORDER NOW'
                            type='outline'
                            onPress={() =>
                              handleOrder(l.resturantId, l._id, l.price)
                            }
                            disabled={!isChecked ? true : false}
                            titleStyle={{
                              fontSize: 12,
                              // textShadow: "1px 0 #29b6f6",
                              fontWeight: "800",
                              letterSpacing: 3,
                              fontFamily: "Open Sans",
                              color: "#29b6f6"
                            }}
                            containerStyle={{
                              marginVertical: 10,
                              width: "80%",
                              // marginHorizontal: "auto",
                              borderRadius: 10,
                              border: "none",
                              boxShadow: "3px 4px 6px #C9CCD1",
                              backgroundColor: "#ffffff"
                            }}
                            buttonStyle={{
                              width: "100%",
                              height: 30,
                              borderRadius: 10,
                              marginHorizontal: "auto",
                              backgroundColor: "#ffffff"
                            }}
                          />
                        )}
                      </View>
                    </ListItem.Content>
                    <View
                      style={{
                        width: "40%",
                        height: 150
                      }}>
                      <LazyLoadImage
                        src={l.photo}
                        resizemode='cover'
                        effect='blur'
                        scrollPosition={scrollPosition}
                        style={{
                          filter: `${isChecked ? "grayscale(0%)" : "grayscale(100%)"
                            }`,
                          height: 120,
                          width: "100%",
                          marginTop: 10,
                          borderRadius: 5,
                          boxShadow: "3px 3px 6px 1px #bdbdbd"
                        }}
                        placeholderSrc={require("../../assets/images/lazyimage.webp")}
                      />
                      {l.isAvailable &&
                        (loading ? (
                          (cartState && cartState.cartItems === null) ||
                            cartState.cartItems.cartItem.length === 0 ? (
                            <View style={styles.div_4}>
                              <Button
                                title='A D D'
                                disabled={!isChecked ? true : false}
                                onPress={() => {
                                  addItem(l._id, l.price, l.resturantId)
                                }}
                                titleStyle={{
                                  fontSize: 18,
                                  fontWeight: "bold",
                                  letterSpacing: 1,
                                  // marginLeft: 5,
                                  fontFamily: "Open Sans",
                                  color: "#ffffff"
                                }}
                                containerStyle={{
                                  marginVertical: 5,
                                  width: "100%",
                                  marginHorizontal: "auto",
                                  border: "none",
                                  backgroundColor: "#ffffff"
                                }}
                                buttonStyle={{
                                  width: "80%",
                                  height: 30,
                                  marginHorizontal: "auto",
                                  backgroundColor: "#29b6f6",
                                  borderRadius: 20
                                }}
                              />
                            </View>
                          ) : cartState.itemIds.includes(l._id.toString()) ? (
                            <View style={styles.div_4}>
                              <Button
                                onPress={() => {
                                  removeItem(l._id, l.price)
                                }}
                                disabled={!isChecked ? true : false}
                                disabledStyle={{
                                  backgroundColor: "#ffffff"
                                }}
                                icon={
                                  <Icon
                                    name='window-minimize'
                                    type='font-awesome'
                                    color='#9e9e9e'
                                    size={15}
                                    iconStyle={{
                                      color: "#8bc34a"
                                    }}
                                  />
                                }
                                buttonStyle={{
                                  backgroundColor: "#ffffff"
                                }}
                              />
                              <ItemQuantity itemId={l._id} />

                              <Button
                                onPress={() => {
                                  addItem(l._id, l.price, l.resturantId)
                                }}
                                disabled={!isChecked ? true : false}
                                disabledStyle={{
                                  backgroundColor: "#ffffff"
                                }}
                                icon={
                                  <Icon
                                    name='plus'
                                    type='font-awesome'
                                    color='#9e9e9e'
                                    size={15}
                                    containerStyle={{
                                      marginTop: 5
                                    }}
                                    iconStyle={{
                                      color: "#8bc34a"
                                    }}
                                  />
                                }
                                buttonStyle={{
                                  backgroundColor: "#ffffff"
                                }}
                              />
                            </View>
                          ) : (
                            <View style={styles.div_4}>
                              <Button
                                title='A D D'
                                disabled={!isChecked ? true : false}
                                onPress={() => {
                                  addItem(l._id, l.price, l.resturantId)
                                }}
                                titleStyle={{
                                  fontSize: 18,
                                  fontWeight: "bold",
                                  letterSpacing: 1,
                                  // marginLeft: 5,
                                  fontFamily: "Open Sans",
                                  color: "#ffffff"
                                }}
                                containerStyle={{
                                  marginVertical: 5,
                                  width: "100%",
                                  marginHorizontal: "auto",
                                  border: "none",
                                  backgroundColor: "#ffffff"
                                }}
                                buttonStyle={{
                                  width: "80%",
                                  height: 30,
                                  marginHorizontal: "auto",
                                  backgroundColor: "#29b6f6",
                                  borderRadius: 20
                                }}
                              />
                            </View>
                          )
                        ) : (
                          <LinearProgress />
                        ))}
                    </View>
                    <FoodDialog
                      itemId={foodWantToAddId}
                      itemPrice={foodWantToAddPrice}
                      open={dialog}
                      handleClose={handleDialogClose}
                      Transition={Transition}
                    />
                    <CartRemoveDialog
                      dialog2={dialog2}
                      handleDialogClose2={handleDialogClose2}
                      Transition={Transition}
                    />
                  </View>
                ))
              ) : (
                <View
                  style={{
                    width: "80%",
                    height: 300,
                    marginHorizontal: "auto",
                    marginVertical: "auto",
                    justifyContent: "center",
                    alignItem: "center"
                  }}>
                  <LazyLoadImage
                    style={{
                      width: 220,
                      height: 200,
                      marginLeft: 40,
                      resizeMode: "cover"
                    }}
                    src={require("../../assets/images/home page no nearby.webp")}
                    effect='blur'
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "Open Sans",
                      fontWeight: "700",
                      color: "#212121",
                      fontSize: 15,
                      letterSpacing: 2
                    }}>
                    No food is available in this restaurant
                  </Text>
                </View>
              )}
            </ScrollView>
          ) : (
            <View
              style={{
                width: width * 0.7,
                height: height * 0.6,
                justifyContent: "center",
                marginVertical: "auto",
                marginHorizontal: "auto",
                backgroundColor: "#ffffff"
              }}>
              <ActivityIndicator
                size='large'
                color='#039be5'
                style={{
                  marginVertical: "auto",
                  marginHorizontal: 30
                }}
              />
            </View>
          )}
          {open && cartState.cart && (
            <Snackbar
              visible={open}
              onDismiss={handleClose}
              action={{
                label: "Close",
                onPress: () => {
                  handleClose()
                }
              }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginLeft: 30
                }}>
                <View
                  style={{
                    marginHorizontal: "auto",
                    flexDirection: "row",
                    alignItems: "center",
                    textAlign: "center"
                    // justifyContent: "space-evenly",
                  }}>
                  <Text
                    style={{
                      fontFamily: "Open Sans",
                      fontSize: 15,
                      color: "#ffffff",
                      fontWeight: "600",
                      marginHorizontal: 10
                    }}>
                    {cartState.cartItems?.quantity}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Open Sans",
                      fontSize: 15,
                      color: "#ffffff",
                      fontWeight: "600",
                      marginHorizontal: 10
                    }}>
                    {cartState.cartItems?.quantity > 1 ? "items" : "item"}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Open Sans",
                      fontSize: 15,
                      color: "#ffffff",
                      fontWeight: "600",
                      marginHorizontal: 10
                    }}>
                    Total
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Open Sans",
                      fontSize: 15,
                      color: "#ffffff",
                      fontWeight: "600",
                      marginHorizontal: 10
                    }}>
                    ₹{cartState.cartItems?.price}
                  </Text>
                </View>
              </View>
            </Snackbar>
          )}
        </View>
        <Dialog open={open2} onClose={handleClose2} style={{ bottom: 50 }}>
          <Alert onClose={handleClose2} severity='error'>
            You are not logged in!
          </Alert>
        </Dialog>
      </View>
    </Refresh>
  )
}

// export default Foodlist;
export default trackWindowScroll(Foodlist)
const styles = StyleSheet.create({
  div_1: {
    height,
    backgroundColor: "#ffffff"
  },
  div_2: {
    flexDirection: "row",
    width: "100%",
    height: "10%",
    backgroundColor: "#ffffff",
    top: 0,
    justifyContent: "space-around",
    paddingVertical: 20
  },
  image_1: {
    marginLeft: 20,
    height: 15,
    width: 15,
    backgroundColor: "#ffffff"
  },
  text_1: {
    textAlign: "center",
    width: 300,
    fontSize: 20,
    letterSpacing: 3,
    fontWeight: "bold",
    color: "#212121",
    textShadow: "1px 0 #212121",
    fontFamily: "Roboto Slab"
  },
  div_3: {
    width: "100%",
    marginHorizontal: "auto"
  },
  div_4: {
    position: "absolute",
    bottom: 0,
    marginHorizontal: 15,
    marginBottom: 5,
    width: 100,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderRadius: 5,
    boxShadow: "2px 2px 4px 1px #bdbdbd",
    backgroundColor: "#ffffff"
  },
  div_5: {
    flexDirection: "row",
    padding: 15,
    width: "95%",
    height: 70,
    marginVertical: 8,
    borderRadius: 10,
    marginHorizontal: "auto",
    backgroundColor: "#eeeeee",
    boxShadow: "3px 3px 6px 1px #eeeeee",
    justifyContent: "space-between"
  },
  button_1: {
    alignItems: "center",
    borderRadius: 5,
    height: 40,
    width: 150,
    backgroundColor: "#9575cd",
    flexDirection: "row",
    justifyContent: "space-evenly",
    boxShadow: "1px 3px 6px 1px #C9CCD1"
  }
})
