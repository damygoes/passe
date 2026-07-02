import { useAuth } from '@clerk/expo'
import { Redirect, Tabs } from 'expo-router'

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return null
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />

  return (
    <Tabs>
      <Tabs.Screen name="trips/index" options={{ title: 'Trips' }} />
      <Tabs.Screen name="map/index" options={{ title: 'Map' }} />
      <Tabs.Screen name="account/index" options={{ title: 'Account' }} />
    </Tabs>
  )
}
