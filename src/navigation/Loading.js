import React from 'react'
import { View, ActivityIndicator, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const Loading = () => (
    <View
        style={{
            width,
            height,
            justifyContent: "center",
            marginHorizontal: "auto",
            marginVertical: "auto",
            backgroundColor: "#ffffff",
            alignItems: "center"
        }}>
        <ActivityIndicator
            size='large'
            color='#82b1ff'
            style={{
                margin: "auto"
            }}
        />
    </View>
)

export default Loading
