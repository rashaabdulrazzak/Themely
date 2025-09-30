import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { getPayments, deletePayment } from "../services"; 
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import type { Payment } from "../modules";



const initialPayments: Payment[] = [
  { id: 1, amount: 120.50, status: "COMPLETED", paymentMethod: "CREDIT", created: "2024-06-01", user: "John Doe", userId: 1 },
  { id: 2, amount: 250.00, status: "PENDING", paymentMethod: "CREDIT", created: "2024-06-02", user: "Jane Smith", userId: 2 },
];

const Payments: React.FC = () => {
  const [rows, setRows] = useState<Payment[]>(initialPayments);
  const [loading, setLoading] = useState(true);


  // ---- helpers
  const getSeverity = (status: string) => {
    switch (status) {
      case 'FAILED': return 'danger';
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      default: return undefined;
    }
  };

  const statusBodyTemplate = (rowData: Payment) => (
    <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
  );

  const amountBodyTemplate = (rowData: Payment) => (
    <span>${rowData.amount.toFixed(2)}</span>
  );

  const actionBodyTemplate = (rowData: Payment) => (
    <div className="flex gap-2">
 
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-sm p-button-danger"
        onClick={() => handleDelete(rowData)}
        aria-label={`Delete payment ${rowData.id}`}
      />
    </div>
  );



  const handleDelete = async (p: Payment) => {
    if (window.confirm(`Are you sure you want to delete payment of $${p.amount}?`)) {
      try {
        const deletedPayment = await deletePayment(p.id.toString());
        console.log("Deleted payment...", deletedPayment);
        setRows(prev => prev.filter(x => x.id !== p.id));
      } catch (error) {
        console.error("Error deleting payment:", error);
        // Handle error - show toast or error message
      }
    }
  };



  // Extract array from common API shapes (axios/fetch/backends with {data:{...}})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const normalize = (r: any): Payment => ({
    id: r.id ?? r._id ?? r.uuid ?? r.key,
    amount: r.amount ?? 0,
    status: r.status ?? 'PENDING',
    paymentMethod: r.paymentMethod ?? r.payment_method ?? 'CREDIT',
    transactionId: r.transactionId ?? r.transaction_id ?? r.transactionId,
    notes: r.notes ?? r.note ?? '',
    created: r.createdAt
      ? new Date(r.createdAt).toISOString().slice(0, 10)
      : (r.created ? new Date(r.created).toISOString().slice(0, 10) : ''),
    user: r.user?.name ?? r.user?.username ?? r.user ?? 'N/A',
    userId: r.userId ?? r.user_id ?? r.user?.id ?? 'N/A',
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getPayments()
      .then((res: any) => {
        const items = extractItems(res);
        if (items.length) {
          const mapped = items.map(normalize);
          if (mounted) setRows(mapped);
        } else {
          if (mounted) setRows(initialPayments);
        }
      })
      .catch((err: any) => {
        console.error('Error fetching payments:', err);
        if (mounted) setRows(initialPayments);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Payments List</h2>

        <DataTable
          value={rows}
          dataKey="id"
          loading={loading}
          rowHover
          stripedRows
          responsiveLayout="scroll"
          paginator
          rows={10}
          emptyMessage={loading ? 'Loading…' : 'No payments found'}
          className="p-datatable-hoverable"
        >
          <Column field="id" header="ID" sortable />
          <Column field="amount" header="Amount" body={amountBodyTemplate} sortable />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable />
          <Column field="paymentMethod" header="Payment Method" sortable />
          <Column field="transactionId" header="Transaction ID" sortable />
          <Column field="created" header="Created" sortable filter filterPlaceholder="Search by date" />
          <Column field="userId" header="User ID" sortable />
          <Column field="user" header="User" sortable filter filterPlaceholder="Search by user" />
          <Column header="Actions" body={actionBodyTemplate} />
        </DataTable>
      </div>

 
    </div>
  );
};

export default Payments;
