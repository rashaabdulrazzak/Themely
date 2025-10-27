import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import type { Template } from "../modules";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

type EditDialogProps = {
  visible: boolean;
  template: Template; // Your Template type
  categories: string[];
  categoriesLoading: boolean;
  loading?: boolean;
  onHide: () => void;
  onSave: (template: any, imageFile: File|null) => Promise<void>;
};

export const EditDialog: React.FC<EditDialogProps> = ({
  visible,
  template,
  categories,
  categoriesLoading,
  loading = false,
  onHide,
  onSave,
}) => {
  const [localTemplate, setLocalTemplate] = useState<any>(template);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const toast = useRef<Toast>(null);

  useEffect(() => {
    setLocalTemplate(template);
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
  }, [template, visible]);

  // Helper to create preview and validate image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveClick = async () => {
    if (!localTemplate?.name) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Name is required",
        life: 3000,
      });
      return;
    }
    try {
      await onSave(localTemplate, imageFile);
      toast.current?.show({
        severity: "success",
        summary: "Updated",
        detail: `Template "${localTemplate.name}" updated!`,
        life: 2000,
      });
      onHide();
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.message || "Failed to update template.",
        life: 2500,
      });
    }
  };

  // Helper for legacy images (URL formatting)
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
    const SERVER_BASE_URL = "http://localhost:5001";
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${SERVER_BASE_URL}${cleanPath}`;
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Edit Template"
        visible={visible}
        style={{ width: "550px" }}
        modal
        onHide={onHide}
        className="rounded-xl"
        aria-labelledby="edit-dialog-title"
        focusOnShow
      >
        {!localTemplate ? (
          <div className="flex items-center justify-center p-4">
            <i className="pi pi-spin pi-spinner text-blue-500 mr-2"></i>
            <span>Loading...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 rounded-xl">
                <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                  <i className="pi pi-spin pi-spinner text-blue-500"></i>
                  <span>Updating template...</span>
                </div>
              </div>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">Name</label>
              <InputText
                value={localTemplate.name}
                onChange={(e) =>
                  setLocalTemplate({ ...localTemplate, name: e.target.value })
                }
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Image Preview & Upload */}
            <div className="flex flex-col gap-2">
              <label className="font-medium">Template Image</label>
              {!imagePreview && localTemplate.image && (
                <div className="mb-2">
                  <img
                    src={getImageUrl(localTemplate.image)}
                    alt="Current"
                    className="w-32 h-20 object-cover border rounded"
                  />
                  <p className="text-sm text-gray-500 mt-1">Current image</p>
                </div>
              )}
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
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="text-sm"
              />
              {imageError && (<small className="text-red-500">{imageError}</small>)}
              <small className="text-gray-500">
                Max size: 5MB. Formats: JPEG, PNG, WebP, GIF
              </small>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">Price (USD)</label>
              <InputText
                value={String(localTemplate.price ?? "")}
                onChange={(e) => {
                  const val = Number(e.target.value.replace(/[^\d.]/g, ""));
                  setLocalTemplate({
                    ...localTemplate,
                    price: isNaN(val) ? 0 : val,
                  });
                }}
                disabled={loading}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">Category</label>
              {categoriesLoading ? (
                <div className="flex items-center gap-2 p-2 border rounded">
                  <i className="pi pi-spin pi-spinner text-blue-500"></i>
                  <span className="text-gray-500">Loading categories...</span>
                </div>
              ) : (
                <Dropdown
                  value={localTemplate.category}
                  options={categories.map((cat) => ({
                    label:
                      cat.charAt(0) +
                      cat.slice(1).toLowerCase().replace("_", " "),
                    value: cat,
                  }))}
                  onChange={(e) =>
                    setLocalTemplate({
                      ...localTemplate,
                      category: e.value,
                    })
                  }
                  placeholder="Select a category"
                  disabled={loading}
                  className="w-full"
                />
              )}
            </div>

            {/* User ID */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">User ID</label>
              <InputText
                value={localTemplate.userId}
                onChange={(e) =>
                  setLocalTemplate({ ...localTemplate, userId: e.target.value })
                }
                disabled={loading}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-sm p-button-outlined"
                onClick={() => {
                  onHide();
                  setImageFile(null);
                  setImagePreview(null);
                  setImageError(null);
                }}
                disabled={loading}
              />
              <Button
                label={loading ? "Saving..." : "Save"}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                className="p-button-sm p-button-success"
                onClick={handleSaveClick}
                disabled={loading || !!imageError}
              />
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
};
