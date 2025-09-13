import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { getUsers } from '../services';

type User = {
    id: number;
    username: string;
    email: string;
    role: string;
};

const roleOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'User' },
    { label: 'Editor', value: 'Editor' },
];

const defaultUsers: User[] = [
    { id: 1, username: 'Alice Smith', email: 'alice@example.com', role: 'Admin' },
    { id: 2, username: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
    { id: 3, username: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor' },
];

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>(defaultUsers);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEdit, setIsEdit] = useState(false);
      const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);        // current page
    const [limit, setLimit] = useState(10);     // items per page
    const [totalRecords, setTotalRecords] = useState(0);

      useEffect(() => {
        // Fetch templates from API (expects an array of Template)
        getUsers()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((res: any) => {
            // Accept either res.data or res
            console.log('Fetched .....:', res.pagination.totalUsers );
            const data = Array.isArray(res) ? res : res?.data?.data;
            if (Array.isArray(data) && data.length) {
                console.log('Fetched templates:', res.data.data || res);
              setUsers(data);
              setTotalRecords(res.pagination.totalUsers || data.length); 
                setPage(res.pagination.page || 1);
                setLimit(res.pagination.limit || 10);
    
            } else {
              // Use sample data if API returns empty or invalid data
              setUsers(defaultUsers);
            }
            setLoading(false);
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((err: any) => {
            console.error('Error fetching users:', err);
           
            setUsers(defaultUsers);
            setLoading(false);
          });
      }, []); // Empty dependency array to run only once
    const openNew = () => {
        setEditingUser({ id: users.length + 1, username: '', email: '', role: 'User' });
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
            <Button icon="pi pi-pencil" className="p-button-text p-button-sm edit-btn mr-2" onClick={() => openEdit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-text p-button-sm p-button-danger" onClick={() => deleteUser(rowData)} />
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Users</h2>
                <Button label="Add User" className='add-btn' icon="pi pi-plus" onClick={openNew} />
            </div>
            <DataTable value={users} loading={loading} 
          totalRecords={totalRecords}
   rows={10}
            first={(page - 1) * limit}
          onPage={(e) => {
    const newPage = Math.floor(e.first / e.rows) + 1;
    setPage(newPage);
    setLimit(e.rows); // in case user changed rows per page
  }}
            className="shadow rounded-lg">
                <Column field="id" header="ID" />
                <Column field="username" header="Name" />
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
                            value={editingUser?.username || ''}
                            onChange={e => setEditingUser(editingUser ? { ...editingUser, username: e.target.value } : null)}
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
                    <Button label="Save" icon="pi pi-check" className=" p-button-sm save-btn mr-2" onClick={saveUser} />
                    <Button label="Cancel" icon="pi pi-times"className="p-button-sm cancel-btn"  onClick={hideDialog} />
                    
                </div>
            </Dialog>
        </div>
    );
};

export default Users;
