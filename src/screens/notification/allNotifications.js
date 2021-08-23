import React, { Fragment } from 'react'
import {
    View,
    ScrollView,
    Dimensions
} from 'react-native'
import NotificationBar from "./notificationBar"
import NotiHeader from "./notiHeader";

const { height } = Dimensions.get("window");

const AllNotifications = ({ notiState, deleteNotification }) => {
    const allNotifications = () => {
        if (
            notiState?.userNotifications?.length > 0 &&
            notiState?.restaurantNotifications?.length > 0
        ) {
            return (
                <View
                    style={{
                        width: "100%",
                        height: height * 0.95,
                    }}>
                    <NotiHeader />
                    <ScrollView contentContainerStyle={{ width: "100%" }}>
                        {notiState?.userNotifications?.map((noti, idx) => (
                            <NotificationBar key={idx} noti={noti} deleteNotification={deleteNotification} />
                        ))}
                        {notiState?.restaurantNotifications?.map((noti, idx) => (
                            <NotificationBar key={idx} noti={noti} deleteNotification={deleteNotification} />
                        ))}
                    </ScrollView>
                </View>
            );
        } else if (
            notiState?.userNotifications?.length > 0
        ) {
            return (
                <View
                    style={{
                        width: "100%",
                        height: height * 0.95,
                    }}>
                    <NotiHeader />
                    <ScrollView contentContainerStyle={{ width: "100%" }}>
                        {notiState.userNotifications.map((noti, idx) => (
                            <NotificationBar key={idx} noti={noti} deleteNotification={deleteNotification} />
                        ))}
                    </ScrollView>
                </View>
            );
        } else if (
            notiState?.restaurantNotifications?.length > 0
        ) {
            return (
                <View
                    style={{
                        width: "100%",
                        height: height * 0.95,
                    }}>
                    <NotiHeader />
                    <ScrollView contentContainerStyle={{ width: "100%" }}>
                        {notiState.restaurantNotifications.map((noti, idx) => (
                            <NotificationBar key={idx} noti={noti} deleteNotification={deleteNotification} />
                        ))}
                    </ScrollView>
                </View>
            );
        }
    }

    return <Fragment>{allNotifications()}</Fragment>
};
export default AllNotifications

