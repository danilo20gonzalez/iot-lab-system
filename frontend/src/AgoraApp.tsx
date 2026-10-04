import { RouterProvider } from "react-router-dom";
import { router } from "./router/app.routes";
import { AppProvider } from "./context/AppContext";

export const AgoraApp = () => {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
};
