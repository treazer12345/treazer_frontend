import React from 'react'
import { Text, View } from 'react-native'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Button } from "react-native-elements";

const NoNotifications = ({ isLogin }) => {
    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}>
            <LazyLoadImage
                style={{
                    marginBottom: 10,
                    width: 220,
                    height: 200,
                    resizeMode: "cover",
                    borderRadius: 25,
                }}
                src={require("../../assets/images/notification.webp")}
                effect='blur'
            />
            <Text
                style={{
                    marginTop: 20,
                    marginBottom: 10,
                    fontSize: 15,
                    letterSpacing: 1,
                    fontWeight: "600",
                    fontFamily: "Open Sans",
                    textAlign: "center",
                }}>
                OOPS!! YOU HAVE NO NOTIFICATIONS
            </Text>
            {!isLogin && (
                <Button
                    onPress={() => navigation.navigate("User", { screen: "Login" })}
                    title='LOGIN FIRST'
                    type='outline'
                    buttonStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: 10,
                    }}
                    containerStyle={{
                        marginVertical: 10,
                        width: "70%",
                        marginHorizontal: "auto",
                        borderRadius: 10,
                        border: "none",
                        boxShadow: "3px 4px 6px #C9CCD1, -3px -4px 6px #ffffff",
                    }}
                    titleStyle={{
                        fontSize: 13,
                        textShadow: "1px 0 #ffffff",
                        fontWeight: "600",
                        letterSpacing: 3,
                        fontFamily: "Roboto Slab",
                    }}
                />
            )}
        </View>
    )
}

export default NoNotifications

