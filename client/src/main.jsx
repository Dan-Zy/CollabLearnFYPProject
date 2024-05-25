import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { MainPage } from "./frontend/Home";
import { SignIn } from "./frontend/component/SignIn";
import { SignUp } from "./frontend/component/SignUp"; // Add this import


// Hassan first changing
const router = createBrowserRouter([
  {
    path: "/Home",
    element: <MainPage />,
  },
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/SignUp",
    element: <SignUp />,
  },
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
