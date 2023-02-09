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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
