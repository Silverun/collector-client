import Layout from "./components/Layout";
import Register from "./components/Register";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Collections from "./components/Collections";
import Login from "./components/Login";
import Missing from "./components/Missing";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/Unauthorized";
import PersistLogin from "./components/PersistLogin";
import NewCollection from "./components/NewCollection";
import useAuth from "./hooks/useAuth";
import EditCollection from "./components/EditCollection";
import SoloCollection from "./components/SoloCollection";
import NewItem from "./components/NewItem";
import SoloItem from "./components/SoloItem";

function App() {
  const { auth } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes (not logged in) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PersistLogin />}>
          <Route index element={<Home />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/collection/:col_id" element={<SoloCollection />} />

          {/* Editor + Admin routes */}
          <Route element={<RequireAuth allowedRoles={[1, 2]} />}>
            <Route path="/user/:id" element={<Collections />} />
            <Route path="/user/:id/newcollection" element={<NewCollection />} />
            <Route
              path="/user/:id/collection/:col_id/edit"
              element={<EditCollection />}
            />
            <Route path="/collection/:col_id/newitem" element={<NewItem />} />
            <Route path="/item/:item_id" element={<SoloItem />} />
          </Route>

          {/* Admin only routes */}
          <Route element={<RequireAuth allowedRoles={[2]} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* no matches path */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
