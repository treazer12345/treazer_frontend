import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { Icon } from "react-native-elements";
import { NotificationContext } from '../../context/notificationContext';
import { deleteAllNotifications } from "../../functions/notificationfunction"

const NotiHeader = () => {
    const { dispatch: notiDispatch } = useContext(
        NotificationContext
    );
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id
    const resturantId = user && user.resturantId?._id;
    console.log(resturantId)
    return (
        <View style={{
            width: "100%",
            height: 60,
            flexDirection: "row",
            backgroundColor: "#00A7FF",
            justifyContent: "space-between",
            paddingVertical: 15,
            paddingHorizontal: 15
        }}>
            <View
                style={{
                    height: 30,
                    width: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                    backgroundColor: "#ffffff"
                }}>
                <Icon
                    name='arrow-back'
                    type='ionicon'
                    color='black'
                    size={24}
                    onPress={() => window.history.back()}
                />
            </View>
            <Text style={{
                fontFamily: "Open Sans",
                fontSize: 18,
                fontWeight: "700",
                letterSpacing: 1,
                color: "#ffffff"
            }}>Notifications</Text>
            <View
                style={{
                    height: 30,
                    width: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 20,
                    backgroundColor: "#ffffff"
                }}>
                <Icon
                    name='close'
                    type='ionicon'
                    color='black'
                    size={24}
                    onPress={() => deleteAllNotifications(notiDispatch, userId, resturantId)
                    }
                />
            </View>
        </View>
    )
}
export default NotiHeader

