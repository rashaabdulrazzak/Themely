import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const defaultUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin'
};

const canvases = [
    { id: 1, title: 'Canvas One', created: '2024-06-01', status: 'Active' },
    { id: 2, title: 'Canvas Two', created: '2024-06-02', status: 'Inactive' },
    { id: 3, title: 'Canvas Three', created: '2024-06-03', status: 'Active' }
];

const Downloads: React.FC = () => (
    <div className="p-6">
        <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="text-xl font-bold mb-2">User Info</h2>
            <div className="flex flex-col gap-1">
                <span><strong>Name:</strong> {defaultUser.name}</span>
                <span><strong>Email:</strong> {defaultUser.email}</span>
                <span><strong>Role:</strong> {defaultUser.role}</span>
            </div>
        </div>
        <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-bold mb-4">Downloads List</h2>
            <DataTable value={canvases} className="p-datatable-sm">
                <Column field="id" header="ID" />
                <Column field="title" header="Title" />
                <Column field="created" header="Created" />
                <Column field="status" header="Status" />
            </DataTable>
        </div>
    </div>
);

export default Downloads;