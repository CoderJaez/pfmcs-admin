import React, {
  userState,
  useEffect,
  useRef,
  useContext,
  useState,
} from "react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { UserAuthContext } from "../../context/UserAuthContext";
import { UserService } from "../../service/userService";
import { Paginator } from "primereact/paginator";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import {
  CardLayout,
  ContentLayout,
  FormLayout,
} from "../../shared/components/layouts";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";

const User = () => {
  const toast = useRef(null);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState([]);
  const { config, userRef, logout, toggleToken } = useContext(UserAuthContext);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [totalRecords, setTotalrecords] = useState(0);
  const navigate = useNavigate();

  useEffect(() => toggleToken(), []);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await UserService.FindUsers(search, page, limit, config.current)
        .then((res) => {
          const data = res.data;
          setUsers(data.filter((d) => d.email !== userRef.current.email));
          setTotalrecords(res.totalRecords);
          setLoading(false);
        })
        .catch((err) => {
          if (!err.valid_token) {
            toast.current.show({
              severity: "warn",
              summary: "Unauthorized",
              detail: err.message,
            });
            setLoading(false);
            setTimeout(() => {
              logout();
            }, 500);
          }
        });
    };
    fetchData();
  }, [search]);

  const deleteData = (rowData) => {
    const accept = async () => {
      await UserService.DeleteUser(rowData._id, config.current)
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          }
        })
        .catch((err) => {
          if (!err.valid_token) {
            if (!err.valid_token) {
              toast.current.show({
                severity: "warn",
                summary: "Unauthorized",
                detail: err.message,
              });
              setLoading(false);
              setTimeout(() => {
                logout();
              }, 500);
            }
          }
        });
    };
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept,
    });
  };

  const resetPassword = (rowData) => {
    const accept = async () => {
      await UserService.SetDefaultPass(rowData._id, config.current)
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          }
        })
        .catch((err) => {
          if (!err.valid_token) {
            toast.current.show({
              severity: "warn",
              summary: "Unauthorized",
              detail: err.message,
            });
            setLoading(false);
            setTimeout(() => {
              logout();
            }, 500);
          } else {
            toast.current.show({
              severity: "warn",
              summary: "Error",
              detail: err.message,
            });
          }
        });
    };
    confirmDialog({
      message: "Do you want to reset password this record?",
      header: "Reset Password Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept,
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          label="Reset Password"
          icon="pi pi-refresh"
          outlined
          severity="primary"
          className="mr-2"
          onClick={() => resetPassword(rowData)}
          size="small"
        />
        <Button
          label="Edit"
          icon="pi pi-pencil"
          outlined
          severity="warning"
          className="mr-2"
          onClick={() => navigate(`/settings/users/${rowData._id}`)}
          size="small"
        />
        <Button
          icon="pi pi-trash"
          label="Delete"
          outlined
          severity="danger"
          className="mr-2"
          onClick={() => deleteData(rowData)}
          size="small"
        />
      </>
    );
  };
  const searchToolbar = () => {
    return (
      <>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </span>
      </>
    );
  };

  const addNewToolbar = () => {
    return (
      <>
        <Button
          label="New"
          severity="success"
          size="small"
          icon="pi pi-plus"
          onClick={() => navigate("/settings/users/new")}
        />
      </>
    );
  };

  const fullname = (rowData) => {
    return `${rowData.firstname} ${rowData.lastname}`;
  };

  const template = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: 120, value: 120 },
      ];

      return (
        <React.Fragment>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Items per page:{" "}
          </span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
          />
        </React.Fragment>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    },
  };

  const onPageChange = (event) => {
    setPage(event.first);
    setLimit(event.rows);
  };

  return (
    <ContentLayout contentTitle="User Accounts">
      <Toast ref={toast} />
      <ConfirmDialog />
      <CardLayout title="Account list">
        <Toolbar left={searchToolbar} right={addNewToolbar} />
        <Divider />
        <DataTable
          value={users}
          lazy
          loading={loading}
          selectionMode="single"
          scrollHeight="600px"
          rows={limit}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        >
          <Column body={fullname} header="Fullname" />
          <Column field="email" header="Email" />
          <Column field="roles" header="Role" />
          <Column body={actionBodyTemplate} style={{ width: "30rem" }} />
        </DataTable>
        <Paginator
          template={template}
          first={page}
          rows={limit}
          totalRecords={totalRecords}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
          onPageChange={onPageChange}
          className="justify-content-end"
        />
      </CardLayout>
    </ContentLayout>
  );
};

export default User;
