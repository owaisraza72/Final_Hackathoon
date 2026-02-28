import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import router from "@/router";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
        toastOptions={{
          style: {
            fontSize: "14px",
          },
        }}
      />
    </>
  );
};

export default App;