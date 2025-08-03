import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

const defaultUsers: User[] = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor' },
];

const Users: React.FC = () => (
    <div className="p-6">
        <DataTable value={defaultUsers} className="shadow rounded-lg">
            <Column field="id" header="ID" />
            <Column field="name" header="Name" />
            <Column field="email" header="Email" />
            <Column field="role" header="Role" />
        </DataTable>
    </div>
);

export default Users;
