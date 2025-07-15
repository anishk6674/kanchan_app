import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { theme } from '../src/theme/theme';

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="light" backgroundColor="#1e40af" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1e40af',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Kanchan Delivery',
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="customers" 
          options={{ 
            title: 'Search Customers',
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="update/[customerId]" 
          options={{ 
            title: 'Update Status',
            headerShown: true
          }} 
        />
      </Stack>
      <Toast />
    </PaperProvider>
  );
}