
import './App.css'

// 1. import `NextUIProvider` component
import {NextUIProvider} from "@nextui-org/react";
import { AppRouter } from './routes/AppRouter';

function App() {
  // 2. Wrap NextUIProvider at the root of your app
  return (
    <NextUIProvider>
      <AppRouter/>
    </NextUIProvider>
  );
}

export default App
