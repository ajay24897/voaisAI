import React, {useEffect} from 'react';
import Navigation from './src/navigation';
import SplashScreen from 'react-native-splash-screen';

function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <>
      <Navigation />
    </>
  );
}

export default App;
