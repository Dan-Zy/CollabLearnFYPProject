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
import Role from "./frontend/component/Profiling/Role";
import BasicQuestionFaculty from "./frontend/component/Profiling/BasicQuestionFaculty";
import BasicQuestionStudent from "./frontend/component/Profiling/BasicQuestionStudent";
import BasicQuestionIndustrial from "./frontend/component/Profiling/BasicQuestionIndustrial";
import SetPhotos from "./frontend/component/Profiling/SetPhotos";
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
  {
    path: "/Role",
    element: <Role/>
  },
  {
    path: "/BasicQuestionFaculty",
    element: <BasicQuestionFaculty/>
  },
  {
    path: "/BasicQuestionStudent",
    element: <BasicQuestionStudent/>
  },
  {
    path: "/BasicQuestionIndustrial",
    element: <BasicQuestionIndustrial/>
  },
  {
    path: "/SetProfileImage",
    element: <SetPhotos/>
  }

  
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
