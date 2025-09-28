import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { deleteTemplate, editTemplate, editTemplateWithFile, getCategories, getTemplates, getTemplatesbyId } from '../services';
import type { Category } from '../modules';

type Template = {
  id: number;
  name: string;
  image: string;   // URL
  price: number;
  category: Category;
  userId: string;

};
// Create a helper function to handle image URLs
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend your SERVER base URL (port 5001)
  const SERVER_BASE_URL = 'http://localhost:5001';
  
  // Handle both "/uploads/..." and "uploads/..." paths
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${SERVER_BASE_URL}${cleanPath}`;
};
const sampleTemplates: Template[] = [
  { id: 1, name: 'Startup Landing', image: 'https://via.placeholder.com/80x50', price: 29, category: 'MARRIAGE', userId: 'Alice' },
  { id: 2, name: 'Portfolio Pro',   image: 'https://via.placeholder.com/80x50', price: 19, category: 'GRADUATION', userId: 'Bob' },
  { id: 3, name: 'Shop Lite',       image: 'https://via.placeholder.com/80x50', price: 39, category: 'NATIONALDAY', userId: 'Carol' },
];

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);        // current page
const [limit, setLimit] = useState(10);     // items per page
const [totalRecords, setTotalRecords] = useState(0);
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [uploadLoading, setUploadLoading] = useState(false);
const [imageError, setImageError] = useState<string | null>(null);
  // Derived filters (unique categories/userIds from current data)
 // const categories = Array.from(new Set(templates.map(t => t.category))).sort();
  const userIds = Array.from(new Set(templates.map(t => t.userId))).sort();
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
 const [categories, setCategories] = useState<string[]>([]);
const [categoriesLoading, setCategoriesLoading] = useState(false); 
  const openEditDialog = (tpl: Template) => {
    setSelectedTemplate({ ...tpl });
    setEditDialog(true);
  };

  const handleDelete = (tpl: Template) => {
    if (window.confirm(`Delete template "${tpl.name}"?`)) {
      const te = async () => {
        try {
          await deleteTemplate((tpl.id).toString());
          setTemplates(prev => prev.filter(t => t.id !== tpl.id));
        } catch (error) {
          console.error('Error deleting template:', error);
        }
      };
      te();
    }
  };
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log('🔍 handleImageChange called');
  const file = e.target.files?.[0];
  console.log('File from input:', file);
  
  setImageError(null);
  
  if (!file) {
    console.log('❌ No file selected');
    setImageFile(null);
    setImagePreview(null);
    return;
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    console.log('❌ Invalid file type:', file.type);
    setImageError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
    return;
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    console.log('❌ File too large:', file.size);
    setImageError(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    return;
  }

  console.log('✅ File validation passed');
  console.log('Setting imageFile state to:', file);
  
  // Set the file state
  setImageFile(file);
  
  // Create preview URL
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = e.target?.result as string;
    console.log('✅ Preview created:', preview?.substring(0, 50) + '...');
    setImagePreview(preview);
  };
  reader.readAsDataURL(file);
};

// 2. Debug your handleSave function
const handleSave = async () => {
  console.log('🚀 handleSave called');
  console.log('selectedTemplate:', selectedTemplate);
  console.log('imageFile state:', imageFile);
  console.log('imageFile details:', imageFile ? {
    name: imageFile.name,
    size: imageFile.size,
    type: imageFile.type,
    lastModified: imageFile.lastModified
  } : 'No file');

  if (selectedTemplate) {
    setUploadLoading(true);
    try {
      console.log('📤 Calling editTemplate with:', {
        templateData: selectedTemplate,
        imageFile: imageFile
      });
      
      const updatedTemplate = await editTemplateWithFile(selectedTemplate, imageFile);
      console.log('✅ Template updated:', updatedTemplate);
      
      setTemplates(prev => prev.map(t => (t.id === updatedTemplate.data.id ? updatedTemplate.data : t)));
      
      // Reset state
      setEditDialog(false);
      setSelectedTemplate(null);
      setImageFile(null);
      setImagePreview(null);
      setImageError(null);
    } catch (error) {
      console.error('❌ Update failed:', error);
    } finally {
      setUploadLoading(false);
    }
  } else {
    console.log('❌ No selectedTemplate');
  }
};
 /*  const handleSave = async () => {
     
   

    if (selectedTemplate) {
       const updatedTemplate = await editTemplate(selectedTemplate);
       console.log('updatedTemplate',updatedTemplate)
      setTemplates(prev => prev.map(t => (t.id === selectedTemplate.id ? selectedTemplate : t)));
    }
    setEditDialog(false);
    setSelectedTemplate(null);
  }; */


  const formatCurrency = (n: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const imageBodyTemplate = (template: Template) => {
 // const host = "https://server.thimly.com"; // make sure this is the real host
 // const src = `${host}/uploads/${encodeURIComponent(template.image)}`;
  return (
    <img
      src={getImageUrl(template.image)} 
      alt={template.name ?? template.image}
      className="w-6rem shadow-2 border-round"
      crossOrigin="anonymous" // harmless unless you enable CORS on the server
      loading="lazy"
    />
  );
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
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback to hardcoded categories
      setCategories(['MARRIAGE', 'BIRTHDAY', 'GRADUATION', 'EID', 'NATIONALDAY', 'OTHER']);
    } finally {
      setCategoriesLoading(false);
    }
  };

  fetchCategories();
}, []);
  useEffect(() => {
    // Fetch templates from API (expects an array of Template)
    getTemplatesbyId("50e689e7-a19e-4ff9-a2ac-354856d9f213").then((res:any)=>{
      console.log('res',res)
    })
    getTemplates()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        // Accept either res.data or res
        console.log('Fetched templates:', res.pagination.totalItems || res);
        const data = Array.isArray(res) ? res : res?.data;
        if (Array.isArray(data) && data.length) {
            console.log('Fetched templates:', res.data || res);
          setTemplates(data);
          setTotalRecords(res.pagination.totalItems || data.length); 

        } else {
          // Use sample data if API returns empty or invalid data
          setTemplates(sampleTemplates);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
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
 {/*      <Dialog
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
      </Dialog> */}
<Dialog
  header="Edit Template"
  visible={editDialog}
  style={{ width: '550px' }}
  modal
  onHide={() => {
    setEditDialog(false);
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
  }}
  className="rounded-xl"
>
  {selectedTemplate && (
    <div className="flex flex-col gap-4">
      {/* Loading overlay */}
      {uploadLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 rounded-xl">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <i className="pi pi-spin pi-spinner text-blue-500"></i>
            <span>Updating template...</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="font-medium">Name</label>
        <InputText
          value={selectedTemplate.name}
          onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
          disabled={uploadLoading}
        />
      </div>

      {/* Image upload section - your existing code here */}
      
      <div className="flex flex-col gap-1">
        <label className="font-medium">Price (USD)</label>
        <InputText
          value={String(selectedTemplate.price ?? '')}
          onChange={(e) => {
            const val = Number(e.target.value.replace(/[^\d.]/g, ''));
            setSelectedTemplate({ ...selectedTemplate, price: isNaN(val) ? 0 : val });
          }}
          disabled={uploadLoading}
        />
      </div>

      {/* Enhanced Category Selection */}
      <div className="flex flex-col gap-1">
        <label className="font-medium">Category</label>
        {categoriesLoading ? (
          <div className="flex items-center gap-2 p-2 border rounded">
            <i className="pi pi-spin pi-spinner text-blue-500"></i>
            <span className="text-gray-500">Loading categories...</span>
          </div>
        ) : (
          <Dropdown
            value={selectedTemplate.category}
            options={categories.map(cat => ({
              label: cat.charAt(0) + cat.slice(1).toLowerCase().replace('_', ' '), // Format display text
              value: cat
            }))}
            onChange={(e) => setSelectedTemplate({ ...selectedTemplate, category: e.value })}
            placeholder="Select a category"
            disabled={uploadLoading}
            className="w-full"
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">User ID</label>
        <InputText
          value={selectedTemplate.userId}
          onChange={(e) => setSelectedTemplate({ ...selectedTemplate, userId: e.target.value })}
          disabled={uploadLoading}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button 
          label="Cancel" 
          icon="pi pi-times" 
          className="p-button-sm p-button-outlined" 
          onClick={() => {
            setEditDialog(false);
            setImageFile(null);
            setImagePreview(null);
            setImageError(null);
          }}
          disabled={uploadLoading}
        />
        <Button 
          label={uploadLoading ? "Saving..." : "Save"} 
          icon={uploadLoading ? "pi pi-spin pi-spinner" : "pi pi-check"} 
          className="p-button-sm p-button-success" 
          onClick={handleSave}
          disabled={uploadLoading || !!imageError}
        />
      </div>
    </div>
  )}
</Dialog>

    </div>
  );
};

export default Templates;