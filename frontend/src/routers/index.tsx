import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../pages/RootLayout";
import ErrorPage from "../pages/ErrorPage";
import { v4 as uuidv4 } from "uuid";
import TextEditor from "../components/TextEditor";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={`editor/${uuidv4()}`} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/editor/:id",
    element: <TextEditor />,
    errorElement: <ErrorPage />,
  },
]);
