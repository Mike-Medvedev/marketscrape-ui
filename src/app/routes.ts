import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/dashboard";
import { NewSearch } from "./pages/new-search";
import { FacebookAuth } from "./pages/facebook-auth";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/new",
    Component: NewSearch,
  },
  {
    path: "/edit/:id",
    Component: NewSearch,
  },
  {
    path: "/auth/facebook",
    Component: FacebookAuth,
  },
]);