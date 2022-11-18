import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Room, { loader as roomLoader } from "./routes/room";
import { store } from "./app/store";
import { Provider } from "react-redux";
import "./index.css";
import "~/firebase";
import Home from "./routes/home";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/rooms/:roomCode",
        element: <Room />,
        loader: roomLoader,
      },
      {
        path: "*",
        element: <Navigate to={"/"} replace />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
