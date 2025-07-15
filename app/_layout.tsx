import {SplashScreen, Stack} from "expo-router";
import "./global.css"
import {useFonts} from 'expo-font'
import {useEffect} from "react";
import * as Sentry from '@sentry/react-native';
import useAuthStore from "@/store/auth.store";

Sentry.init({
  dsn: 'https://7e93919c559809ca805168dc8b68525f@o4509616763109376.ingest.us.sentry.io/4509616768090112',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const {isLoading, fetchAuthenticatedUser} = useAuthStore()

  const [fontsLoaded, error] = useFonts({
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'Quicksand-Light': require('../assets/fonts/Quicksand-Light.ttf')
  })
  useEffect(()=>{
    if(error) throw error
    if(fontsLoaded) SplashScreen.hideAsync()
  },[fontsLoaded, error])

  useEffect(() => {
    fetchAuthenticatedUser()
  }, []);
  if(!fontsLoaded || isLoading) return null;
  return <Stack screenOptions={{headerShown: false}}/>;
});