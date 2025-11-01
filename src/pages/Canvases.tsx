/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef,useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { createCanvas, deleteCanvas, editCanvas, getCanvases } from '../services';
import type { IPagination } from '../modules';
import { InputNumber } from 'primereact/inputnumber';
import type { Toast } from 'primereact/toast';

type Canvas = {
    id: number;
    name: string;
    user: string;
    createdAt: string;
    data: object;
};

const users = ['John Doe', 'Jane Smith', 'Alice Johnson'];

const initialCanvases: Canvas[] = [
    { id: 1, name: 'Canvas One', user: 'John Doe', createdAt: '2024-06-01', data: {} },
    { id: 2, name: 'Canvas Two', user: 'Jane Smith', createdAt: '2024-06-02', data: {} },
    { id: 3, name: 'Canvas Three', user: 'Alice Johnson', createdAt: '2024-06-03', data: {} },
];

const sampleCanvases: Canvas[] = [
    { id: 1, name: 'Canvas One', user: 'John Doe', createdAt: '2024-06-01', data: {} },
    { id: 2, name: 'Canvas Two', user: 'Jane Smith', createdAt: '2024-06-02', data: {} },
    { id: 3, name: 'Canvas Three', user: 'Alice Johnson', createdAt: '2024-06-03' , data: {}},
];

const Canvases: React.FC = () => {
   const [canvases, setCanvases] = useState<Canvas[]>(initialCanvases);
     const toast = useRef<Toast>(null);

    const [selectedCanvas, setSelectedCanvas] = useState<Canvas | null>(null);
    const [editDialog, setEditDialog] = useState(false);
    const [addDialog, setAddDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const user = localStorage.getItem("user");
    const userRole = user ? JSON.parse(user).role : null;
    const [globalFilter, setGlobalFilter] = useState('');
    const dt = useRef<DataTable<Canvas[]>>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pagination, setPagination] = useState<IPagination>();
    const [first, setFirst] = useState(0);
    const [pageNo, setPageNo] = useState<number>(pagination?.page || 0);
    const [currentPage, setCurrentPage] = useState<number>(pagination?.page || 1);
    const [totalPages, setTotalPages] = useState<number>(pagination?.totalPages || 1);
    const [dataJsonText, setDataJsonText] = useState<string>('{}');  // Add state for JSON text editor
    const [dataJsonError, setDataJsonError] = useState<string | null>(null); // For JSON validation errors
    const [deleteCanvasDialog, setDeleteCanvasDialog] = useState(false);
  const [canvasToDelete, setCanvasToDelete] = useState<Canvas | null>(null);
const basePage = 1;
    const openEditDialog = (canvas: Canvas) => {
        setSelectedCanvas({ ...canvas });
        setDataJsonText(JSON.stringify(canvas.data || {}, null, 2)); // Load JSON string to textarea
        setDataJsonError(null);
        setEditDialog(true);
        setAddDialog(false);
    };

/*     const openAddDialog = () => {
        const newCanvas: Canvas = {
            id: 0,
            name: '',
            user: '',
            createdAt: new Date().toISOString().slice(0, 10),
            data: {}
        };
        setSelectedCanvas(newCanvas);
        setDataJsonText('{}');  // Initialize JSON editor empty
        setDataJsonError(null);
        setAddDialog(true);
        setEditDialog(false);
    };
const handleDelete = async(canvas: Canvas) => {
        if (window.confirm(`Are you sure you want to delete "${canvas.name}"?`)) {
           
             const canvastoDdelete = await deleteCanvas((canvas.id).toString());


            console.log("deleted canvas...",canvastoDdelete);
              setCanvases(canvases.filter(c => c.id !== canvas.id));
        }
    }; */
    const hideDialog = () => {
        setEditDialog(false);
        setAddDialog(false);
        setSelectedCanvas(null);
        setDataJsonError(null);
        setDataJsonText('{}');
    };
const confirmDeleteCanvas = (canvas: Canvas) => {
    setCanvasToDelete(canvas);
    setDeleteCanvasDialog(true);
  };
    // Validate and update JSON text field on change
    const onDataJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setDataJsonText(val);
        try {
            JSON.parse(val);
            setDataJsonError(null);
        } catch {
            setDataJsonError("Invalid JSON format");
        }
    };

    const saveCanvas = async () => {
        if (!selectedCanvas) return;

        // Validate JSON before save
        if (dataJsonError) {
            alert("Please fix JSON errors before saving.");
            return;
        }

        // Parse JSON text to object
        let parsedData = {};
        try {
            parsedData = JSON.parse(dataJsonText);
        } catch {
            alert("Invalid JSON data.");
            return;
        }

        // Prepare canvas with parsed data
        const canvasToSave = { ...selectedCanvas, data: parsedData };

        if (editDialog) {
            try {
                const response = await editCanvas(canvasToSave);
                const updatedCanvasFromServer = response.data;
                setCanvases(canvases.map(c =>
                    c.id === updatedCanvasFromServer.id ? updatedCanvasFromServer : c
                ));
            } catch (error) {
                console.error("Failed to save canvas:", error);
            }
        } else if (addDialog) {
            try {
                const response = await createCanvas(canvasToSave);
                const newCanvasFromServer = response.data;
                setCanvases([...canvases, newCanvasFromServer]);
            } catch (error) {
                console.error("Failed to add canvas:", error);
            }
        }
        hideDialog();
    };

    const resetFilters = () => {
        setGlobalFilter('');
        dt.current?.reset();
    };
    const deleteSingleCanvas = async () => {
    if (!canvasToDelete) return;

    try {
      await deleteCanvas(canvasToDelete.id.toString());
      setCanvases(prev => prev.filter(c => c.id !== canvasToDelete.id));
      setDeleteCanvasDialog(false);
      setCanvasToDelete(null);

      toast.current?.show({
        severity: 'success',
        summary: 'Successful',
        detail: `Canvas "${canvasToDelete.name}" deleted successfully`,
        life: 3000,
      });
    } catch (error) {
      console.error('Error deleting canvas:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete canvas',
        life: 3000,
      });
      setDeleteCanvasDialog(false);
      setCanvasToDelete(null);
    }
  };
    const actionBodyTemplate = (rowData: Canvas) => (
        <div className="flex gap-2">
            <Button 
                icon="pi pi-pencil" 
                className="p-button-rounded p-button-info p-button-edit p-button-sm "
                onClick={() => openEditDialog(rowData)} 
            />
            <Button 
                icon="pi pi-trash" 
                className="p-button-rounded p-button-danger p-button-delete  p-button-sm"
                onClick={() => confirmDeleteCanvas(rowData)} 
            />
        </div>
    );
      useEffect(() => {
    // Fetch templates from API (expects an array of Template)
    getCanvases(basePage)
      .then((res: any) => {
        // Accept either res.data or res
        console.log('Fetched templates:', res);
        const data = Array.isArray(res) ? res : res?.data;
        if (Array.isArray(data) && data.length) {
            console.log('Fetched templates:', res.data || res);
            const results = data.map((item: any) => ({
              id: item.id,
              name: item.name,
              user: item.user.username,
              createdAt: item.createdAt ? item.createdAt.slice(0, 10) : '', // Format date as yyyy-mm-dd
              data: item.data || {}
            }));
            console.log('Processed canvases:', results);
          setCanvases(results);
           setTotalRecords(res.pagination.total_items || data.length);
          setPagination(res.pagination)
          setCurrentPage(res.pagination.page)
          setTotalPages(res.pagination.totalPages)
         //  setTotalRecords(res.data.pagination.totalItems || data.length); 

        } else {
          // Use sample data if API returns empty or invalid data
          setCanvases(sampleCanvases);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('Error fetching templates:', err);
        // Use sample templates on error as a graceful fallback
        setCanvases(sampleCanvases);
        setLoading(false);
      });
  }, []); // Empty dependency array to run only once

    const onPageInputChange = (event: any) => {
      const current = event.value;
      setPageNo(current);
    };
    const onPageChange = (text: string) => {
      let currentPage = 1;
      console.log("onPageChange called with:", text);
      console.log("Current pagination state:",  pagination!.page);
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
      console.log("Navigating to page:", currentPage);
      getCanvases(currentPage).then((newCanvases) => {
        setCanvases(newCanvases);
        setPagination(newCanvases!.pagination);
        setFirst(currentPage);
        setCurrentPage(currentPage);
        setTotalPages(newCanvases!.pagination.totalPages);
      });
      setPage(currentPage);
    };
    const paginatorTemplate = {
      layout:
        " FirstPageLink PrevPageLink CurrentPageReport  NextPageLink LastPageLink JumpToPageInput",
      FirstPageLink: (options: any) => {
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
      CurrentPageReport: (options: any) => {
        return (
          <span
            className="mx-3"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            ({currentPage} / {totalPages})
          </span>
        );
      },
      JumpToPageInput: (options: any) => {
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
      NextPageLink: (options: any) => {
        return (
          <button
            type="button"
          /*   className={
              currentPage < totalPages
                ? options.className
                : ""
            } */
            onClick={() => onPageChange("next")}
            disabled={
              currentPage < totalPages
                ? false
                : true
            } 
          >
            <span className="p-3">Next</span>
          </button>
        );
      },
      LastPageLink: (options: any) => {
        return (
          <button
            type="button"
            /* className={
              currentPage < totalPages
                ? options.className
                : ""
            } */
            onClick={() => onPageChange("last")}
             disabled={
              currentPage < totalPages
                ? false
                : true
            } 
          >
            <span className="p-3">Last</span>
          </button>
        );
      },
    };
    return (
         <><div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Canvases</h2>
                {(userRole === 'ADMIN' || userRole === 'TEMPLATECREATOR') && (
                    <Button
                        label="Add Canvas"
                        icon="pi pi-plus"
                        className="p-button-sm p-button-primary add-btn"
                        onClick={() => {
                            setSelectedCanvas({ id: 0, name: '', user: '', createdAt: new Date().toISOString().slice(0, 10), data: {} });
                            setAddDialog(true);
                        } } />)}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                {/* Global Search + Reset */}
                <div className="mb-4 flex gap-2">
                    <span className="p-input-icon-left flex-grow">
                        <i className="pi pi-search" />
                        <InputText
                            type="search"
                            placeholder="Search canvases"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full" />
                    </span>
                    <Button
                        label="Reset Filters"
                        icon="pi pi-filter-slash"
                        className="p-button-sm p-button-secondary"
                        onClick={resetFilters} />
                </div>

                <DataTable<Canvas[]>
                    ref={dt}
                    value={canvases}
                    className="p-datatable-gridlines p-datatable-hoverable"
                    responsiveLayout="scroll"
                    rowHover
                    stripedRows
                    paginator
                    loading={loading}
                    rows={10}
                    dataKey="id"
                    globalFilter={globalFilter}
                    paginatorTemplate={paginatorTemplate}
                    first={(page - 1) * limit}
                    totalRecords={totalRecords}
                    onPage={(e) => {
                        const newPage = Math.floor(e.first / e.rows) + 1;
                        setPage(newPage);
                        setLimit(e.rows);
                    } }
                >


                    <Column field="id" header="ID" sortable />
                    <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name" />
                    <Column field="user" header="User" sortable filter filterPlaceholder="Filter by user" />
                    <Column field="createdAt" header="Last Modified" sortable filter filterPlaceholder="Filter by date" />
                    <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>
            </div>

            {/* Add/Edit Modal */}
            <Dialog
                header={editDialog ? "Edit Canvas" : "Add Canvas"}
                visible={editDialog || addDialog}
                style={{ width: '400px' }}
                modal
                onHide={hideDialog}
                className="rounded-xl"
            >
                {selectedCanvas && (
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label>Name</label>
                            <InputText
                                value={selectedCanvas.name}
                                onChange={(e) => setSelectedCanvas({ ...selectedCanvas, name: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>User</label>
                            <Dropdown
                                value={selectedCanvas.user}
                                options={users}
                                onChange={(e) => setSelectedCanvas({ ...selectedCanvas, user: e.value })}
                                placeholder="Select a user" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Last Modified</label>
                            <Calendar
                                value={new Date(selectedCanvas.createdAt)}
                                onChange={(e) => setSelectedCanvas({ ...selectedCanvas, createdAt: (e.value as Date).toISOString().slice(0, 10) })}
                                dateFormat="yy-mm-dd"
                                className="w-full" />
                        </div>

                        {/* JSON Editor for data */}
                        <div className="flex flex-col gap-1">
                            <label>Data (JSON)</label>
                            <textarea
                                rows={6}
                                value={dataJsonText}
                                onChange={onDataJsonChange}
                                className="border border-gray-300 rounded p-2 font-mono text-sm"
                                style={{ minWidth: '100%', fontFamily: 'monospace' }} />
                            {dataJsonError && <small className="text-red-600">{dataJsonError}</small>}
                        </div>

                        <div className="flex justify-content-end mt-4">
                            <Button
                                label="Save"
                                icon="pi pi-check"
                                className="p-button-sm save-btn mr-2"
                                onClick={saveCanvas}
                                disabled={!!dataJsonError} />
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                className="p-button-sm cancel-btn"
                                onClick={hideDialog} />
                        </div>
                    </div>
                )}
            </Dialog>

            <Dialog
                visible={deleteCanvasDialog}
                style={{ width: '32rem' }}
                header="Confirm Deletion"
                modal
                onHide={() => setDeleteCanvasDialog(false)}
                footer={<div className="flex justify-end gap-2">
                    <Button label="No" icon="pi pi-times" outlined onClick={() => setDeleteCanvasDialog(false)} />
                    <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSingleCanvas} />
                </div>}
            >
                <div className="confirmation-content flex align-items-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: '#f59e0b' }} />
                    {canvasToDelete && (
                        <span>
                            Are you sure you want to delete <b>"{canvasToDelete.name}"</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div></>
    );
};

export default Canvases;
