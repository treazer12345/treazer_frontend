import React, { useContext, useState, useEffect } from "react";
import { Snackbar } from "react-native-paper";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
// import Refresh from "./refresh";
import Axios from "axios";
import BASE_URL from "../../api";
const { height } = Dimensions.get("window");
import { Button, Icon } from "react-native-elements";
import { ListItem } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { ProductContext } from "../../context/productcontext";
import { AuthContext } from "../../context/userContext";
import { CartContext } from "../../context/cartContext";
import { LocationContext } from "../../context/locationcontext";
import FoodDialog from "./foodDialog";
import CartRemoveDialog from "../cart/cartRemoveDialog";
import Dialog from "@material-ui/core/Dialog";
import MuiAlert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";
import Slide from "@material-ui/core/Slide";
import { addTocart, removeFromCart } from "../../functions/cartfunction";
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
import { } from "../../context/productcontext";

//=====================================================================
const FilterProduct = ({ route, scrollPosition }) => {
  const navigation = useNavigation();

  // FOOD DIALOG SETUP
  const [dialog, setDialog] = useState(false);
  const handleDialogClose = () => {
    setDialog(!dialog);
  };

  //GLOBAL STATE SET-UP
  const { state: productState, dispatch: productDispatch } =
    useContext(ProductContext);
  const { state: userState } = useContext(AuthContext);
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { state: locationState } = useContext(LocationContext);

  //LOCAL VERIABLE FROM GLOBAL STATE

  //LOCAL STATE-SETUP
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  // LOCALSTORAGE USER AND TOKEN
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const dishType = route.params.name;

  const [phId, setPHID] = useState([]);

  useEffect(() => {
    if (
      dishType ||
      (productState.filtered_products &&
        productState.filtered_products[0] &&
        productState.filtered_products[0].category === dishType)
    ) {
      setLoading2(false);
      Axios.post(`${BASE_URL}/api/product/filterCategory`, {
        category: dishType,
      })
        .then((res) => {
          // console.log(res.data);
          const { products } = res.data;
          productDispatch({ type: "FILTER_PRODUCT", payload: products });
          const productDistances = products.map((prod, idx) => {
            const restLat = prod.resturantId.location.coordinates[1];
            const restLon = prod.resturantId.location.coordinates[0];
            return {
              id: prod.resturantId._id.toString(),
              distance: calcCrow(
                locationState.latitude,
                locationState.longitude,
                restLat,
                restLon
              ),
            };
          });
          // console.log(productDistances);
          const hideProduct = productDistances.map((pd) => {
            if (pd.distance <= 5.5) {
              return pd.id;
            } else {
              return "0";
            }
          });
          setPHID(hideProduct);
          setLoading2(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  // console.log(phId);

  //SNACKBAR SETUP
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false);
  };

  //ADD ITEMS TO CART
  const [foodWantToAddId, setFoodWantToAddId] = useState("");
  const [foodWantToAddPrice, setFoodWantToAddPrice] = useState("");

  const addItem = (productId, price, ResturantId) => {
    if (!userState.isLogin) {
      setOpen2(true);
    } else {
      let existingRestaurent = null;
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
        );
      } else if (
        cartState.cartItems !== null &&
        cartState.cartItems.cartItem.length > 0
      ) {
        existingRestaurent = cartState.cartItems.cartItem.find(
          (item) =>
            item.productId.resturantId.toString() === ResturantId.toString()
        );
      }
      if (existingRestaurent) {
        console.log("restaurent found");
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
        );
      } else if (cartState.cartItems !== null) {
        setFoodWantToAddId(productId);
        setFoodWantToAddPrice(price);
        setDialog(true);
        console.log(productId, price);
      }
    }
  };

  //REMOVE SINGLE CART ITEM
  const [dialog2, setDialog2] = useState(false);
  const handleDialogClose2 = () => {
    setDialog2(false);
  };
  const removeItem = (productId, price) => {
    if (cartState.cartItems.quantity === 1) {
      setDialog2(true);
      console.log("1");
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
      );
    }
  };

  const handleOrder = (ResturantId, productId, price) => {
    if (!userState.isLogin) {
      setOpen2(true);
    } else {
      let existingRestaurent = null;
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
        );
        if (!userState.isLogin) {
          setOpen2(true);
        } else {
          navigation.navigate("Home", {
            screen: "Location",
            params: { ResturantId },
          });
        }
      } else if (
        cartState.cartItems !== null &&
        cartState.cartItems.cartItem.length > 0
      ) {
        existingRestaurent = cartState.cartItems.cartItem.find(
          (item) =>
            item.productId.resturantId.toString() === ResturantId.toString()
        );
      }
      if (existingRestaurent) {
        console.log("restaurent found");

        navigation.navigate("Home", {
          screen: "Location",
          params: { ResturantId },
        });
        // }
      } else if (cartState.cartItems !== null) {
        setFoodWantToAddId(productId);
        setFoodWantToAddPrice(price);
        setDialog(true);
        console.log(productId, price);
      }
    }
  };

  const calcCrow = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var latR1 = toRad(lat1);
    var latR2 = toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(latR1) *
      Math.cos(latR2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  };
  const toRad = (Value) => {
    return (Value * Math.PI) / 180;
  };

  return (
    <View style={styles.div_1}>
      <View style={styles.div_2}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home", { screen: "Index" })}>
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
              boxShadow: "1px 3px 6px 1px #C9CCD1",
            }}
          />
        </TouchableOpacity>
        <Text style={styles.text_1}>{dishType}</Text>
      </View>
      <View
        style={{
          width: "100%",
          height: height * 0.82,
          borderTopWidth: 2,
          borderTopColor: "#eeeeee",
        }}>
        {productState.filtered_products &&
          productState.filtered_products.length > 0 ? (
          <ScrollView style={styles.div_3}>
            {productState.filtered_products.map((l, i) => (
              <View style={{ marginVertical: 10 }} key={i}>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: 15,
                    marginTop: 10,
                    marginBottom: 10,
                    paddingHorizontal: 20,
                    fontFamily: "Roboto Slab",
                  }}>
                  {l.resturantId.resturant_name}
                  <Text
                    style={{
                      color: l.resturantId.isOpened ? "#43a047" : "#d32f2f",
                      fontSize: 12,
                      fontWeight: "600",
                      fontFamily: "Open Sans",
                      marginHorizontal: 5,
                    }}>
                    ({l.resturantId.isOpened ? "Open" : "Closed"})
                  </Text>
                </Text>
                <View
                  key={i}
                  style={{
                    justifyContent: "space-between",
                    width: "95%",
                    marginHorizontal: "auto",
                    flexDirection: "row",
                    padding: 15,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    boxShadow: "0 2px 4px 0 #bdbdbd, 0 3px 10px 0 #bdbdbd",
                  }}>
                  <ListItem.Content
                    style={{
                      height: 150,
                      justifyContent: "space-between",
                    }}>
                    <View style={{ width: "90%" }}>
                      <ListItem.Title
                        style={{
                          fontFamily: "Open Sans",
                          fontSize: 15,
                          fontWeight: "700",
                          // marginBottom: 10,
                        }}>
                        {l.name.slice(0, 20)}...
                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={{
                          fontFamily: "Open Sans",
                          fontSize: 12,
                          fontWeight: "600",
                          marginTop: 10,
                        }}>
                        {l.description.slice(0, 50)}...
                      </ListItem.Subtitle>
                    </View>

                    <View style={{ width: "80%" }}>
                      <ListItem.Subtitle
                        style={{
                          fontFamily: "Roboto Slab",
                          fontSize: 25,
                          fontWeight: "bold",
                          // marginBottom: 10,
                        }}>
                        ₹{l.price}
                      </ListItem.Subtitle>
                      {phId.length > 0 &&
                        phId.includes(l.resturantId._id.toString()) ? (
                        <Button
                          title='ORDER NOW'
                          type='outline'
                          onPress={() =>
                            handleOrder(l.resturantId._id, l._id, l.price)
                          }
                          disabled={!l.resturantId.isOpened ? true : false}
                          titleStyle={{
                            fontSize: 12,
                            fontWeight: "800",
                            letterSpacing: 3,
                            fontFamily: "Open Sans",
                            color: "#29b6f6",
                          }}
                          containerStyle={{
                            marginVertical: 10,
                            width: "90%",
                            height: 30,
                            borderRadius: 10,
                            border: "none",
                            boxShadow: "3px 4px 6px #C9CCD1",
                            backgroundColor: "#ffffff",
                          }}
                          buttonStyle={{
                            width: "100%",
                            height: 30,
                            borderRadius: 10,
                            marginHorizontal: "auto",
                            backgroundColor: "#ffffff",
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            marginTop: 5,
                            width: "100%",
                            backgroundColor: "#ffffff",
                            justifyContent: "center",
                          }}>
                          {loading2 ? (
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{
                                  width: "100%",
                                  fontWeight: "700",
                                  marginTop: 5,
                                  fontFamily: "Open Sans",
                                  fontSize: 12,
                                  color: "#bdbdbd",
                                }}>
                                Order isn't available
                              </Text>
                              <img
                                src={require("../../assets/icons/outline_wrong_location_black_18dp.png")}
                                style={{
                                  height: 20,
                                  width: 20,
                                  marginBottom: 5,
                                }}
                                alt='WL'
                              />
                            </View>
                          ) : (
                            <ActivityIndicator
                              size='small'
                              color='#82b1ff'
                              style={{
                                margin: "auto",
                              }}
                            />
                          )}
                        </View>
                      )}
                    </View>
                  </ListItem.Content>
                  <View
                    style={{
                      width: "40%",
                      height: 150,
                    }}>
                    <LazyLoadImage
                      src={l.photo}
                      resizemode='cover'
                      effect='blur'
                      scrollPosition={scrollPosition}
                      style={{
                        filter: `${l.resturantId.isOpened
                          ? "grayscale(0%)"
                          : "grayscale(100%)"
                          }`,
                        height: phId.includes(l.resturantId._id.toString())
                          ? 120
                          : 130,
                        width: "100%",
                        marginTop: 10,
                        borderRadius: 5,
                        boxShadow: "3px 3px 6px 1px #bdbdbd",
                      }}
                    />

                    {loading ? (
                      (cartState && cartState.cartItems === null) ||
                        cartState.cartItems.cartItem.length === 0 ? (
                        phId.includes(l.resturantId._id.toString()) && (
                          <View style={styles.div_4}>
                            <Button
                              title='A D D'
                              disabled={!l.resturantId.isOpened ? true : false}
                              onPress={() => {
                                addItem(l._id, l.price, l.resturantId._id);
                              }}
                              titleStyle={{
                                fontSize: 18,
                                fontWeight: "bold",
                                letterSpacing: 1,
                                // marginLeft: 5,
                                fontFamily: "Open Sans",
                                color: "#ffffff",
                              }}
                              containerStyle={{
                                marginVertical: 5,
                                width: "100%",
                                marginHorizontal: "auto",
                                border: "none",
                                backgroundColor: "#ffffff",
                              }}
                              buttonStyle={{
                                width: "80%",
                                height: 30,
                                marginHorizontal: "auto",
                                backgroundColor: "#29b6f6",
                                borderRadius: 10,
                              }}
                            />
                          </View>
                        )
                      ) : (
                        cartState.cartItems.cartItem.map((item, idx) =>
                          item.productId._id.toString() === l._id.toString() ? (
                            <View style={styles.div_4} key={idx}>
                              <Button
                                onPress={() => {
                                  removeItem(l._id, l.price);
                                }}
                                disabled={
                                  !l.resturantId.isOpened ? true : false
                                }
                                disabledStyle={{
                                  backgroundColor: "#ffffff",
                                }}
                                icon={
                                  <Icon
                                    name='window-minimize'
                                    type='font-awesome'
                                    color='#9e9e9e'
                                    size={15}
                                    iconStyle={{
                                      color: "#8bc34a",
                                    }}
                                  />
                                }
                                buttonStyle={{
                                  backgroundColor: "#ffffff",
                                }}
                              />
                              <Text
                                style={{
                                  height: 25,
                                  border: "none",
                                  paddingTop: 5,
                                  paddingBottom: 5,
                                  fontSize: 18,
                                  fontWeight: 900,
                                  color: "#9e9e9e",
                                  fontFamily: "Open Sans",
                                }}>
                                {item.quantity}
                              </Text>
                              <Button
                                onPress={() => {
                                  addItem(l._id, l.price, l.resturantId._id);
                                }}
                                disabled={
                                  !l.resturantId.isOpened ? true : false
                                }
                                disabledStyle={{
                                  backgroundColor: "#ffffff",
                                }}
                                icon={
                                  <Icon
                                    name='plus'
                                    type='font-awesome'
                                    color='#9e9e9e'
                                    size={15}
                                    containerStyle={{
                                      marginTop: 5,
                                    }}
                                    iconStyle={{
                                      color: "#8bc34a",
                                    }}
                                  />
                                }
                                buttonStyle={{
                                  backgroundColor: "#ffffff",
                                }}
                              />
                            </View>
                          ) : (
                            phId.includes(l.resturantId._id.toString()) && (
                              <View style={styles.div_4}>
                                <Button
                                  title='A D D'
                                  disabled={
                                    !l.resturantId.isOpened ? true : false
                                  }
                                  onPress={() => {
                                    addItem(l._id, l.price, l.resturantId._id);
                                  }}
                                  titleStyle={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    letterSpacing: 1,
                                    // marginLeft: 5,
                                    fontFamily: "Open Sans",
                                    color: "#ffffff",
                                  }}
                                  containerStyle={{
                                    marginVertical: 5,
                                    width: "100%",
                                    marginHorizontal: "auto",
                                    border: "none",
                                    backgroundColor: "#ffffff",
                                  }}
                                  buttonStyle={{
                                    width: "80%",
                                    height: 30,
                                    marginHorizontal: "auto",
                                    backgroundColor: "#29b6f6",
                                  }}
                                />
                              </View>
                            )
                          )
                        )
                      )
                    ) : (
                      <View
                        style={{
                          width: "80%",
                          height: 3,
                          marginHorizontal: "auto",
                          backgroundColor: "#ffffff",
                        }}>
                        <LinearProgress />
                      </View>
                    )}
                  </View>
                  <FoodDialog
                    itemId={foodWantToAddId}
                    itemPrice={foodWantToAddPrice}
                    setOpen2={setOpen2}
                    setLoading={setLoading}
                    open={dialog}
                    handleClose={handleDialogClose}
                    addTocart={addTocart}
                  />
                  <CartRemoveDialog
                    dialog2={dialog2}
                    handleDialogClose2={handleDialogClose2}
                    Transition={Transition}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        ) : !loading ? (
          <ActivityIndicator
            size='large'
            color='#82b1ff'
            style={{
              margin: "auto",
            }}
          />
        ) : (
          <View
            style={{
              width: "80%",
              height: 200,
              margin: "auto",
              justifyContent: "center",
              alignItem: "center",
            }}>
            <LazyLoadImage
              style={{
                marginBottom: 10,
                width: 220,
                height: 200,
                marginLeft: 20,
                resizeMode: "cover",
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
                letterSpacing: 2,
                marginVertical: 10,
              }}>
              No food is available of this type
            </Text>
          </View>
        )}
        {open && cartState.cart && (
          <Snackbar
            visible={open}
            onDismiss={handleClose}
            action={{
              label: "Close",
              onPress: () => {
                handleClose();
              },
            }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginLeft: 30,
              }}>
              <View
                style={{
                  marginHorizontal: "auto",
                  flexDirection: "row",
                  alignItems: "center",
                  textAlign: "center",
                  // justifyContent: "space-evenly",
                }}>
                <Text
                  style={{
                    fontFamily: "Open Sans",
                    fontSize: 15,
                    color: "#ffffff",
                    fontWeight: "600",
                    marginHorizontal: 10,
                  }}>
                  {cartState.cartItems?.quantity}
                </Text>
                <Text
                  style={{
                    fontFamily: "Open Sans",
                    fontSize: 15,
                    color: "#ffffff",
                    fontWeight: "600",
                    marginHorizontal: 10,
                  }}>
                  {cartState.cartItems?.quantity > 1 ? "items" : "item"}
                </Text>
                <Text
                  style={{
                    fontFamily: "Open Sans",
                    fontSize: 15,
                    color: "#ffffff",
                    fontWeight: "600",
                    marginHorizontal: 10,
                  }}>
                  Total
                </Text>
                <Text
                  style={{
                    fontFamily: "Open Sans",
                    fontSize: 15,
                    color: "#ffffff",
                    fontWeight: "600",
                    marginHorizontal: 10,
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
  );
};

export default trackWindowScroll(FilterProduct);

const styles = StyleSheet.create({
  div_1: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  div_2: {
    flexDirection: "row",
    width: "100%",
    height: "10%",
    backgroundColor: "#ffffff",
    top: 0,
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  image_1: {
    marginLeft: 20,
    height: 15,
    width: 15,
    backgroundColor: "#ffffff",
  },
  text_1: {
    textAlign: "center",
    width: 300,
    fontSize: 20,
    letterSpacing: 3,
    fontWeight: "bold",
    color: "#212121",
    textShadow: "1px 0 #212121",
    fontFamily: "Roboto Slab",
  },
  div_3: {
    width: "100%",
    marginHorizontal: "auto",
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
    backgroundColor: "#ffffff",
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
    justifyContent: "space-between",
  },
  button_1: {
    alignItems: "center",
    borderRadius: 5,
    height: 40,
    width: 150,
    backgroundColor: "#9575cd",
    flexDirection: "row",
    justifyContent: "space-evenly",
    boxShadow: "1px 3px 6px 1px #C9CCD1",
  },
});
