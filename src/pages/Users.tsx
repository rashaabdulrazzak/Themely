import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

const roleOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'User' },
    { label: 'Editor', value: 'Editor' },
];

const defaultUsers: User[] = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor' },
];

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>(defaultUsers);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEdit, setIsEdit] = useState(false);

    const openNew = () => {
        setEditingUser({ id: users.length + 1, name: '', email: '', role: 'User' });
        setIsEdit(false);
        setDialogVisible(true);
    };

    const openEdit = (user: User) => {
        setEditingUser({ ...user });
        setIsEdit(true);
        setDialogVisible(true);
    };

    const hideDialog = () => {
        setDialogVisible(false);
        setEditingUser(null);
    };

    const saveUser = () => {
        if (!editingUser) return;
        if (isEdit) {
            setUsers(users.map(u => (u.id === editingUser.id ? editingUser : u)));
        } else {
            setUsers([...users, editingUser]);
        }
        hideDialog();
    };

    const deleteUser = (user: User) => {
        setUsers(users.filter(u => u.id !== user.id));
    };

    const actionBodyTemplate = (rowData: User) => (
        <div>
            <Button icon="pi pi-pencil" className="p-button-text p-button-sm mr-2" onClick={() => openEdit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-text p-button-sm p-button-danger" onClick={() => deleteUser(rowData)} />
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Users</h2>
                <Button label="Add User" icon="pi pi-plus" onClick={openNew} />
            </div>
            <DataTable value={users} className="shadow rounded-lg">
                <Column field="id" header="ID" />
                <Column field="name" header="Name" />
                <Column field="email" header="Email" />
                <Column field="role" header="Role" />
                <Column body={actionBodyTemplate} header="Actions" style={{ width: '150px' }} />
            </DataTable>

            <Dialog header={isEdit ? 'Edit User' : 'Add User'} visible={dialogVisible} style={{ width: '400px' }} modal onHide={hideDialog}>
                <div className="p-fluid">
                    <div className="field mb-3">
                        <label htmlFor="name">Name</label>
                        <InputText
                            id="name"
                            value={editingUser?.name || ''}
                            onChange={e => setEditingUser(editingUser ? { ...editingUser, name: e.target.value } : null)}
                        />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            value={editingUser?.email || ''}
                            onChange={e => setEditingUser(editingUser ? { ...editingUser, email: e.target.value } : null)}
                        />
                    </div>
                    <div className="field mb-3">
                        <label htmlFor="role">Role</label>
                        <Dropdown
                            id="role"
                            value={editingUser?.role || 'User'}
                            options={roleOptions}
                            onChange={e => setEditingUser(editingUser ? { ...editingUser, role: e.value } : null)}
                            placeholder="Select a Role"
                        />
                    </div>
                </div>
                <div className="flex justify-content-end mt-4">
                    <Button label="Cancel" icon="pi pi-times" className="p-button-text mr-2" onClick={hideDialog} />
                    <Button label="Save" icon="pi pi-check" className="p-button-primary" onClick={saveUser} />
                </div>
            </Dialog>
        </div>
    );
};

export default Users;
