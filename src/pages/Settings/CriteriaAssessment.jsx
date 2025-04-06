import React, { useState, useEffect, useRef, useContext } from "react";
import { UserAuthContext } from "../../context/UserAuthContext";
import { CriteriaAssessmentService } from "../../service/criteriaAssessmentService";
import { ContentLayout, CardLayout } from "../../shared/components/layouts";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";

const CriteriaAssessment = () => {
  const [search, setSearch] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [totalRecords, setTotalrecord] = useState(0);
  const toast = useRef(null);
  const navigate = useNavigate();
  const { config, toggleToken, logout } = useContext(UserAuthContext);

  const fetchData = async () => {
    setLoading(true);
    await CriteriaAssessmentService.FindAssesments(
      search,
      page,
      limit,
      config.current
    )
      .then((res) => {
        setAssessments(res.data);
        setTotalrecord(res.totalRecords);
        setLoading(false);
      })
      .catch((err) => {
        if (!err.valid_token) {
          toast.current.show({
            severity: "warn",
            summary: err.err_type,
            detail: err.message,
          });
        }
        setTimeout(() => {
          logout();
        }, 1000);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (config.current) toggleToken();
  }, []);

  useEffect(() => {
    fetchData();
  }, [search]);

  const onPageChange = (event) => {
    setPage(event.first);
    setLimit(event.rows);
  };

  const deleteAssessment = (rowData) => {
    const accept = async () => {
      await CriteriaAssessmentService.DeleteAssesment(
        rowData._id,
        config.current
      )
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          }
          setAssessments([
            assessments.filter((ass) => ass._id !== rowData._id),
          ]);
        })
        .catch((err) => {
          if (!err.valid_token) {
            toast.current.show({
              severity: "warn",
              summary: err.err_type,
              detail: err.message,
            });
          }
          setTimeout(() => {
            logout();
          }, 1000);
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
  //Mini Components
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

  const template = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 },
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

  const actionBodyTemplate = (rowdata) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          label="edit"
          outlined
          severity="warning"
          className="mr-2"
          size="small"
          onClick={() =>
            navigate(
              `/settings/multi-criteria-assessments/details/${rowdata._id}`
            )
          }
        />
        <Button
          icon="pi pi-trash"
          label="delete"
          outlined
          severity="danger"
          className="mr-2"
          size="small"
          onClick={() => deleteAssessment(rowdata)}
        />
      </>
    );
  };

  const actionToolbar = () => {
    return (
      <>
        <Button
          label="New"
          icon="pi pi-plus"
          size="small"
          onClick={() =>
            navigate("/settings/multi-criteria-assessments/details")
          }
          severity="success"
          style={{ width: "100px", marginRight: "10px" }}
        />
      </>
    );
  };

  return (
    <ContentLayout contentTitle="Multi Criteria Assessment Settings">
      <CardLayout header_style="card-primary" title="Assessment List">
        <Toolbar left={searchToolbar} right={actionToolbar} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <Divider />
        <DataTable value={assessments} lazy>
          <Column field="temperature" header="Temperature" />
          <Column field="humidity" header="Humidity" />
          <Column field="ammonia" header="Ammonia" />
          <Column field="assessment" header="Assessment" />
          <Column field="recommendations" header="Recommendations" />
          <Column body={actionBodyTemplate} />
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

export default CriteriaAssessment;
