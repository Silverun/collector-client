import { useState, useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { useTranslation } from "react-i18next";

const Admin = () => {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState();
  const [selected, setSelected] = useState(null);
  const { t } = useTranslation("admin");

  const getUsers = useCallback(async () => {
    const response = await axiosPrivate.get("admin/users");
    setUsers(response.data);
  }, [axiosPrivate]);

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUserHandler = useCallback(async () => {
    const usersIds = selected.map((user) => user.id);
    try {
      await axiosPrivate.post("/admin/delete", usersIds);
      await getUsers();
    } catch (error) {
      console.error(error);
    }
  }, [axiosPrivate, getUsers, selected]);

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

  const blockUserHandler = useCallback(async () => {
    const usersIds = selected.map((user) => user.id);
    try {
      await axiosPrivate.post("/admin/block", usersIds);
      await getUsers();
    } catch (error) {
      console.error(error);
    }
  }, [selected, getUsers, axiosPrivate]);

  const unblockUserHandler = useCallback(async () => {
    const usersIds = selected.map((user) => user.id);
    try {
      await axiosPrivate.post("/admin/unblock", usersIds);
      await getUsers();
    } catch (error) {
      console.error(error);
    }
  }, [selected, getUsers, axiosPrivate]);

  const leftToolbarTemplate = () => {
    return (
      <div className="d-flex flex-wrap gap-2">
        <Button
          label={t("block")}
          icon="pi pi-ban"
          severity="warning"
          onClick={blockUserHandler}
          disabled={!selected || !selected.length}
        />
        <Button
          label={t("unblock")}
          icon="pi pi-lock-open"
          severity="success"
          onClick={unblockUserHandler}
          disabled={!selected || !selected.length}
        />
        <Button
          label={t("delete")}
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
          label={t("promote")}
          icon="pi pi-arrow-up"
          className="p-button-help"
          onClick={promoteUserHandler}
          disabled={!selected || !selected.length}
        />
        <Button
          label={t("demote")}
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
      <h4 className="mb-3">{t("dash")}</h4>
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
        <Column field="userName" header={t("name")}></Column>
        <Column field="userEmail" header={t("email")}></Column>
        <Column
          field="userRole"
          header={t("role")}
          body={(rowData) => (rowData.userRole === 1 ? "User" : "Admin")}
        ></Column>
        <Column field="userStatus" header={t("status")}></Column>
      </DataTable>
    </div>
  );
};

export default Admin;
