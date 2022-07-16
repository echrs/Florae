import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from './Context';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar style='light' />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
