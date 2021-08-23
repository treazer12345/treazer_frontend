import React, { useState, useContext, useEffect } from "react"
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Switch
} from "react-native"
const { width, height } = Dimensions.get("window")
import { Icon, CheckBox, ListItem } from "react-native-elements"
import { RestaurentContext } from "../../context/restaurentContext"
import { ProductContext } from "../../context/productcontext"
import { OrderContext } from "../../context/ordercontext"
import Axios from "axios"
import BASE_URL from "../../api"
import {
  LazyLoadImage,
  trackWindowScroll
} from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"
import Refresh from "../refresh"
import axios from "axios"
const Myrestaurentfoodlist = ({ route, scrollPosition }) => {
  const { state: restaurentState, dispatch: restaurentDispatch } =
    useContext(RestaurentContext)
  const { state: productState, dispatch: productDispatch } =
    useContext(ProductContext)
  const { dispatch: orderDispatch } = useContext(OrderContext)

  const singleRestaurent =
    restaurentState.myRestaurent && restaurentState.myRestaurent.length > 0
      ? restaurentState.myRestaurent[0]
      : restaurentState.myRestaurent

  const [isChecked, setIsChecked] = useState(singleRestaurent?.isOpened)
  const [sendReq, setSendReq] = useState(true)
  const [getFoodReq, setGetFoodReq] = useState(true)

  const user = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")
  const refreshtoken = localStorage.getItem("refresh-token")
  const resturantId = user ? user.resturantId._id : null
  const id = route.params ? route.params.id : resturantId
  const openClose = () => {
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
        console.log(restaurant)
        restaurentDispatch({
          type: "ADD_ONLY_MY_RESTAURENT",
          payload: [restaurant]
        })
        if (!singleRestaurent) {
          setIsChecked(restaurant.isOpened)
        } else {
          setIsChecked(!isChecked)
        }
        if (
          restaurentState.singleRestaurent.length > 0 &&
          restaurentState.singleRestaurent[0]._id.toString() ===
          restaurant._id.toString()
        ) {
          restaurentState.singleRestaurent[0].isOpened = restaurant.isOpened
        } else {
          restaurentState.allRestaurent.map(item => {
            if (item._id.toString() === resturantId.toString()) {
              item.isOpened = restaurant.isOpened
            } else {
              return item
            }
          })
        }

        setSendReq(true)
      })
      .catch(err => console.log(err))
  }

  // const [availablemsg, setAvailableMsg] = useState(null);
  const toggleSwitch = item => {
    axios
      .post(
        `${BASE_URL}/api/product/productavailable`,
        { item },
        {
          headers: {
            "x-token": token,
            "x-refresh-token": refreshtoken
          }
        }
      )
      .then(res => {
        const { success, msg, product } = res.data
        console.log(msg)
        if (success) {
          productDispatch({
            type: "CHANGE_PRODUCT_AVAILABLITY",
            payload: product
          })
          // setAvailableMsg(msg);
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (id) {
      getRestaurentProduct()
    }
    if (!Array.isArray(restaurentState.myRestaurent)) {
      getMyRestaurent()
    }
  }, [])
  const getRestaurentProduct = () => {
    if (
      productState.myrestaurentProducts.length === 0 ||
      productState.myrestaurentProducts[0].resturantId.toString() !==
      restaurentState.myRestaurent[0]._id.toString()
    ) {
      setGetFoodReq(false)
      Axios.post(`${BASE_URL}/api/product/getProductByCategory`, {
        resturantId: id
      })
        .then(res => {
          const { products } = res.data
          // console.log(products);
          productDispatch({
            type: "GET_MY_RESTAURENT_PRODUCTS",
            payload: products
          })
          setGetFoodReq(true)
        })
        .catch(err => console.log(err))
    }
  }

  const getMyRestaurent = () => {
    Axios.get(`${BASE_URL}/api/resturant/${resturantId}/getOwnerResturant`, {
      headers: {
        "x-token": token,
        "x-refresh-token": refreshtoken
      }
    })
      .then(res => {
        console.log(res.data)
        const { resturant, restaurentOrder } = res.data
        restaurentDispatch({
          type: "ADD_ONLY_MY_RESTAURENT",
          payload: resturant
        })
        if (Array.isArray(resturant) && resturant.length > 0) {
          setIsChecked(resturant[0].isOpened)
        }
        orderDispatch({
          type: "GET_MY_RESTAURENT_ORDER",
          payload: restaurentOrder
        })
      })
      .catch(err => {
        // const error = err.response.data.error;
        console.log(err)
      })
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
              fontWeight: "400",
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
                  color='#039be5'
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
          {getFoodReq ? (
            <ScrollView style={styles.div_3}>
              {productState.myrestaurentProducts &&
                productState.myrestaurentProducts.length !== 0 ? (
                productState.myrestaurentProducts.map((item, idx) => (
                  <ListItem bottomDivider key={idx}>
                    <ListItem.Content
                      style={{ height: 150, justifyContent: "space-between" }}>
                      <ListItem.Title
                        style={{
                          fontFamily: "Open Sans",
                          fontSize: 15,
                          fontWeight: "700"
                          // marginBottom: 10,
                        }}>
                        {item.name}
                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={{
                          fontFamily: "Open Sans",
                          fontSize: 15,
                          fontWeight: "600"
                          // marginBottom: 10,
                        }}>
                        {item.description.slice(0, 50)}...
                      </ListItem.Subtitle>
                      <ListItem.Subtitle
                        style={{
                          fontFamily: "Roboto Slab",
                          fontSize: 25,
                          fontWeight: "bold"
                          // marginBottom: 10,
                        }}>
                        ₹{item.price}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <View
                      style={{
                        width: "40%",
                        height: 150,
                        justifyContent: "space-between"
                      }}>
                      <LazyLoadImage
                        src={item.photo}
                        resizemode='cover'
                        effect='blur'
                        scrollPosition={scrollPosition}
                        placeholderSrc={require("../../assets/images/lazyimage.webp")}
                        style={{
                          filter: `${isChecked ? "grayscale(0%)" : "grayscale(100%)"
                            }`,
                          height: 120,
                          width: "100%",

                          borderRadius: 5,
                          boxShadow: "3px 3px 6px 1px #bdbdbd"
                        }}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}>
                        <Switch
                          trackColor={{ false: "#767577", true: "#81b0ff" }}
                          thumbColor={item.isAvailable ? "#f5dd4b" : "#f4f3f4"}
                          ios_backgroundColor='#3e3e3e'
                          onValueChange={() => toggleSwitch(item)}
                          value={item.isAvailable}
                        />
                        {item.isAvailable ? (
                          <Text
                            style={{
                              fontFamily: "Open Sans",
                              fontSize: 12,
                              fontWeight: "600",
                              color: "#2e7d32",
                              marginTop: 2
                            }}>
                            Available
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontFamily: "Open Sans",
                              fontSize: 12,
                              fontWeight: "600",
                              color: "#d84315",
                              marginTop: 2
                            }}>
                            Not available
                          </Text>
                        )}
                      </View>
                    </View>
                  </ListItem>
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
                    You have no food in your restaurant
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
        </View>
      </View>
    </Refresh>
  )
}

// export default Myrestaurentfoodlist;
export default trackWindowScroll(Myrestaurentfoodlist)
const styles = StyleSheet.create({
  div_1: {
    flex: 1,
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
    letterSpacing: 2,
    fontWeight: "bold",
    color: "#212121",
    textShadow: "1px 0 #263238",
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
    marginBottom: 25,
    width: 100,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderRadius: 5,
    boxShadow: "2px 2px 4px 1px #bdbdbd",
    // border: "1px solid black",
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
