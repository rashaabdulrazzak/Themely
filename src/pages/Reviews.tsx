import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Rating } from 'primereact/rating';
import { getReviews, deleteReview } from "../services"; // Import your API functions
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import type { Review } from "../modules";



const initialReviews: Review[] = [
  { id: 1, comment: "Great product!", rate: 5, created: "2024-06-01", user: "Alice", userId: 1 },
  { id: 2, comment: "Could be better.", rate: 3, created: "2024-06-02", user: "Bob", userId: 2 },
  { id: 3, comment: "Excellent support.", rate: 4, created: "2024-06-03", user: "Charlie", userId: 3 },
];

const Reviews: React.FC = () => {
  const [rows, setRows] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(true);
 

  // ---- helpers
  const ratingBodyTemplate = (rowData: Review) => (
    <Rating value={rowData.rate} readOnly cancel={false} />
  );

  const commentBodyTemplate = (rowData: Review) => (
    <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={rowData.comment}>
      {rowData.comment}
    </div>
  );

  const actionBodyTemplate = (rowData: Review) => (
    <div className="flex gap-2">
    
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-sm p-button-danger"
        onClick={() => handleDelete(rowData)}
        aria-label={`Delete review ${rowData.id}`}
      />
    </div>
  );


  const handleDelete = async (r: Review) => {
    if (window.confirm(`Are you sure you want to delete this review?`)) {
      try {
        const deletedReview = await deleteReview(r.id.toString());
        console.log("Deleted review...", deletedReview);
        setRows(prev => prev.filter(x => x.id !== r.id));
      } catch (error) {
        console.error("Error deleting review:", error);
        // Handle error - show toast or error message
      }
    }
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
  const normalize = (r: any): Review => ({
    id: r.id ?? r._id ?? r.uuid ?? r.key,
    comment: r.comment ?? r.review ?? r.text ?? '',
    rate: r.rate ?? r.rating ?? r.stars ?? 1,
    created: r.createdAt
      ? new Date(r.createdAt).toISOString().slice(0, 10)
      : (r.created ? new Date(r.created).toISOString().slice(0, 10) : ''),
    user: r.user?.name ?? r.user?.username ?? r.user ?? 'N/A',
    userId: r.userId ?? r.user_id ?? r.user?.id ?? 'N/A',
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getReviews()
      .then((res: any) => {
        const items = extractItems(res);
        if (items.length) {
          const mapped = items.map(normalize);
          if (mounted) setRows(mapped);
        } else {
          if (mounted) setRows(initialReviews);
        }
      })
      .catch((err: any) => {
        console.error('Error fetching reviews:', err);
        if (mounted) setRows(initialReviews);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Reviews List</h2>

        <DataTable
          value={rows}
          dataKey="id"
          loading={loading}
          rowHover
          stripedRows
          responsiveLayout="scroll"
          paginator
          rows={10}
          emptyMessage={loading ? 'Loading…' : 'No reviews found'}
          className="p-datatable-hoverable"
        >
          <Column field="id" header="ID" sortable />
          <Column field="comment" header="Comment" body={commentBodyTemplate} sortable filter filterPlaceholder="Search by comment" />
          <Column field="rate" header="Rating" body={ratingBodyTemplate} sortable />
          <Column field="created" header="Created" sortable filter filterPlaceholder="Search by date" />
          <Column field="userId" header="User ID" sortable />
          <Column field="user" header="User" sortable filter filterPlaceholder="Search by user" />
          <Column header="Actions" body={actionBodyTemplate} />
        </DataTable>
      </div>


    </div>
  );
};

export default Reviews;
