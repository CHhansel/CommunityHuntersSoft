
import './App.css'

// 1. import `NextUIProvider` component
import {NextUIProvider} from "@nextui-org/react";

function App() {
  // 2. Wrap NextUIProvider at the root of your app
  return (
    <NextUIProvider>
      <p>Hola</p>
    </NextUIProvider>
  );
}

export default App