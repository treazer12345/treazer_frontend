import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import Refresh from "../refresh";
import { Icon, Button, Input } from "react-native-elements";
const { height } = Dimensions.get("window");
import { CartContext } from "../../context/cartContext";
import { OrderContext } from "../../context/ordercontext";
import { LocationContext } from "../../context/locationcontext";
import Dialog from "@material-ui/core/Dialog";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";
import Paymentform from "./paymentform";
import { useNavigation } from "@react-navigation/native";
import MuiAlert from "@material-ui/lab/Alert";
import Slide from "@material-ui/core/Slide";

import "./site.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  "pk.eyJ1IjoidHJlYXplciIsImEiOiJja2xxYXJsZmgwMmJwMnBtaXR0M25leTY5In0.Iaj3HteMWU5ZQWCniy4KRA";

import { getCartItems } from "../../functions/cartfunction";

export default function OrderDelivery({ route }) {
  const navigation = useNavigation();
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { dispatch: orderDispatch } = useContext(OrderContext);
  const { state: locationState } = useContext(LocationContext);

  //LOCAL STATE SETUP
  const [houseNo, setHouseNo] = useState("");
  const [landmark, setLandmark] = useState("");
  const [usererror, setuserError] = useState("");
  const [restaurentError, setrestaurentError] = useState("");
  const [locationError, setlocationError] = useState("");
  const [landmarkError, setlandmarkError] = useState("");
  const [houseError, sethouseError] = useState("");
  const [cartError, setcartError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [orderReq, setOrderReq] = useState(true);

  //PAYMENT DRAWER SETUP
  const [paymentOpen, setPaymentHandle] = useState(false);
  const handlePaymentClose = () => {
    setPaymentHandle(false);
  };

  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const mapContainer = useRef();

  const [lng, setLng] = useState(locationState.longitude);
  const [lat, setLat] = useState(locationState.latitude);
  const [zoom, setZoom] = useState(15);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    const nav = new mapboxgl.NavigationControl({ visualizePitch: true });
    map.addControl(nav, "bottom-left");
    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      fitBoundsOptions: {
        maxZoom: 18,
      },
    });
    map.addControl(geolocate);
    geolocate.on("geolocate", (data, err) => {
      console.log("geolocate event occurred");
      setLat(data.coords.latitude);
      setLng(data.coords.longitude);
    });

    new mapboxgl.Marker({
      color: "#d32f2f",
      draggable: false,
    })
      .setLngLat([locationState.longitude, locationState.latitude])
      .addTo(map);

    getCartItems(user._id, cartDispatch);
    return () => map.remove();
  }, []);

  const [responseError, setResponseError] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const error = (
    <Dialog open={errorAlert} onClose={() => setErrorAlert(false)}>
      <Alert
        onClose={() => setErrorAlert(false)}
        severity='error'
        style={{ textAlign: "center" }}>
        you have to visit cart then checkout to make orders.
      </Alert>
    </Dialog>
  );

  const openPayPopUp = () => {
    if (cartState.cartItems === null) {
      setErrorAlert(true);
      return error;
    } else {
      setPaymentHandle(true);
    }
  };

  return (
    <Refresh>
      <View
        style={{
          height,
          // border: "1px solid black",
          backgroundColor: "#ffffff",
        }}>
        <View style={styles.v1}>
          <div className='map-container' ref={mapContainer} />
        </View>
        <TouchableOpacity
          onPress={() => {
            // navigation.goBack();
            window.history.back();
          }}
          style={{
            position: "absolute",
            top: 0,
            width: 30,
            padding: "auto",
            justifyContent: "center",
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: 5,
            backgroundColor: "#ffffff",
          }}>
          <Icon
            name='angle-left'
            type='font-awesome-5'
            color='#757575'
            size={26}
            containerStyle={{
              width: 30,
              borderRadius: 5,
              backgroundColor: "#ffffff",
              border: "2px solid #bdbdbd",
            }}
          />
        </TouchableOpacity>
        <View style={styles.v2}>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-around",
              height: 50,
            }}>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  fontFamily: "Open Sans",
                  color: "black",
                }}>
                Click
              </Text>
              <Icon
                name='crosshairs'
                type='font-awesome-5'
                color='#81d4fa'
                size={20}
                containerStyle={{
                  marginHorizontal: 10,
                }}
              />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  fontFamily: "Open Sans",
                  color: "black",
                }}>
                to select your location
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home", { screen: "Index" })}>
              <Icon
                name='home'
                type='font-awesome-5'
                color='#81d4fa'
                size={15}
                containerStyle={{
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  boxShadow: "1px 3px 6px 1px #C9CCD1",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView style={styles.v3}>
            <ScrollView>
              <Input
                type='text'
                value={houseNo}
                onChangeText={(text) => {
                  setHouseNo(text);
                  setlandmarkError("");
                  sethouseError("");
                }}
                placeholder='give your Flat No./House No.'
                errorMessage={houseError}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  // marginTop: 15,
                  width: "100%",
                  marginHorizontal: "auto",
                }}
                inputContainerStyle={{
                  marginTop: 5,
                }}
                inputContainerStyle={{
                  width: "95%",
                  marginHorizontal: "auto",
                }}
              />
              <Input
                type='text'
                value={landmark}
                onChangeText={(text) => {
                  setLandmark(text);
                  setlandmarkError("");
                  sethouseError("");
                }}
                placeholder='give a nearest landmark'
                errorMessage={landmarkError}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginVertical: 10,
                  width: "100%",
                  marginHorizontal: "auto",
                }}
                inputContainerStyle={{
                  marginTop: 5,
                }}
                inputContainerStyle={{
                  width: "95%",
                  marginHorizontal: "auto",
                }}
              />
              {orderReq ? (
                <Button
                  onPress={openPayPopUp}
                  title='GIVE YOUR ORDER'
                  raised
                  buttonStyle={{
                    backgroundColor: "#81d4fa",
                    borderRadius: 10,
                  }}
                  containerStyle={{
                    marginVertical: 10,
                    width: "90%",
                    marginHorizontal: "auto",
                    borderRadius: 10,
                    border: "none",
                    boxShadow: "3px 4px 6px #C9CCD1, -3px -4px 6px #ffffff",
                  }}
                  titleStyle={{
                    fontSize: 15,
                    textShadow: "1px 0 #ffffff",
                    fontWeight: "400",
                    letterSpacing: 3,
                    fontFamily: "Roboto Slab",
                  }}
                />
              ) : (
                <View style={{ marginTop: 10 }}>
                  <ActivityIndicator
                    size='large'
                    color='#82b1ff'
                    style={{
                      margin: "auto",
                    }}
                  />
                </View>
              )}
              <Dialog open={open} onClose={handleClose}>
                <Alert onClose={handleClose} severity='success'>
                  {orderSuccess}
                </Alert>
              </Dialog>
              <Dialog open={open2} onClose={handleClose2}>
                <Alert
                  onClose={handleClose2}
                  severity='error'
                  style={{ textAlign: "center" }}>
                  {usererror
                    ? usererror
                    : restaurentError
                      ? restaurentError
                      : cartError
                        ? cartError
                        : locationError
                          ? locationError
                          : landmarkError
                            ? landmarkError
                            : houseError
                              ? houseError
                              : responseError}
                </Alert>
              </Dialog>
              {error}
            </ScrollView>
          </KeyboardAvoidingView>
          <Paymentform
            open={paymentOpen}
            Transition={Transition}
            handleClose={handlePaymentClose}
            route={route}
            lng={lng}
            lat={lat}
            landmark={landmark}
            houseNo={houseNo}
            setuserError={setuserError}
            setOpen2={setOpen2}
            setrestaurentError={setrestaurentError}
            setlocationError={setlocationError}
            setlandmarkError={setlandmarkError}
            sethouseError={sethouseError}
            setcartError={setcartError}
            setResponseError={setResponseError}
            setOrderReq={setOrderReq}
            orderDispatch={orderDispatch}
            cartDispatch={cartDispatch}
            setOrderSuccess={setOrderSuccess}
            setHouseNo={setHouseNo}
            setLandmark={setLandmark}
            setOpen={setOpen}
          />
        </View>
      </View>
    </Refresh>
  );
}

const styles = StyleSheet.create({
  v2: {
    width: "100%",
    height: height * 0.3,
    // border: "1px solid black",
  },
  v1: {
    width: "100%",
    height: height * 0.55,
  },
  v3: {
    width: "100%",
    // height: height * 0.2,
    // border: "1px solid black",
    backgroundColor: "#ffffff",
  },
});
