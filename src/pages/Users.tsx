import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { getUsers, deleteUser, updateUser } from '../services'; // Import API functions
import type { User } from '../modules';



const roleOptions = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' },
    { label: 'Template Creator', value: 'TemplateCreator' }, // Updated from Editor
];

const statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
];

const defaultUsers: User[] = [
    { id: 1, username: 'Alice Smith', email: 'alice@example.com', role: 'ADMIN', status: 'ACTIVE', created: '2024-01-01' },
    { id: 2, username: 'Bob Johnson', email: 'bob@example.com', role: 'USER', status: 'ACTIVE', created: '2024-01-02' },
    { id: 3, username: 'Charlie Brown', email: 'charlie@example.com', role: 'TemplateCreator', status: 'INACTIVE', created: '2024-01-03' },
];

const Users: React.FC = () => {
    const [rows, setRows] = useState<User[]>(defaultUsers);
    const [loading, setLoading] = useState(true);
    const [editDialog, setEditDialog] = useState(false);
    const [selected, setSelected] = useState<User | null>(null);

    // ---- helpers
    const getStatusSeverity = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'INACTIVE': return 'danger';
            default: return undefined;
        }
    };

    const getRoleSeverity = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'danger';
            case 'TemplateCreator': return 'warning';
            case 'USER': return 'info';
            default: return undefined;
        }
    };

    const statusBodyTemplate = (rowData: User) => (
        <Tag value={rowData.status} severity={getStatusSeverity(rowData.status)} />
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

    const openEditDialog = (u: User) => {
        setSelected({ ...u });
        setEditDialog(true);
    };

    const handleDelete = async (u: User) => {
        if (window.confirm(`Are you sure you want to delete user "${u.username}"?`)) {
            try {
                const deletedUser = await deleteUser(u.id.toString());
                console.log("Deleted user...", deletedUser);
                setRows(prev => prev.filter(x => x.id !== u.id));
            } catch (error) {
                console.error("Error deleting user:", error);
                // Handle error - show toast or error message
            }
        }
    };

    const handleSave = async () => {
        if (selected) {
            try {
                // Call the real API to update the user
                const response = await updateUser(selected);
                
               const normalizedUser = normalize(response); // Apply normalize here!
            
            // Update the local 'rows' state with the normalized server data
            setRows(rows.map(u => 
                u.id === normalizedUser.id ? normalizedUser : u
            ));

                console.log("User updated successfully:", response);
            } catch (error) {
                console.error("Failed to save user:", error);
                // Optionally, show an error message to the user here
            }
        }
        hideDialog();
    };

    // Extract array from common API shapes (axios/fetch/backends with {data:{...}})
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
    const normalize = (r: any): User => ({
        id: r.id ?? r._id ?? r.uuid ?? r.key,
        username: r.username ?? r.name ?? r.userName ?? '',
        email: r.email ?? '',
        role: r.role ?? 'USER',
        status: r.status ?? 'ACTIVE',
        created: r.createdAt
            ? new Date(r.createdAt).toISOString().slice(0, 10)
            : (r.created ? new Date(r.created).toISOString().slice(0, 10) : ''),
    });

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        getUsers()
            .then((res: any) => {
                const items = extractItems(res);
                if (items.length) {
                    const mapped = items.map(normalize);
                    if (mounted) setRows(mapped);
                } else {
                    if (mounted) setRows(defaultUsers);
                }
            })
            .catch((err: any) => {
                console.error('Error fetching users:', err);
                if (mounted) setRows(defaultUsers);
            })
            .finally(() => mounted && setLoading(false));

        return () => { mounted = false; };
    }, []);

    function hideDialog(): void {
        setEditDialog(false);
        setSelected(null);
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Users List</h2>

                <DataTable
                    value={rows}
                    dataKey="id"
                    loading={loading}
                    rowHover
                    stripedRows
                    responsiveLayout="scroll"
                    paginator
                    rows={10}
                    emptyMessage={loading ? 'Loading…' : 'No users found'}
                    className="p-datatable-hoverable"
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
                header={selected && selected.id ? "Edit User" : "Add User"}
                visible={editDialog}
                style={{ width: '600px' }}
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

                        {/* Username (Editable) */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="username">Username</label>
                            <InputText
                                id="username"
                                value={selected.username}
                                onChange={(e) => setSelected({ ...selected, username: e.target.value })}
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div className="flex flex-col gap-1">
                            <label>Email</label>
                            <InputText
                                value={selected.email}
                                readOnly
                                disabled
                                className="p-disabled"
                            />
                        </div>

                        {/* Role (Editable) */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="role">Role</label>
                            <Dropdown
                                id="role"
                                value={selected.role}
                                options={roleOptions}
                                onChange={(e) => setSelected({ ...selected, role: e.value })}
                                placeholder="Select a Role"
                            />
                        </div>

                        {/* Status (Editable) */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="status">Status</label>
                            <Dropdown
                                id="status"
                                value={selected.status}
                                options={statusOptions}
                                onChange={(e) => setSelected({ ...selected, status: e.value })}
                                placeholder="Select a Status"
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

export default Users;
