
import React from 'react'
import {Slot} from "expo-router";
import { SafeAreaView} from "react-native-safe-area-context";
import {Text} from "react-native";

export default function _Layout() {
    return (
        <SafeAreaView>
            <Text>Auth</Text>
        <Slot/>
        </SafeAreaView>
    )
}
