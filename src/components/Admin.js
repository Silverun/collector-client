import { useState, useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
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
    console.log("Users", response.data);
    setUsers(response.data);
  }, [axiosPrivate]);

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUserHandler = async () => {
    const usersIds = selected.map((user) => user.id);
    try {
      await axiosPrivate.post("/admin/delete", usersIds);
      await getUsers();
    } catch (error) {
      console.error(error);
    }
  };
  const promoteUserHandler = useCallback(async () => {
    const usersIds = selected.map((user) => user.id);
    try {
      await axiosPrivate.post("/admin/promote", usersIds);
      await getUsers();
    } catch (error) {
      console.error(error);
    }
  }, [selected, getUsers, axiosPrivate]);

  const demoteUserHandler = useCallback(async () => {
    const usersIds = selected.map((user) => user.id);
    try {
      await axiosPrivate.post("/admin/demote", usersIds);
      await getUsers();
    } catch (error) {
      console.error(error);
    }
  }, [selected, getUsers, axiosPrivate]);

  const leftToolbarTemplate = () => {
    return (
      <div className="d-flex flex-wrap gap-2">
        <Button
          label="Block"
          icon="pi pi-ban"
          severity="success"
          onClick={() => {}}
          disabled={!selected || !selected.length}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={deleteUserHandler}
          disabled={!selected || !selected.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="d-flex flex-wrap gap-2">
        <Button
          label="Promote"
          icon="pi pi-arrow-up"
          className="p-button-help"
          onClick={promoteUserHandler}
          disabled={!selected || !selected.length}
        />
        <Button
          label="Demote"
          icon="pi pi-arrow-down"
          className="p-button-help"
          onClick={demoteUserHandler}
          disabled={!selected || !selected.length}
        />
      </div>
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
