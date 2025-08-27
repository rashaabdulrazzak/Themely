import React, { useEffect, useState, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { getTemplates } from '../services';

type Template = {
  id: number;
  name: string;
  image: string;   // URL
  price: number;
  category: string;
  userId: string;

};

const sampleTemplates: Template[] = [
  { id: 1, name: 'Startup Landing', image: 'https://via.placeholder.com/80x50', price: 29, category: 'Landing', userId: 'Alice' },
  { id: 2, name: 'Portfolio Pro',   image: 'https://via.placeholder.com/80x50', price: 19, category: 'Portfolio', userId: 'Bob' },
  { id: 3, name: 'Shop Lite',       image: 'https://via.placeholder.com/80x50', price: 39, category: 'E-commerce', userId: 'Carol' },
];

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);        // current page
const [limit, setLimit] = useState(10);     // items per page
const [totalRecords, setTotalRecords] = useState(0);
  // Derived filters (unique categories/userIds from current data)
  const categories = Array.from(new Set(templates.map(t => t.category))).sort();
  const userIds = Array.from(new Set(templates.map(t => t.userId))).sort();

  const openEditDialog = (tpl: Template) => {
    setSelectedTemplate({ ...tpl });
    setEditDialog(true);
  };

  const handleDelete = (tpl: Template) => {
    if (window.confirm(`Delete template "${tpl.name}"?`)) {
      setTemplates(prev => prev.filter(t => t.id !== tpl.id));
    }
  };

  const handleSave = () => {
    if (selectedTemplate) {
      setTemplates(prev => prev.map(t => (t.id === selectedTemplate.id ? selectedTemplate : t)));
    }
    setEditDialog(false);
    setSelectedTemplate(null);
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
 const imageBodyTemplate = (template: Template) => {
        return <img src={`${template.image}`} alt={template.image} className="w-6rem shadow-2 border-round" />;
    };


  const priceBody = (row: Template) => <span className="font-medium">{formatCurrency(row.price)}</span>;

  const actionsBody = (row: Template) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-text p-button-sm"
        onClick={() => openEditDialog(row)}
        aria-label="Edit"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-sm p-button-danger"
        onClick={() => handleDelete(row)}
        aria-label="Delete"
      />
    </div>
  );

  useEffect(() => {
    // Fetch templates from API (expects an array of Template)
    getTemplates()
      .then((res: any) => {
        // Accept either res.data or res
        console.log('Fetched templates:', res.data.pagination.totalItems || res);
        const data = Array.isArray(res) ? res : res?.data?.data;
        if (Array.isArray(data) && data.length) {
            console.log('Fetched templates:', res.data.data || res);
          setTemplates(data);
          setTotalRecords(res.data.pagination.totalItems || data.length); 

        } else {
          // Use sample data if API returns empty or invalid data
          setTemplates(sampleTemplates);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('Error fetching templates:', err);
        // Use sample templates on error as a graceful fallback
        setTemplates(sampleTemplates);
        setLoading(false);
      });
  }, []); // Empty dependency array to run only once

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Templates</h2>

        <DataTable
          value={templates}
          className="p-datatable-hoverable"
          responsiveLayout="scroll"
          rowHover
          stripedRows
          paginator
          rows={10}
            first={(page - 1) * limit}
          dataKey="id"
          removableSort
          filterDisplay="row"
          loading={loading}
          totalRecords={totalRecords}

          onPage={(e) => {
    const newPage = Math.floor(e.first / e.rows) + 1;
    setPage(newPage);
    setLimit(e.rows); // in case user changed rows per page
  }}
          
        >
          <Column field="id" header="ID" sortable style={{ width: '90px' }} />

          <Column
            field="image"
            header="Preview"
            body={imageBodyTemplate}
            style={{ width: '120px' }}
            exportable={false}
          />

          <Column
            field="name"
            header="Name"
            sortable
            filter
            filterPlaceholder="Search name"
          />

          <Column
            field="price"
            header="Price"
            body={priceBody}
            sortable
            filter
            dataType="numeric"
            filterPlaceholder="e.g. 29"
            style={{ width: '140px' }}
          />

          <Column
            field="category"
            header="Category"
            sortable
            filter
            filterElement={
              <Dropdown
                value={null}
                options={categories}
                placeholder="All"
                onChange={() => {}}
                className="p-column-filter"
                showClear
              />
            }
          />

          <Column
            field="userId"
            header="userId"
            sortable
            filter
            filterElement={
              <Dropdown
                value={null}    
                options={userIds}
                placeholder="All"
                onChange={() => {}}
                className="p-column-filter"
                showClear
              />
            }
          />

          <Column header="Actions" body={actionsBody} exportable={false} style={{ width: '120px' }} />
        </DataTable>
      </div>

      {/* Edit Modal */}
      <Dialog
        header="Edit Template"
        visible={editDialog}
        style={{ width: '480px' }}
        modal
        onHide={() => setEditDialog(false)}
        className="rounded-xl"
      >
        {selectedTemplate && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label>Name</label>
              <InputText
                value={selectedTemplate.name}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Image URL</label>
              <InputText
                value={selectedTemplate.image}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, image: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Price (USD)</label>
              <InputText
                value={String(selectedTemplate.price ?? '')}
                onChange={(e) => {
                  const val = Number(e.target.value.replace(/[^\d.]/g, ''));
                  setSelectedTemplate({ ...selectedTemplate, price: isNaN(val) ? 0 : val });
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Category</label>
              <InputText
                value={selectedTemplate.category}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, category: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>userId</label>
              <InputText
                value={selectedTemplate.userId}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, userId: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button label="Cancel" icon="pi pi-times" className="p-button-sm" onClick={() => setEditDialog(false)} />
              <Button label="Save" icon="pi pi-check" className="p-button-sm p-button-success" onClick={handleSave} />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Templates;