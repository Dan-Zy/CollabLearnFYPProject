import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { MainPage } from "./frontend/Home";
import { SignIn } from "./frontend/component/SignIn";
import { SignUp } from "./frontend/component/SignUp"; // Add this import
import Role from "./frontend/component/Profiling/Role";
import BasicQuestionFaculty from "./frontend/component/Profiling/BasicQuestionFaculty";
import BasicQuestionStudent from "./frontend/component/Profiling/BasicQuestionStudent";
import BasicQuestionIndustrial from "./frontend/component/Profiling/BasicQuestionIndustrial";
import SetPhotos from "./frontend/component/Profiling/SetPhotos";
import Welcome from "./frontend/component/Profiling/Welcome";
import UserInfo from "./frontend/component/UserInfo";
import { VerificationPage } from "./frontend/component/VerificationPage";
import CommunityViewHome from "./frontend/component/community/CommunityView/CommunityViewHome";
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
    element: <Role />,
  },
  {
    path: "/BasicQuestionFaculty",
    element: <BasicQuestionFaculty />,
  },
  {
    path: "/BasicQuestionStudent",
    element: <BasicQuestionStudent />,
  },
  {
    path: "/BasicQuestionIndustrial",
    element: <BasicQuestionIndustrial />,
  },
  {
    path: "/SetProfileImage",
    element: <SetPhotos />,
  },

  {
    path: "/verify-email",
    element: <VerificationPage />,
  },

  {
    path: "/Welcome",
    element: <Welcome />,
  },
  {
    path: "/UserInfo",
    element: <UserInfo />,
  },
  {
    path: "/CommunityViewHome",
    element: <CommunityViewHome />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
