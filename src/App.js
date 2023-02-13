import Layout from "./components/Layout";
import Register from "./components/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Collections from "./components/Collections";
import Login from "./components/Login";
import Missing from "./components/Missing";
import RequireAuth from "./components/RequireAuth";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Public routes (not logged in) */}
      <Route index element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* Protected routes */}
      <Route element={<RequireAuth />}>
        {/* Editor only routes */}
        <Route path="/user/1" element={<Collections />} />
        {/* Admin only routes */}
        <Route path="/admin" element={<Admin />} />
      </Route>
      {/* no matches path */}
      <Route path="*" element={<Missing />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
