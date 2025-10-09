import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store.ts";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </Provider>
);
