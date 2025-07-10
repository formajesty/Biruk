import {Redirect, Slot} from "expo-router";

export default function _Layout() {
    const is = false;

    if(!is) return <Redirect href={'/sign-in'}/>
    return (
        <Slot/>
    )
}
