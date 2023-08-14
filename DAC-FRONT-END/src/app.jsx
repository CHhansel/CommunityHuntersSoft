import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/appRouter";
import { store } from "./store/store";

const App = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <Provider store={store}>
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
      </Provider>      
    </div>
  );
};

export default App;
