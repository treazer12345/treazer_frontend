import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import { Icon, Button, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { AuthContext } from "../../context/userContext";
import { NotificationContext } from "../../context/notificationContext";
import { handleLogin, handleSignup } from "../../functions/userfunction";
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}
const Profile = () => {
  const [sendReq, setSendReq] = useState(true);
  const navigation = useNavigation()
  //GLOBAL STATE SETUP
  const { state, dispatch } = useContext(AuthContext);
  const { dispatch: notiDispatch } = useContext(NotificationContext);

  //LOCAL STATE SETUP
  const [drawer, setDrawer] = useState(false);
  const [drawer_2, setDrawer_2] = useState(false);

  // LOGIN STATE SETUP
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [phoneerror, setPhoneError] = useState("");
  const [passerror, setPassError] = useState("");

  // SIGNUP STATE SETUP
  const [username, setUsername] = useState("");
  const [phoneNo_2, setPhoneNo_2] = useState("");
  const [password_2, setPassword_2] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [signedIn, setSignedIn] = useState("");
  //SIGNUP ERROR STATE
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [phoneError, setPhoneError2] = useState("");
  const [signupError, setSignupError] = useState("");
  //check
  const [isChecked, setIsChecked] = useState(false);
  const openClose = () => {
    setIsChecked(!isChecked);
  };
  // EVENTS
  const toggleDrawer = () => {
    setDrawer(!drawer);
  };
  const toggleDrawer_2 = () => {
    setDrawer_2(!drawer_2);
  };
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // LOGIN
  const login = () => {
    handleLogin(
      phoneNo,
      password,
      dispatch,
      setPhoneNo,
      setPassword,
      toggleDrawer,
      setSendReq,
      setPhoneError,
      setPassError,
      navigation
    );
  };
  if (phoneError) {
    console.log("phoneError");
  }

  // SIGNUP
  const signup = () => {
    handleSignup(
      username,
      password_2,
      confirmPassword,
      phoneNo_2,
      setUsername,
      setPassword_2,
      setConfirmPassword,
      setPhoneNo_2,
      setUsernameError,
      setPasswordError,
      setConfirmPassError,
      setPhoneError2,
      setOpen,
      setSignedIn,
      setSendReq,
      setDrawer_2,
      notiDispatch,
      setSignupError,
      photo,
      setPhoto

    );
  };
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user && user._id;
  useEffect(() => {
    if (!state.isBeamToken) {
      window.navigator?.serviceWorker?.ready.then((serviceWorkerRegistration) => {
        const beamsClient = new PusherPushNotifications.Client({
          instanceId: "36674458-c456-44a3-823b-616088fa88e1",
          serviceWorkerRegistration: serviceWorkerRegistration,
        });
        if (userId) {
          beamsClient
            .start()
            .then(() =>
              console.log(
                "Successfully registered with Beams",
              )
            )
            .then(() => beamsClient.getDeviceInterests())
            .then((interests) => {
              console.log("Current interests:", interests);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  }, [state?.isBeamToken]);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            height: "100%",
            maxHeight: "100%",
            width: "100%",
            margin: "auto",
          }}>
          <View style={styles.container}>

            <LazyLoadImage
              style={{
                width: 220,
                height: 200,
                borderRadius: 25,
                marginVertical: "auto",
                marginHorizontal: "auto",
              }}
              src={require("../../assets/images/thumbs up.webp")}
              effect='blur'
            />

          </View>
          <View style={styles.profile}>
            <View
              style={{
                width: "80%",
                marginHorizontal: "auto",
                textAlign: "center",
              }}>
              <Text style={styles.text}>ACCOUNT</Text>
              <Text
                style={{
                  fontSize: "12px",
                  letterSpacing: 1,
                  fontWeight: "400",
                  fontFamily: "Open Sans",
                  marginBottom: 10,
                }}>
                Login/Create Account quickly to manage orders{" "}
              </Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={toggleDrawer}>
              <Text
                style={{
                  color: "#ffffff",
                  fontWeight: "600",
                  fontFamily: "Open Sans",
                  letterSpacing: 4,
                  marginVertical: "auto",
                  fontSize: 17,
                }}>
                Login
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                marginVertical: "20px",
                fontFamily: "Open Sans",
                fontSize: "15px",
                fontWeight: "600",
              }}>
              Don't have an account?{" "}
              <TouchableOpacity onPress={toggleDrawer_2}>
                <Text
                  style={{
                    color: "#4fc3f7",
                    fontWeight: "700",
                    fontFamily: "Open Sans",
                  }}>
                  Signup Here
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
        <View>
          <SwipeableDrawer
            anchor='bottom'
            open={drawer}
            onClose={toggleDrawer}
            onOpen={toggleDrawer}>
            <KeyboardAvoidingView style={styles.drawer}>
              <View
                style={{
                  marginVertical: 20,
                  marginLeft: 20,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    letterSpacing: 2,
                    fontFamily: "Roboto Slab",
                  }}>
                  LOGIN
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    letterSpacing: 2,
                    fontFamily: "Open Sans",
                  }}>
                  Enter your phone number to proceed
                </Text>
              </View>

              <Input
                type='tel'
                value={phoneNo}
                keyboardType='number-pad'
                onChangeText={(text) => {
                  setPhoneNo(text);
                  setPhoneError("");
                  setPassError("");
                }}
                placeholder='+91'
                label='10 digit mobile number'
                errorMessage={phoneerror}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 15,
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
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPhoneError("");
                  setPassError("");
                }}
                placeholder='password'
                label='Enter your password'
                errorMessage={passerror}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 10,
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
              {sendReq ? (
                <Button
                  onPress={login}
                  title='LOG IN'
                  raised
                  buttonStyle={{
                    backgroundColor: "#4fc3f7",
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
                <View style={{ marginTop: 20 }}>
                  <ActivityIndicator size='large' color='#82b1ff' />
                </View>
              )}
            </KeyboardAvoidingView>
          </SwipeableDrawer>
        </View>
        <View>
          <SwipeableDrawer
            anchor='bottom'
            open={drawer_2}
            onClose={toggleDrawer_2}
            onOpen={toggleDrawer_2}>
            <KeyboardAvoidingView style={styles.drawer_2}>
              <View
                style={{
                  width: "90%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 20,
                  marginLeft: 20,
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      letterSpacing: 2,
                      fontFamily: "Roboto Slab",
                    }}>
                    SIGN UP
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "400",
                      letterSpacing: 2,
                      fontFamily: "Open Sans",
                    }}>
                    Enter your credentials to proceed
                  </Text>
                </View>
                <TouchableOpacity onPress={toggleDrawer_2}>
                  <Icon
                    name='times'
                    type='font-awesome'
                    color='#9e9e9e'
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              <Input
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setUsernameError("");
                  setPasswordError("");
                  setConfirmPassError("");
                  setPhoneError2("");
                }}
                placeholder='Full Name'
                label='Enter your full name'
                errorMessage={usernameError}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 10,
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
                secureTextEntry={true}
                value={password_2}
                onChangeText={(text) => {
                  setPassword_2(text);
                  setUsernameError("");
                  setPasswordError("");
                  setConfirmPassError("");
                  setPhoneError2("");
                }}
                placeholder='password'
                label='Enter your password'
                errorMessage={passwordError}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 10,
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
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setUsernameError("");
                  setPasswordError("");
                  setConfirmPassError("");
                  setPhoneError2("");
                }}
                placeholder='confirm password'
                label='Re-type password'
                errorMessage={confirmPassError}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 10,
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
                type='tel'
                keyboardType='number-pad'
                value={phoneNo_2}
                onChangeText={(text) => {
                  setPhoneNo_2(text);
                  setUsernameError("");
                  setPasswordError("");
                  setConfirmPassError("");
                  setPhoneError2("");
                  setSignupError("");
                }}
                placeholder='+91'
                label='10 digit mobile number'
                errorMessage={phoneError}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 15,
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
                value={photo}
                onChangeText={(text) => {
                  setPhoto(text);
                  setUsernameError("");
                  setPasswordError("");
                  setConfirmPassError("");
                  setPhoneError2("");
                  setSignupError("");
                }}
                placeholder='Photo url'
                label='Give a photo link (optional)'
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 15,
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
              {/*<View>*/}
              {/*  <CheckBox*/}
              {/*    title={*/}
              {/*      <Text*/}
              {/*        style={{*/}
              {/*          letterSpacing: 1,*/}
              {/*          marginHorizontal: 5,*/}
              {/*        }}>*/}
              {/*        I understand and accept the*/}
              {/*        <Text*/}
              {/*          style={{ color: "#4fc3f7", marginHorizontal: 5 }}*/}
              {/*          onPress={() => {*/}
              {/*            navigation.navigate("User", { screen: "About" });*/}
              {/*            toggleDrawer_2();*/}
              {/*          }}>*/}
              {/*          Terms & Conditions*/}
              {/*        </Text>*/}
              {/*        of the company*/}
              {/*      </Text>*/}
              {/*    }*/}
              {/*    checked={isChecked}*/}
              {/*    onPress={openClose}*/}
              {/*    fontFamily='Open Sans'*/}
              {/*    containerStyle={{*/}
              {/*      backgroundColor: "#ffffff",*/}
              {/*      border: "none",*/}
              {/*      width: "90%",*/}
              {/*      padding: 0,*/}
              {/*      marginLeft: 20,*/}
              {/*      marginVertical: 10,*/}
              {/*    }}*/}
              {/*  />*/}
              {/*</View>*/}
              {signupError && (
                <Text
                  style={{
                    color: "#c62828",
                    fontSize: 12,
                    fontFamily: "Open Sans",
                    fontWeight: "700",
                    textAlign: "center",
                    marginVertical: 5,
                    marginHorizontal: "auto",
                  }}>
                  {signupError}
                </Text>
              )}
              {sendReq ? (
                <Button
                  onPress={signup}
                  title='SIGN UP'
                  // disabled={!isChecked ? true : false}
                  buttonStyle={{
                    backgroundColor: "#4fc3f7",
                    borderRadius: 10,
                  }}
                  containerStyle={{
                    marginVertical: 10,
                    width: "90%",
                    marginHorizontal: "auto",
                    borderRadius: 10,
                    border: "none",
                    boxShadow: "3px 4px 6px #C9CCD1",
                  }}
                  titleStyle={{
                    fontSize: 15,
                    textShadow: "1px 0 #ffffff",
                    fontWeight: "400",
                    letterSpacing: 3,
                    fontFamily: "Open Sans",
                  }}
                />
              ) : (
                <View style={{ marginTop: 20 }}>
                  <ActivityIndicator size='large' color='#82b1ff' />
                </View>
              )}
            </KeyboardAvoidingView>
          </SwipeableDrawer>
          {open && (
            <Dialog open={open} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity='success'
                style={{ textAlign: "center" }}>
                {signedIn}
              </Alert>
            </Dialog>
          )}
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    height: "55%",
    width: "100%",
    backgroundColor: "#ffffff",
    alignItems: "center",
    // justifyContent: "center",
    flexDirection: "column-reverse",
  },
  profile: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    flexDirection: "column",
    height: "45%",
    width: "100%",
  },
  logo: {
    // marginHorizontal: "auto",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "auto",
    marginHorizontal: "auto",
    height: "70px",
    width: "70px",
    borderRadius: 175,
    backgroundColor: "#424242",
  },
  text2: {
    marginVertical: "auto",
    marginHorizontal: "auto",
    letterSpacing: 3,
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    height: 40,
    width: "80%",
    textAlign: "center",
    borderRadius: 10,
    backgroundColor: "#4fc3f7",
    boxShadow: "3px 4px 6px #C9CCD1, -3px -4px 6px #ffffff",
    elevation: 2,
    textTransform: "uppercase",
  },
  text: {
    marginVertical: "20px",
    marginHorizontal: "auto",
    letterSpacing: 3,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Open Sans",
  },
  drawer: {
    width: "100%",
    height: 320,
    borderRadius: 10,
  },
  drawer_2: {
    width: "100%",
    height: 550,
    borderRadius: 10,
  },
});

//   <Button
//     onPress={phoneCheck}
//     title='send OTP'
//     buttonStyle={{
//       width: 100,
//       height: 40,
//       backgroundColor: "#4fc3f7",
//       borderRadius: 10,
//     }}
//     containerStyle={{
//       width: 100,
//       marginRight: 10,
//       borderRadius: 10,
//       boxShadow: "1px 2px 3px #C9CCD1",
//     }}
//   />
{
  /* <Input
                value={verifycode}
                onChangeText={(text) => {
                  setverifycode(text);
                  // setError("");
                }}
                placeholder='OTP code'
                label='Enter your OTP'
                errorMessage={OTPerror}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 10,
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
              /> */
}
