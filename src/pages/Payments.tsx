import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

interface Payment {
    id: number;
    payer: string;
    amount: number;
    date: string;
}

const initialPayments: Payment[] = [
    { id: 1, payer: "John Doe", amount: 120, date: "2024-06-01" },
    { id: 2, payer: "Jane Smith", amount: 250, date: "2024-06-02" },
];

export default function Payments() {
    const [payments, setPayments] = useState<Payment[]>(initialPayments);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [form, setForm] = useState<Payment>({
        id: 0,
        payer: "",
        amount: 0,
        date: "",
    });

    const openNew = () => {
        setForm({ id: 0, payer: "", amount: 0, date: "" });
        setIsEdit(false);
        setDialogVisible(true);
    };

    const openEdit = (payment: Payment) => {
        setForm(payment);
        setIsEdit(true);
        setDialogVisible(true);
    };

    const hideDialog = () => {
        setDialogVisible(false);
    };

    const savePayment = () => {
        if (isEdit) {
            setPayments(payments.map(p => (p.id === form.id ? form : p)));
        } else {
            setPayments([...payments, { ...form, id: Date.now() }]);
        }
        setDialogVisible(false);
    };

    const deletePayment = (payment: Payment) => {
        setPayments(payments.filter(p => p.id !== payment.id));
    };

    const actionBodyTemplate = (rowData: Payment) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-info p-button-sm"
                onClick={() => openEdit(rowData)}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-sm"
                onClick={() => deletePayment(rowData)}
            />
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Payments</h2>
                <Button label="Add Payment" icon="pi pi-plus" onClick={openNew} />
            </div>
            <DataTable
                value={payments}
                selectionMode="single"
                selection={selectedPayment}
               // onSelectionChange={e => setSelectedPayment(e.value)}
                className="shadow rounded"
                paginator
                rows={5}
                responsiveLayout="scroll"
            >
                <Column field="payer" header="Payer" sortable />
                <Column field="amount" header="Amount" sortable />
                <Column field="date" header="Date" sortable />
                <Column body={actionBodyTemplate} header="Actions" />
            </DataTable>

            <Dialog
                header={isEdit ? "Edit Payment" : "New Payment"}
                visible={dialogVisible}
                style={{ width: "400px" }}
                modal
                onHide={hideDialog}
                footer={
                    <div>
                        <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} className="p-button-text" />
                        <Button label="Save" icon="pi pi-check" onClick={savePayment} autoFocus />
                    </div>
                }
            >
                <div className="flex flex-col gap-4">
                    <span className="p-float-label">
                        <InputText
                            id="payer"
                            value={form.payer}
                            onChange={e => setForm({ ...form, payer: e.target.value })}
                            className="w-full"
                        />
                        <label htmlFor="payer">Payer</label>
                    </span>
                    <span className="p-float-label">
                        <InputText
                            id="amount"
                            type="number"
                          //  value={form.amount}
                            onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
                            className="w-full"
                        />
                        <label htmlFor="amount">Amount</label>
                    </span>
                    <span className="p-float-label">
                        <InputText
                            id="date"
                            type="date"
                            value={form.date}
                            onChange={e => setForm({ ...form, date: e.target.value })}
                            className="w-full"
                        />
                        <label htmlFor="date">Date</label>
                    </span>
                </div>
            </Dialog>
        </div>
    );
}