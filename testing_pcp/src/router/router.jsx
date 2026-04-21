import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/mainlayout";
import Activities from "../pages/Activities";
import ActivityDetail from "../pages/ActivityDetail";
import Filters from "../pages/Filters";
import Stats from "../pages/Stats";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/activities",
        element: <Activities />,
      },
      {
        path: "/activities/:id",
        element: <ActivityDetail />,
      },
      {
        path: "/filters",
        element: <Filters />,
      },
      {
        path: "/stats",
        element: <Stats />,
      },
    ],
  },
]);

export default router;
