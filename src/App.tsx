// Importing: Router.
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importing: Antd.
import { ConfigProvider } from "antd";

// Importing: Components.
import HomePage from "./components/Homepage/Homepage";
import UsersList from "./components/Users/UsersList";

import "./app.css";
import UserDetail from "./components/Users/EditUser";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/usersList",
      element: <UsersList />,
    },
  ]);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#00b96b" } }}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </ConfigProvider>
  );
}

export default App;
