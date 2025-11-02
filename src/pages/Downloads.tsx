/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { deleteDownload, getDownloads } from '../services'; // should return either an array or an object with { data: [...] }
import type { Download } from '../modules';



const initialDownloads: Download[] = [
  { id: 1, fileName: 'Canvas One', created: '2024-06-01', user: 'Active', userId: '1' },
  { id: 2, fileName: 'Canvas Two', created: '2024-06-02', user: 'Inactive', userId: '2' },
  { id: 3, fileName: 'Canvas Three', created: '2024-06-03', user: 'Rejected'  , userId: '3' },
];


const Downloads: React.FC = () => {
  const [rows, setRows] = useState<Download[]>(initialDownloads);
  const [loading, setLoading] = useState(true);

  const [editDialog, setEditDialog] = useState(false);
  const [selected, setSelected] = useState<Download | null>(null);

  // ---- helpers
/*   const getSeverity = (status: string) => {
    switch (status) {
      case 'Rejected': return 'danger';
      case 'Active': return 'success';
      case 'Pending': return 'info';
      case 'Inactive': return 'warning';
      default: return undefined;
    }
  }; */

 /*  const statusBodyTemplate = (rowData: Download) => (
    <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
  ); */

  const actionBodyTemplate = (rowData: Download) => (
    <div className="flex gap-2">
     {/*  <Button
        icon="pi pi-pencil"
        className="p-button-text p-button-sm edit-btn mr-2"
        onClick={() => openEditDialog(rowData)}
        aria-label={`Edit ${rowData.fileName}`}
      /> */}
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-sm p-button-danger"
        onClick={() => handleDelete(rowData)}
        aria-label={`Delete ${rowData.fileName}`}
      />
    </div>
  );

 /*  const openEditDialog = (d: Download) => {
    setSelected({ ...d });
    setEditDialog(true);
  }; */

  const handleDelete = async(d: Download) => {
    if (window.confirm(`Are you sure you want to delete "${d.fileName}"?`)) {
       const downloadtoDdelete = await deleteDownload((d.id).toString());
      
      console.log("deleted download...",downloadtoDdelete);
      setRows(prev => prev.filter(x => x.id !== d.id));
    }
  };

  const handleSave = () => {
    if (selected) {
      setRows(prev => prev.map(x => (x.id === selected.id ? selected : x)));
    }
    setEditDialog(false);
    setSelected(null);
  };

  const extractItems = (res: any): any[] => {
    const payload = res?.data ?? res;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    if (Array.isArray(payload?.data?.items)) return payload.data.items;
    return [];
  };

  // Map server fields -> table fields
  const normalize = (r: any): Download => ({
    id: r.id ?? r._id ?? r.uuid ?? r.key,
    fileName: r.fileName ?? r.filename ?? r.name ?? r.title ?? '',
    created: r.createdAt
      ? new Date(r.createdAt).toISOString().slice(0, 10)
      : (r.created ? new Date(r.created).toISOString().slice(0, 10) : ''),
    user: r.user?.name ?? r.user?.username ?? r.user ?? 'N/A',
    userId: r.userId ?? r.user_id ?? r.userId ?? r.user?.id ?? r.user?.userId ?? 'N/A',
   
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getDownloads()
      .then((res: any) => {
        const items = extractItems(res);
        if (items.length) {
          const mapped = items.map(normalize);
          if (mounted) setRows(mapped);
        } else {
          if (mounted) setRows(initialDownloads);
        }
      })
      .catch((err: any) => {
        console.error('Error fetching downloads:', err);
        if (mounted) setRows(initialDownloads);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  function hideDialog(): void {
    setEditDialog(false);
    // setAddDialog(false);
    setSelected(null);
  }
  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Downloads List</h2>

        <DataTable
          value={rows}
          dataKey="id"
          loading={loading}
          rowHover
          stripedRows
          responsiveLayout="scroll"
          paginator
          rows={10}
          emptyMessage={loading ? 'Loading…' : 'No downloads found'}
          className="p-datatable-hoverable"
        >
          <Column field="id" header="ID" sortable />
          <Column field="fileName" header="File Name" sortable filter filterPlaceholder="Search by title" />
          <Column field="created" header="Created" sortable filter filterPlaceholder="Search by date" />
          {/* <Column field="status" header="Status" body={statusBodyTemplate} sortable /> */}
          <Column field="userId" header="User Id"  sortable />
          <Column field="user" header="User"  sortable />
          <Column header="Actions" body={actionBodyTemplate} />
        </DataTable>
      </div>
<Dialog
  header={selected && selected.id ? "Edit Download" : "Add Download"}
  visible={editDialog}
  style={{ width: '480px' }}
  modal
  onHide={() => setEditDialog(false)}
  className="rounded-xl"
>
  {selected && (
    <div className="flex flex-col gap-4">
      
      {/* ID (Read-only, only visible when editing) */}
      {selected.id && (
        <div className="flex flex-col gap-1">
          <label>ID</label>
          <InputText
            value={String(selected.id)}
            readOnly
            disabled
            className="p-disabled"
          />
        </div>
      )}

      {/* FileName (Editable) */}
      <div className="flex flex-col gap-1">
        <label htmlFor="fileName">File Name</label>
        <InputText
          id="fileName"
          value={selected.fileName}
          onChange={(e) => setSelected({ ...selected, fileName: e.target.value })}
        />
      </div>

      {/* Created Date (Read-only, only visible when editing) */}
      {selected.created && (
        <div className="flex flex-col gap-1">
          <label>Created Date</label>
          <InputText
            value={selected.created}
            readOnly
            disabled
            className="p-disabled"
          />
        </div>
      )}

      {/* User (Username) (Read-only) */}
      <div className="flex flex-col gap-1">
        <label>User</label>
        <InputText
          value={selected.user || 'N/A'} 
          readOnly
          disabled
          className="p-disabled"
        />
      </div>
      
      {/* UserID (Read-only) */}
      <div className="flex flex-col gap-1">
        <label>User ID</label>
        <InputText
          value={String(selected.userId || 'N/A')}
          readOnly
          disabled
          className="p-disabled"
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button label="Cancel" icon="pi pi-times" className="p-button-sm p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-sm p-button-success" onClick={handleSave} />
      </div>
    </div>
  )}
</Dialog>

    </div>
  );
};

export default Downloads;
