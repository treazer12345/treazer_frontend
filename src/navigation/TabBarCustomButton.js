import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Svg, { Path } from "react-native-svg"

const TabBarCustomButton = ({ accessibilityState, children, onPress }) => {
    var isSelected = accessibilityState.selected

    if (isSelected) {
        return (
            <View
                style={{ flex: 1, alignItems: "center", backgroundColor: "#ffffff" }}>
                <View style={{ flexDirection: "row", position: "absolute", top: 0 }}>
                    <Svg width={75} height={0} viewBox='0 0 75 0'>
                        <Path
                            d='M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z'
                            fill='#ffffff'
                        />
                    </Svg>
                </View>
                <TouchableOpacity
                    style={{
                        top: -15.5,
                        justifyContent: "center",
                        alignItems: "center",
                        width: 40,
                        height: 40,
                        borderRadius: 25,
                        backgroundColor: "#00A7FF"
                    }}
                    onPress={onPress}>
                    {children}
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    height: 49,
                    backgroundColor: "white"
                }}
                activeOpacity={1}
                onPress={onPress}>
                {children}
            </TouchableOpacity>
        )
    }
}
export default TabBarCustomButton
