import "./App.css";

// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { AppRouter } from "./routes/AppRouter";
import { store } from './store/store'


function App() {
  // 2. Wrap NextUIProvider at the root of your app
  return (
    <Provider store={store}>
    <NextUIProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </NextUIProvider>


    </Provider>
  );
}

export default App;
