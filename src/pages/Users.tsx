/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { getUsers, deleteUser, updateUser, createUser } from "../services";
import type { IPagination, User } from "../modules";
import { InputNumber } from "primereact/inputnumber";
import  { Toast } from "primereact/toast";

const roleOptions = [
  { label: "Admin", value: "ADMIN" },
  { label: "User", value: "USER" },
  { label: "DESIGNER", value: "DESIGNER" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const defaultUsers: User[] = [
  {
    id: 1,
    username: "Alice Smith",
    email: "alice@example.com",
    role: "ADMIN",
    status: "ACTIVE",
    created: "2024-01-01",
  },
  {
    id: 2,
    username: "Bob Johnson",
    email: "bob@example.com",
    role: "USER",
    status: "ACTIVE",
    created: "2024-01-02",
  },
  {
    id: 3,
    username: "Charlie Brown",
    email: "charlie@example.com",
    role: "DESIGNER",
    status: "INACTIVE",
    created: "2024-01-03",
  },
];

const Users: React.FC = () => {
  const [rows, setRows] = useState<User[]>(defaultUsers);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
const basePage = 1;
  const [pagination, setPagination] = useState<IPagination>();
  const [pageNo, setPageNo] = useState<number>(pagination?.page || 0);
  const [currentPage, setCurrentPage] = useState<number>(pagination?.page || 1);
  const [totalPages, setTotalPages] = useState<number>(
    pagination?.totalPages || 1
  );
   const toast = useRef<Toast>(null);
    const [totalRecords, setTotalRecords] = useState(0);
  // ---- helpers
  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "danger";
      default:
        return undefined;
    }
  };

  const getRoleSeverity = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "danger";
      case "TemplateCreator":
        return "warning";
      case "USER":
        return "info";
        case "DESIGNER":
        return "success";
      default:
        return undefined;
    }
  };

  const statusBodyTemplate = (rowData: User) => (
    <Tag value={rowData.status} className = "edit-btn" severity={getStatusSeverity(rowData.status)} />
  );

  const roleBodyTemplate = (rowData: User) => (
    <Tag value={rowData.role} severity={getRoleSeverity(rowData.role)} />
  );

  const actionBodyTemplate = (rowData: User) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-text p-button-sm edit-btn mr-2"
        onClick={() => openEditDialog(rowData)}
        aria-label={`Edit user ${rowData.username}`}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-sm p-button-danger"
        onClick={() => handleDelete(rowData)}
        aria-label={`Delete user ${rowData.username}`}
      />
    </div>
  );

const openCreateDialog = () => {
      setIsCreating(true);
  setSelected({
      username: "username",
      email: "write the email",
      password: "tes1",
      role: "USER",
      status: "ACTIVE",
        id: "",
        created: "",

    });

  setEditDialog(true);
    
};


  const openEditDialog = (u: User) => {
    console.log("Opening edit dialog for user:", u);
    setIsCreating(false);
    setSelected({ ...u });
    setEditDialog(true);
  };



  const handleDelete = async (u: User) => {
    if (window.confirm(`Are you sure you want to delete user "${u.username}"?`)) {
      try {
        const deletedUser = await deleteUser(u.id.toString());
        console.log("Deleted user...", deletedUser);
        setRows((prev) => prev.filter((x) => x.id !== u.id));
      } catch (error) {
        console.error("Error deleting user:", error);
        // Handle error - show toast or error message
      }
    }
  };

  const handleSave = async () => {
    console.log("Saving user...", selected);
    if (!selected) return;
    if (selected) {
   try {
      if (isCreating) {
        // Creating new user
        const response = await createUser(selected);
        const newUser: User = {
          id: response.id,
          username: selected.username,
          email: selected.email,
          role: selected.role,
          status: selected.status,
          created: new Date().toISOString().slice(0, 10),
        };
        setRows([...rows, newUser]);
        toast.current?.show({
          severity: "success",
          summary: "Successful",
          detail: `User "${selected.username}" created successfully`,
          life: 3000,
        });
      } else {
        // Updating existing user
        const response = await updateUser(selected);
      
        setRows(rows.map((u) => (u.id === selected.id ? { ...response } as User : u)));
           // Show success toast
        toast.current?.show({
          severity: "success",
          summary: "Successful",
          detail: `User "${selected.username}" updated successfully`,
          life: 3000,
        });
      }
      hideDialog();
    } catch (error) {
      console.error("Failed to save user:", error);
      alert("Failed to save user. Please try again.");
      toast.current?.show({
          severity: "error",
          summary: "error",
          detail: `User "${selected.username}" Failed to save user. Please try again.`,
          life: 3000,
        });
    }}
    hideDialog();
  };


const hideDialog = () => {
    setEditDialog(false);
    setSelected(null);
    setIsCreating(false);
  };

 useEffect(() => {
    // Fetch templates from API (expects an array of Template)

    getUsers(basePage)
      .then((res: any) => {
        // Accept either res.data or res
        console.log("Fetched templates:", res.pagination);
        const data = Array.isArray(res) ? res : res?.data;
        if (Array.isArray(data) && data.length) {
          console.log("Fetched templates:", res.data || res);
          setRows(data);
          setTotalRecords(res.pagination.total_items || data.length);
          setPagination(res.pagination);
          setCurrentPage(res.pagination.page);
          setTotalPages(res.pagination.totalPages);
        } else {
          // Use sample data if API returns empty or invalid data
          setRows(defaultUsers);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Error fetching templates:", err);
        // Use sample templates on error as a graceful fallback
         setRows(defaultUsers);
        setLoading(false);
      });
  }, []); 
   const onPageInputChange = (event: any) => {
     const current = event.value;
     setPageNo(current);
   };
   const onPageChange = (text: string) => {
     let currentPage = 1;
     console.log("onPageChange called with:", text);
     console.log("Current pagination state:", pagination!.page);
     switch (text) {
       case "next":
         currentPage = pagination!.page + 1;
         break;
       case "prev":
         currentPage = pagination!.page - 1;
         break;
       case "first":
         currentPage = 1;
         break;
       case "last":
         currentPage = pagination!.totalPages;
 
         break;
 
       default:
         currentPage = parseInt(text, 10);
         break;
       // Default case
     }
     getUsers(currentPage).then((newTemplates) => {
       setRows(newTemplates);
       setPagination(newTemplates!.pagination);
      // setFirst(currentPage);
       setCurrentPage(currentPage);
       setTotalPages(newTemplates!.pagination.totalPages);
     });
   };
   const paginatorTemplate = {
     layout:
       " FirstPageLink PrevPageLink CurrentPageReport  NextPageLink LastPageLink JumpToPageInput",
     FirstPageLink: () => {
       return (
         <button
           type="button"
           // className={currentPage > 1 ? "" : options.className}
           onClick={() => onPageChange("first")}
           disabled={currentPage <= 1}
         >
           <span className="p-3">First</span>
         </button>
       );
     },
     PrevPageLink: (options: any) => {
       return (
         <button
           type="button"
           className={currentPage > 1 ? "" : options.className}
           onClick={() => onPageChange("prev")}
           disabled={currentPage > 1 ? false : true}
         >
           <span className="p-3"> Previous</span>
         </button>
       );
     },
     CurrentPageReport: () => {
       return (
         <span
           className="mx-3"
           style={{ color: "var(--text-color)", userSelect: "none" }}
         >
           ({currentPage} / {totalPages})
         </span>
       );
     },
     JumpToPageInput: () => {
       return (
         <div>
           <span className="mx-3" style={{ color: "black", userSelect: "none" }}>
             Go to page
             <InputNumber
               className="ml-1"
               min={1}
               max={totalPages}
               value={currentPage}
               onValueChange={onPageInputChange}
               disabled={totalPages === 0 || currentPage === totalPages}
             />
           </span>
           <Button
             id="search-button"
             severity="danger"
             className="ml-2 add-btn"
             onClick={() => onPageChange(pageNo.toString())}
             label="Go"
             disabled={totalPages === 0 || currentPage === totalPages}
           />
         </div>
       );
     },
     NextPageLink: () => {
       return (
         <button
           type="button"
           /*   className={
             currentPage < totalPages
               ? options.className
               : ""
           } */
           onClick={() => onPageChange("next")}
           disabled={currentPage < totalPages ? false : true}
         >
           <span className="p-3">Next</span>
         </button>
       );
     },
     LastPageLink: () => {
       return (
         <button
           type="button"
           /* className={
             currentPage < totalPages
               ? options.className
               : ""
           } */
           onClick={() => onPageChange("last")}
           disabled={currentPage < totalPages ? false : true}
         >
           <span className="p-3">Last</span>
         </button>
       );
     },
   };

  return (
     <>
     <Toast ref={toast} />
     <div className="p-6 min-h-screen">
          <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Users List</h2>

                  <Button
                      label="Create User"
                      icon="pi pi-user-plus"
                      className="add-btn"
                      onClick={openCreateDialog} />
              </div>

              <DataTable
                  value={rows}
                  dataKey="id"
                  loading={loading}
                  rowHover
                  stripedRows
                  responsiveLayout="scroll"
                  totalRecords={totalRecords}
                  paginator
                  rows={10}
                  emptyMessage={loading ? "Loading…" : "No users found"}
                  className="p-datatable-hoverable"
                  paginatorTemplate={paginatorTemplate}
              >
                  <Column field="id" header="ID" sortable />
                  <Column field="username" header="Username" sortable filter filterPlaceholder="Search by username" />
                  <Column field="email" header="Email" sortable filter filterPlaceholder="Search by email" />
                  <Column field="role" header="Role" body={roleBodyTemplate} sortable />
                  <Column field="status" header="Status" body={statusBodyTemplate} sortable />
                  <Column field="created" header="Created" sortable filter filterPlaceholder="Search by date" />
                  <Column header="Actions" body={actionBodyTemplate} />
              </DataTable>
          </div>
          <Dialog
              header={selected && selected.id ? "Edit User" : "Create Admin"}
              visible={editDialog}
              style={{ width: "600px" }}
              modal
              onHide={hideDialog}
              className="rounded-xl"
          >
              {selected && (
                  <div className="flex flex-col gap-4">
                      {selected.id && (
                          <div className="flex flex-col gap-1">
                              <label>ID</label>
                              <InputText value={String(selected.id)} readOnly disabled className="p-disabled" />
                          </div>
                      )}

                      <div className="flex flex-col gap-1">
                          <label htmlFor="username">Username</label>
                          <InputText
                              id="username"
                              value={selected?.username || ""} // ✅ Use selected.username directly
                              onChange={(e) => setSelected({ ...selected, username: e.target.value })}
                              required />
                      </div>

                      <div className="flex flex-col gap-1">
                          <label>Email</label>
                          <InputText
                              id="email"
                              value={selected?.email || ""} // ✅ Use selected.email directly
                              onChange={(e) => setSelected({ ...selected, email: e.target.value })}
                              readOnly={!!selected.id} // read-only if editing
                              disabled={!!selected.id}
                              className={selected.id ? "p-disabled" : ""}
                              required />
                      </div>

                      {/* Show password only when creating new user */}
                      {!selected.id && (
                          <div className="flex flex-col gap-1">
                              <label htmlFor="password">Password</label>
                              <InputText
                                  id="password"
                                  type="password"
                                  value={selected?.password || ""} // ✅ Use selected.password directly
                                  onChange={(e) => setSelected({ ...selected, password: e.target.value })}
                                  required />
                          </div>
                      )}

                      <div className="flex flex-col gap-1">
                          <label htmlFor="role">Role</label>
                          <Dropdown
                              id="role"
                              value={selected.role}
                              options={roleOptions}
                              onChange={(e) => setSelected({ ...selected, role: e.value })}
                              placeholder="Role" />
                      </div>

                      <div className="flex flex-col gap-1">
                          <label htmlFor="status">Status</label>
                          <Dropdown
                              id="status"
                              value={selected.status}
                              options={statusOptions}
                              onChange={(e) => setSelected({ ...selected, status: e.value })}
                              placeholder="Select a Status" />
                      </div>

                      {selected.created && (
                          <div className="flex flex-col gap-1">
                              <label>Created Date</label>
                              <InputText value={selected.created} readOnly disabled className="p-disabled" />
                          </div>
                      )}

                      <div className="flex justify-end gap-2 mt-4">
                          <Button label="Cancel" icon="pi pi-times" className="p-button-sm p-button-text" onClick={hideDialog} />
                          <Button label="Save" icon="pi pi-check" className="p-button-sm p-button-success" onClick={handleSave} />
                      </div>
                  </div>
              )}
          </Dialog>
      </div></>
  );
};

export default Users;
