import { useState, useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch } from "primereact/inputswitch";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";

const Admin = () => {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState();
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getUsers = useCallback(async () => {
    const response = await axiosPrivate.get("admin/users");
    console.log(response.data);
    setUsers(response.data);
  }, [axiosPrivate]);

  useEffect(() => {
    getUsers();
  }, []);

  const leftToolbarTemplate = () => {
    return (
      <div className="d-flex flex-wrap gap-2">
        <Button
          label="Block"
          icon="pi pi-ban"
          severity="success"
          onClick={() => {}}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => {}}
          disabled={!selected || !selected.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Promote"
        icon="pi pi-arrow-up"
        className="p-button-help"
        onClick={() => {}}
      />
    );
  };

  return (
    <div className="container">
      <h4 className="mb-3">Admin dashboard</h4>
      <Toolbar
        className="mb-4"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      ></Toolbar>
      <DataTable
        value={users}
        selectionMode="checkbox"
        selection={selected}
        onSelectionChange={(e) => {
          console.log(e.value);
          setSelected(e.value);
        }}
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column field="userName" header="Name"></Column>
        <Column field="userEmail" header="Email"></Column>
        <Column
          field="userRole"
          header="Role"
          body={(rowData) => (rowData.userRole === 1 ? "Editor" : "Admin")}
        ></Column>
        <Column field="status" header="Status"></Column>
      </DataTable>
    </div>
  );
};

export default Admin;
