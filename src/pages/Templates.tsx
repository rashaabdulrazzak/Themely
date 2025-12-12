import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  createTemplateWithFile,
  deleteTemplate,
  editTemplateWithFile,
  getCategories,
  getTemplates,
} from "../services";
import type { IPagination, Template } from "../modules";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
import type { PaginatorPrevPageLinkOptions } from "primereact/paginator";

// helper function to handle image URLs
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL_UPLOAD;

  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return `${SERVER_BASE_URL}${cleanPath}`;
};

const sampleTemplates: Template[] = [
  {
    id: 1,
    nameEn: "Startup Landing",
    image: "https://via.placeholder.com/80x50",
    price: 29,
    category: "MARRIAGE",
    userId: "Alice",
  },
  {
    id: 2,
    nameEn: "Portfolio Pro",
    image: "https://via.placeholder.com/80x50",
    price: 19,
    category: "GRADUATION",
    userId: "Bob",
  },
  {
    id: 3,
    nameEn: "Shop Lite",
    image: "https://via.placeholder.com/80x50",
    price: 39,
    category: "NATIONALDAY",
    userId: "Carol",
  },
];

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // current page
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
  const [deleteProductsDialog, setDeleteProductsDialog] =
    useState<boolean>(false);
  const [deleteProductDialog, setDeleteProductDialog] =
    useState<boolean>(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(
    null
  );
  const [addDialog, setAddDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Template | null>(null);
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
  const [addUploadLoading, setAddUploadLoading] = useState(false);
  const [addImageError, setAddImageError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const user = localStorage.getItem("user");
  const addFileUploadRef = useRef<FileUpload | null>(null);

  const userRole = user ? JSON.parse(user).role : null;
  const [pagination, setPagination] = useState<IPagination>();
  // const [first, setFirst] = useState(0);
  const [pageNo, setPageNo] = useState<number>(pagination?.page || 0);
  const [currentPage, setCurrentPage] = useState<number>(pagination?.page || 1);
  const [totalPages, setTotalPages] = useState<number>(
    pagination?.totalPages || 1
  );
  const toast = useRef<Toast>(null);
  // Derived filters (unique categories/userIds from current data)
  // const categories = Array.from(new Set(templates.map(t => t.category))).sort();
  const userIds = Array.from(new Set(templates.map((t) => t.userId))).sort();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  
  const openEditDialog = (tpl: Template) => {
    setSelectedTemplate({ ...tpl });
    setEditDialog(true);
    setTimeout(() => setEditDialog(true), 0);
  };

  const handleSave = async () => {

    if (selectedTemplate) {
      setUploadLoading(true);
      try {

        const updatedTemplate = await editTemplateWithFile(
          selectedTemplate,
          imageFile
        );
        
        setTemplates((prev: Template[]) =>
          prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t))
        ); 

        // Reset state
        setEditDialog(false);
        setSelectedTemplate(null);
        setImageFile(null);
        setImagePreview(null);
        setImageError(null);

        // Show success toast
        toast.current?.show({
          severity: "success",
          summary: "Successful",
          detail: `Template "${
            updatedTemplate?.nameEn || ""
          } " updated successfully`,
          life: 3000,
        });
      } catch (error) {
        console.error("❌ Update failed:", error);

        // Show error toast
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update template",
          life: 3000,
        });
      } finally {
        setUploadLoading(false);
      }
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "No template selected for editing",
        life: 3000,
      });
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  const imageBodyTemplate = (template: Template) => {
    return (
      <img
        src={getImageUrl(template.image)}
        alt={template.nameEn ?? template.image}
        style={{
          width: 250,
          height: 150,
          objectFit: "cover",
          borderRadius: "8px",
        }}
        crossOrigin="anonymous"
        loading="lazy"
      />
    );
  };

  const priceBody = (row: Template) => (
    <span className="font-medium">{formatCurrency(row.price)}</span>
  );

  const actionsBody = (row: Template) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-text p-button-sm"
        onClick={() => openEditDialog(row)}
        aria-label="Edit"
        tooltip="Edit"
        tooltipOptions={{ position: "top" }}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-sm p-button-danger"
        onClick={() => confirmDeleteTemplate(row)}
        aria-label="Delete"
        tooltip="Delete"
        tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([
          "MARRIAGE",
          "BIRTHDAY",
          "GRADUATION",
          "EID",
          "NATIONALDAY",
          "OTHER",
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    getTemplates(page, categoryFilter)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        // Accept either res.data or res
        const data = Array.isArray(res) ? res : res?.data;
        if (Array.isArray(data) && data.length) {
          setTemplates(data);
          setTotalRecords(res.pagination.total_items || data.length);
          setPagination(res.pagination);
          setCurrentPage(res.pagination.page);
          setTotalPages(res.pagination.totalPages);
        } else {
          setTemplates(sampleTemplates);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Error fetching templates:", err);
        setTemplates(sampleTemplates);
        setLoading(false);
      });
  }, [page, categoryFilter]);
  // Function to open confirmation dialog
  const confirmDeleteSelected = () => {
    if (selectedTemplates.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please select templates to delete",
        life: 3000,
      });
      return;
    }
    setDeleteProductsDialog(true);
  };

  // Function to execute the deletion
  const deleteSelectedTemplates = async () => {
    try {
      // Delete all selected templates
      await Promise.all(
        selectedTemplates.map((template) =>
          deleteTemplate(template.id.toString())
        )
      );

      // Update the state
      const _templates = templates.filter(
        (val) => !selectedTemplates.includes(val)
      );

      setTemplates(_templates);
      setDeleteProductsDialog(false);
      setSelectedTemplates([]);

      // Show success toast
      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: `Successfully deleted ${selectedTemplates.length} template(s)`,
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting templates:", error);

      // Show error toast
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete some templates",
        life: 3000,
      });

      setDeleteProductsDialog(false);
    }
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };
  // Function to open single delete confirmation dialog
  const confirmDeleteTemplate = (template: Template) => {
    setTemplateToDelete(template);
    setDeleteProductDialog(true);
  };

  // Function to execute single template deletion
  const deleteSingleTemplate = async () => {
    if (!templateToDelete) return;

    try {
      await deleteTemplate(templateToDelete.id.toString());

      // Update the state
      setTemplates((prev) => prev.filter((t) => t.id !== templateToDelete.id));

      setDeleteProductDialog(false);
      setTemplateToDelete(null);

      // Show success toast
      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: `Template "${templateToDelete.nameEn}" deleted successfully`,
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting template:", error);

      // Show error toast
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete template",
        life: 3000,
      });

      setDeleteProductDialog(false);
      setTemplateToDelete(null);
    }
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
    setTemplateToDelete(null);
  };

  const openAddDialog = () => {
    const currentUserId = user ? JSON.parse(user).id : "";

    setNewTemplate({
      id: 0, // Or let your backend assign automatically
      nameEn: "",
      nameAr: "",
      image: "",
      price: 0,
      category: "OTHER",
      userId: currentUserId,
    });
    setAddDialog(true);
    setAddImageFile(null);
    setAddImagePreview(null);
    setAddImageError(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPageInputChange = (event: any) => {
    const current = event.value;
    setPageNo(current);
  };
  const onPageChange = (text: string) => {
    let currentPage = 1;
    
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
    getTemplates(currentPage, categoryFilter).then((res) => {
      const data = Array.isArray(res) ? res : res?.data;
      setTemplates(data);
      setPagination(res!.pagination);
      setCurrentPage(currentPage);
      setTotalPages(res!.pagination.totalPages);
    });
    setPage(currentPage);
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
    PrevPageLink: (options: PaginatorPrevPageLinkOptions) => {
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
        <div className="bg-white rounded-xl shadow-md p-6 ">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-sm md:text-2xl font-bold">Templates</h2>
            {(userRole === "ADMIN" || userRole === "TEMPLATECREATOR") && (
              <div className="flex gap-2">
                <Button
                  label="Add Template"
                  icon="pi pi-plus"
                  className="p-button-sm p-button-primary add-btn"
                  onClick={openAddDialog}
                />

                <Button
                  label={`Bulk Delete (${selectedTemplates.length})`}
                  icon="pi pi-trash"
                  className="p-button-sm p-button-secondary p-button p-component delete-btn"
                  onClick={confirmDeleteSelected}
                  disabled={
                    !selectedTemplates || selectedTemplates.length === 0
                  }
                />
              </div>
            )}
          </div>
          <DataTable
            value={templates}
            className="p-datatable-hoverable"
            loading={loading}
            emptyMessage={loading ? "Loading…" : "No Patients found"}
            rowHover
            stripedRows
            paginator
            rows={10}
            first={first}
            dataKey="id"
            removableSort
            filterDisplay="row"
            totalRecords={totalRecords}
            selection={selectedTemplates}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSelectionChange={(e: any) => {
              const val = e?.value;
              if (Array.isArray(val)) {
                setSelectedTemplates(val as Template[]);
              } else if (val) {
                setSelectedTemplates([val as Template]);
              } else {
                setSelectedTemplates([]);
              }
            }}
            selectionMode="checkbox"
            onPage={(e) => {
              const newPage = Math.floor(e.first / e.rows) + 1;
              setPage(newPage);
             
              setFirst(e.first);
            }}
            paginatorTemplate={paginatorTemplate}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

            <Column field="id" header="ID" sortable style={{ width: "90px" }} />

            <Column
              field="image"
              header="Preview"
              body={imageBodyTemplate}
              style={{ width: "120px" }}
              exportable={false}
            />

            <Column
              field="nameEn"
              header="Name EN"
              sortable
              filter
              filterPlaceholder="Search name"
            />
            <Column
              field="nameAr"
              header="Name AR"
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
              style={{ width: "140px" }}
            />

            <Column
              field="category"
              header="Category"
              sortable
              filter
              showFilterMenu={false}
              filterElement={(options) => (
                <Dropdown
                  value={categoryFilter}
                  options={categories}
                  placeholder="All"
                  onChange={(e) => {
                    const value = e.value || null;
                    setCategoryFilter(value);
                    options.filterApplyCallback(value);
                    setPage(1);
                    setFirst(0);
                  }}
                  className="p-column-filter"
                  showClear
                />
              )}
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

            <Column
              header="Actions"
              body={actionsBody}
              exportable={false}
              style={{ width: "120px" }}
            />
          </DataTable>
        </div>
        {/* Edit Dialog */}
        <Dialog
          header="Edit Template"
          visible={editDialog}
          style={{ width: "550px" }}
          modal
          onHide={() => {
            setEditDialog(false);
            setImageFile(null);
            setImagePreview(null);
            setImageError(null);
            setSelectedTemplate(null);
          }}
          className="rounded-xl"
        >
          {!selectedTemplate ? (
            <div className="flex items-center justify-center p-4">
              <i className="pi pi-spin pi-spinner text-blue-500 mr-2"></i>
              <span>Loading...</span>
            </div>
          ) : (
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
                <label className="font-medium">Name EN</label>
                <InputText
                  value={selectedTemplate.nameEn}
                  onChange={(e) =>
                    setSelectedTemplate({
                      ...selectedTemplate,
                      nameEn: e.target.value,
                    })
                  }
                  disabled={uploadLoading}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-medium">Name AR</label>
                <InputText
                  value={selectedTemplate.nameAr}
                  onChange={(e) =>
                    setSelectedTemplate({
                      ...selectedTemplate,
                      nameAr: e.target.value,
                    })
                  }
                  disabled={uploadLoading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">Template Image</label>

                {/* Current image preview */}
                {!imagePreview && selectedTemplate.image && (
                  <div className="mb-2">
                    <img
                      src={getImageUrl(selectedTemplate.image)}
                      alt="Current"
                      className="w-32 h-20 object-cover border rounded"
                    />
                    <p className="text-sm text-gray-500 mt-1">Current image</p>
                  </div>
                )}

                {/* New image preview */}
                {imagePreview && (
                  <div className="mb-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-20 object-cover border rounded"
                    />
                    <p className="text-sm text-green-600 mt-1">
                      New image (not saved yet)
                    </p>
                  </div>
                )}

                <FileUpload
                  ref={addFileUploadRef}
                  mode="basic"
                  name="templateImage"
                  chooseLabel="Choose Image"
                  accept="image/*"
                  maxFileSize={MAX_FILE_SIZE}
                  customUpload
                  auto={false}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onSelect={(e: any) => {
                    const file = e.files?.[0] as File | undefined;
                    setImageError(null);

                    if (!file) {
                      setImageFile(null);
                      setImagePreview(null);
                      return;
                    }

                    if (!ALLOWED_TYPES.includes(file.type)) {
                      setImageError(
                        "Please select a valid image file (JPEG, PNG, WebP, or GIF)"
                      );
                      addFileUploadRef.current?.clear();
                      return;
                    }

                    if (file.size > MAX_FILE_SIZE) {
                      setImageError(
                        `File size must be less than ${
                          MAX_FILE_SIZE / (1024 * 1024)
                        }MB`
                      );
                      addFileUploadRef.current?.clear();
                      return;
                    }

                    setImageFile(file);

                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setImagePreview(ev.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }}
                  disabled={uploadLoading}
                />

                {imageError && (
                  <small className="text-red-500">{imageError}</small>
                )}
                <small className="text-gray-500">
                  Max size: 5MB. Formats: JPEG, PNG, WebP, GIF
                </small>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium">Price (USD)</label>
                <InputText
                  value={String(selectedTemplate.price ?? "")}
                  onChange={(e) => {
                    const val = Number(e.target.value.replace(/[^\d.]/g, ""));
                    setSelectedTemplate({
                      ...selectedTemplate,
                      price: isNaN(val) ? 0 : val,
                    });
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
                    options={categories.map((cat) => ({
                      label:
                        cat.charAt(0) +
                        cat.slice(1).toLowerCase().replace("_", " "), // Format display text
                      value: cat,
                    }))}
                    onChange={(e) =>
                      setSelectedTemplate({
                        ...selectedTemplate,
                        category: e.value,
                      })
                    }
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
                  onChange={(e) =>
                    setSelectedTemplate({
                      ...selectedTemplate,
                      userId: e.target.value,
                    })
                  }
                  disabled={uploadLoading}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  className="p-button-sm cancel-btn"
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
                  className="p-button-sm save-btn mr-2"
                  onClick={handleSave}
                  disabled={uploadLoading || !!imageError}
                />
              </div>
            </div>
          )}
        </Dialog>
        {/* Bulk Delete Confirmation Dialog */}
        <Dialog
          visible={deleteProductsDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm Deletion"
          modal
          footer={
            <div className="flex justify-end gap-2">
              <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteProductsDialog}
              />
              <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteSelectedTemplates}
              />
            </div>
          }
          onHide={hideDeleteProductsDialog}
        >
          <div className="confirmation-content flex align-items-center">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem", color: "#f59e0b" }}
            />
            <span>
              Are you sure you want to delete <b>{selectedTemplates.length}</b>{" "}
              selected template(s)?
            </span>
          </div>
        </Dialog>
        {/* Single Delete Confirmation Dialog */}
        <Dialog
          visible={deleteProductDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm Deletion"
          modal
          footer={
            <div className="flex justify-end gap-2">
              <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteProductDialog}
              />
              <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteSingleTemplate}
              />
            </div>
          }
          onHide={hideDeleteProductDialog}
        >
          <div className="confirmation-content flex align-items-center">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem", color: "#f59e0b" }}
            />
            {templateToDelete && (
              <span>
                Are you sure you want to delete{" "}
                <b>"{templateToDelete.nameEn}"</b>?
              </span>
            )}
          </div>
        </Dialog>
        {/* Add Template Dialog would go here */}
        <Dialog
          header="Add Template"
          visible={addDialog}
          style={{ width: "550px" }}
          modal
          onHide={() => {
            setAddDialog(false);
            setNewTemplate(null);
            setAddImageFile(null);
            setAddImagePreview(null);
            setAddImageError(null);
          }}
          className="rounded-xl"
        >
          {!newTemplate ? (
            <div className="flex items-center justify-center p-4">
              <i className="pi pi-spin pi-spinner text-blue-500 mr-2"></i>
              <span>Loading...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {addUploadLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 rounded-xl">
                  <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                    <i className="pi pi-spin pi-spinner text-blue-500"></i>
                    <span>Adding template...</span>
                  </div>
                </div>
              )}
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="font-medium">Name EN</label>
                <InputText
                  value={newTemplate.nameEn}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, nameEn: e.target.value })
                  }
                  disabled={addUploadLoading}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-medium">Name AR</label>
                <InputText
                  value={newTemplate.nameAr}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, nameAr: e.target.value })
                  }
                  disabled={addUploadLoading}
                />
              </div>
              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="font-medium">Template Image</label>
                {addImagePreview && (
                  <div className="mb-2">
                    <img
                      src={addImagePreview}
                      alt="Preview"
                      className="w-32 h-20 object-cover border rounded"
                    />
                    <p className="text-sm text-green-600 mt-1">
                      Preview (not saved yet)
                    </p>
                  </div>
                )}
                <FileUpload
                  ref={addFileUploadRef}
                  mode="basic"
                  name="addTemplateImage"
                  chooseLabel="Choose Image"
                  accept="image/*"
                  customUpload
                  auto={false}
                  maxFileSize={MAX_FILE_SIZE}
                  disabled={addUploadLoading}
                  className="text-sm"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onSelect={(e: any) => {
                    const file = e.files?.[0] as File | undefined;
                    setAddImageError(null);

                    if (!file) {
                      setAddImageFile(null);
                      setAddImagePreview(null);
                      return;
                    }

                    if (!ALLOWED_TYPES.includes(file.type)) {
                      setAddImageError(
                        "Please select a valid image file (JPEG, PNG, WebP, or GIF)"
                      );

                      addFileUploadRef.current?.clear();
                      return;
                    }

                    if (file.size > MAX_FILE_SIZE) {
                      setAddImageError(
                        `File size must be less than ${
                          MAX_FILE_SIZE / (1024 * 1024)
                        }MB`
                      );
                      addFileUploadRef.current?.clear();
                      return;
                    }

                    setAddImageFile(file);

                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      setAddImagePreview(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }}
                />

                {addImageError && (
                  <small className="text-red-500">{addImageError}</small>
                )}
                <small className="text-gray-500">
                  Max size: 5MB. Formats: JPEG, PNG, WebP, GIF
                </small>
              </div>
              {/* Price */}
              <div className="flex flex-col gap-1">
                <label className="font-medium">Price (USD)</label>
                <InputText
                  value={String(newTemplate.price ?? "")}
                  onChange={(e) => {
                    const val = Number(e.target.value.replace(/[^\d.]/g, ""));
                    setNewTemplate({
                      ...newTemplate,
                      price: isNaN(val) ? 0 : val,
                    });
                  }}
                  disabled={addUploadLoading}
                />
              </div>
              {/* Category Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="font-medium">Category</label>
                {categoriesLoading ? (
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <i className="pi pi-spin pi-spinner text-blue-500"></i>
                    <span className="text-gray-500">Loading categories...</span>
                  </div>
                ) : (
                  <Dropdown
                    value={newTemplate.category}
                    options={categories.map((cat) => ({
                      label: cat,
                      value: cat,
                    }))}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, category: e.value })
                    }
                    placeholder="Select a category"
                    disabled={addUploadLoading}
                    className="w-full"
                  />
                )}
              </div>
              {/* userId */}
              <div className="flex flex-col gap-1">
                <label className="font-medium">User ID</label>
                <InputText
                  value={newTemplate.userId}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, userId: e.target.value })
                  }
                  disabled={addUploadLoading}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  label={addUploadLoading ? "Saving..." : "Add"}
                  icon={
                    addUploadLoading ? "pi pi-spin pi-spinner" : "pi pi-check"
                  }
                  className="p-button-sm save-btn mr-2"
                  onClick={async () => {
                    setAddUploadLoading(true);
                    try {
                      const result = await createTemplateWithFile(
                        newTemplate,
                        addImageFile
                      );
                     
                      setTemplates((prev) => [result, ...prev]);

                      setAddDialog(false);
                      setNewTemplate(null);
                      setAddImageFile(null);
                      setAddImagePreview(null);
                      setAddImageError(null);

                      toast.current?.show({
                        severity: "success",
                        summary: "Successful",
                        detail: `Template "${result.nameEn}" added successfully`,
                        life: 3000,
                      });
                    } catch (error) {
                      console.error("❌ Add template failed:", error);
                      toast.current?.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Failed to add template",
                        life: 3000,
                      });
                    } finally {
                      setAddUploadLoading(false);
                    }
                  }}
                  disabled={addUploadLoading || !!addImageError}
                />
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  className="p-button-sm cancel-btn"
                  onClick={() => setAddDialog(false)}
                  disabled={addUploadLoading}
                />
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </>
  );
};

export default Templates;
