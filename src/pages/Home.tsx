/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card } from "primereact/card";
/* import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'; */
import Charts from "../components/Charts";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import { getAnalytics } from "../services";

interface Metric {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  colorHex: string;
  trend?: number[];
}

const Home = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      title: "Total Users",
      value: 0,
      icon: "pi pi-users",
      color: "bg-[#dfedf4]",
      colorHex: "#595555",
      trend: [],
    },
    {
      title: "Active Users",
      value: 0,
      icon: "pi pi-user",
      color: "bg-[#d69db6]",
      colorHex: "#66BB6A",
      trend: [],
    },
    {
      title: "Total Revenue",
      value: 0,
      icon: "pi pi-dollar",
      color: "bg-[#8893d1]",
      colorHex: "#AB47BC",
      trend: [],
    },
    {
      title: "Total Templates",
      value: 0,
      icon: "pi pi-clone",
      color: "bg-[#c8e6c9]",
      colorHex: "#AED581",
      trend: [],
    },
    {
      title: "Popular Templates",
      value: 0,
      icon: "pi pi-star",
      color: "bg-[#81d4fa]",
      colorHex: "#0288d1",
      trend: [],
    },
    {
      title: "Total Downloads",
      value: 0,
      icon: "pi pi-download",
      color: "bg-[#ffdcdc]",
      colorHex: "#FF6384",
      trend: [],
    },
    {
      title: "Popular Downloads",
      value: 0,
      icon: "pi pi-star",
      color: "bg-[#ffe082]",
      colorHex: "#FFD700",
      trend: [],
    },
  ]);

  /*   const [recentActivity] = useState([
    { id: 1, user: 'John Doe', action: 'Downloaded Canvas One', date: '2025-08-13' },
    { id: 2, user: 'Jane Smith', action: 'Created Canvas Two', date: '2025-08-12' },
    { id: 3, user: 'Alice Johnson', action: 'Edited Canvas Three', date: '2025-08-11' },
    { id: 4, user: 'Bob Brown', action: 'Downloaded Canvas Two', date: '2025-08-10' },
    { id: 5, user: 'Carol White', action: 'Created Canvas Four', date: '2025-08-09' },
  ]); */

  const sampleAnalytics = {
    revenue: {
      total: 25000,
      monthly: [
        { month: "Jan", amount: 1500 },
        { month: "Feb", amount: 3000 },
        { month: "Mar", amount: 2700 },
        { month: "Apr", amount: 3100 },
        { month: "May", amount: 3500 },
        { month: "Jun", amount: 2500 },
      ],
    },
    users: {
      total: 1200,
      active: 430,
      new: 90,
    },
    templates: {
      total: 38,
      popular: [{}, {}, {}, {}, {}], // 5
    },
    downloads: {
      total: 18,
      popular: [{}, {}, {}, {}, {}], // 5
    },
    reviews: {
      average: 4.3,
      recent: [],
    },
  };

  const [analytics, setAnalytics] = useState<any>(null);
 const [chartLabels, setChartLabels] = useState<string[]>([]);
const [downloadsData, setDownloadsData] = useState<number[]>([]);
const [newUsersData, setNewUsersData] = useState<number[]>([]);
const [templateLabels, setTemplateLabels] = useState<string[]>([]);
const [createdData, setCreatedData] = useState<number[]>([]);
const [editedData, setEditedData] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchAnalytics = async () => {

      try {
        const result = await getAnalytics();
        const analyticsData = result?.data || result;
        setAnalytics(analyticsData);

        setMetrics([
          {
            title: "Total Users",
            value: analyticsData.users.total ?? 0,
            icon: "pi pi-users",
            color: "bg-[#dfedf4]",
            colorHex: "#595555",
            trend: [],
          },
          {
            title: "Active Users",
            value: analyticsData.users.active ?? 0,
            icon: "pi pi-user",
            color: "bg-[#d69db6]",
            colorHex: "#66BB6A",
            trend: [],
          },
          {
            title: "Total Revenue",
            value: Number(analyticsData.revenue.total).toFixed(2) ?? 0,
            icon: "pi pi-dollar",
            color: "bg-[#8893d1]",
            colorHex: "#AB47BC",
            trend: analyticsData.revenue.monthly.map((m: any) =>
              Number(m.amount).toFixed(2)
            ),
          },
          {
            title: "Total Templates",
            value: analyticsData.templates.total ?? 0,
            icon: "pi pi-clone",
            color: "bg-[#c8e6c9]",
            colorHex: "#AED581",
            trend: [],
          },
          {
            title: "Popular Templates",
            value: analyticsData.templates.popular?.length ?? 0,
            icon: "pi pi-star",
            color: "bg-[#81d4fa]",
            colorHex: "#0288d1",
            trend: [],
          },
          {
            title: "Total Downloads",
            value: analyticsData.downloads.total ?? 0,
            icon: "pi pi-download",
            color: "bg-[#ffdcdc]",
            colorHex: "#FF6384",
            trend: [],
          },
          {
            title: "Popular Downloads",
            value: analyticsData.downloads.popular?.length ?? 0,
            icon: "pi pi-star",
            color: "bg-[#ffe082]",
            colorHex: "#FFD700",
            trend: [],
          },
        ]);
        setChartLabels(Array.isArray(analyticsData.monthlyStats) ? analyticsData.monthlyStats.map((m:any) => m.month) : []);
setDownloadsData(Array.isArray(analyticsData.monthlyStats) ? analyticsData.monthlyStats.map((m:any) => m.downloads) : []);
setNewUsersData(Array.isArray(analyticsData.monthlyStats) ? analyticsData.monthlyStats.map((m:any) => m.newUsers) : []);

setTemplateLabels(Array.isArray(analyticsData.templateMonthlyStats) ? analyticsData.templateMonthlyStats.map((m:any) => m.month) : []);
setCreatedData(Array.isArray(analyticsData.templateMonthlyStats) ? analyticsData.templateMonthlyStats.map((m:any) => m.created) : []);
setEditedData(Array.isArray(analyticsData.templateMonthlyStats) ? analyticsData.templateMonthlyStats.map((m:any) => m.edited) : []);

      } catch (err) {
        console.error("Error fetching analytics:", err);
        setAnalytics(sampleAnalytics);
        setMetrics([
          {
            title: "Total Users",
            value: sampleAnalytics.users.total,
            icon: "pi pi-users",
            color: "bg-[#dfedf4]",
            colorHex: "#595555",
            trend: [],
          },
          {
            title: "Active Users",
            value: sampleAnalytics.users.active,
            icon: "pi pi-user",
            color: "bg-[#d69db6]",
            colorHex: "#66BB6A",
            trend: [],
          },
          {
            title: "Total Revenue",
            value: sampleAnalytics.revenue.total,
            icon: "pi pi-dollar",
            color: "bg-[#8893d1]",
            colorHex: "#AB47BC",
            trend: [],
          },
          {
            title: "Total Templates",
            value: sampleAnalytics.templates.total,
            icon: "pi pi-clone",
            color: "bg-[#c8e6c9]",
            colorHex: "#AED581",
            trend: [],
          },
          {
            title: "Popular Templates",
            value: sampleAnalytics.templates.popular?.length ?? 0,
            icon: "pi pi-star",
            color: "bg-[#81d4fa]",
            colorHex: "#0288d1",
            trend: [],
          },
          {
            title: "Total Downloads",
            value: sampleAnalytics.downloads.total,
            icon: "pi pi-download",
            color: "bg-[#ffdcdc]",
            colorHex: "#FF6384",
            trend: [],
          },
          {
            title: "Popular Downloads",
            value: sampleAnalytics.downloads.popular?.length ?? 0,
            icon: "pi pi-star",
            color: "bg-[#ffe082]",
            colorHex: "#FFD700",
            trend: [],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    console.log("Fetching analytics data...",loading, analytics);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* First Row: 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.slice(0, 4).map((metric, i) => (
          <Card
            key={i}
            className="p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-semibold">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
              <div className={`p-3 text-white rounded-full ${metric.color}`}>
                <i className={`pi ${metric.icon} text-xl`}></i>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* Second Row: 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.slice(4).map((metric, i) => (
          <Card
            key={i}
            className="p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-semibold">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
              <div className={`p-3 text-white rounded-full ${metric.color}`}>
                <i className={`pi ${metric.icon} text-xl`}></i>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-bold mb-2">Monthly Downloads</h3>
          <Charts
            labels={chartLabels}
            datasets={[
              { type: "bar", label: "Downloads", data: downloadsData },
              {
                type: "line",
                label: "New Users",
                data: newUsersData,
                color: "#dfedf4",
              },
            ]}
          />
        </Card>
        {/* <Card className="p-4 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-bold mb-2">New Users Growth</h3>
          <Charts
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
            datasets={[
              {
                type: "bar",
                label: "Signups",
                data: [50, 70, 60, 90, 100, 80, 110],
                color: "#d69db6",
              },
              {
                type: "line",
                label: "Active Users",
                data: [40, 60, 50, 80, 90, 70, 100],
                color: "#29B6F6",
              },
            ]}
          />
        </Card> */}
        <Card className="p-4 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-bold mb-2">Template Activity</h3>
          <Charts
            labels={templateLabels}
            datasets={[
              {
                type: "bar",
                label: "Created",
                data: createdData,
                color: "#AB47BC",
              },
              {
                type: "line",
                label: "Edited",
                data: editedData,
                color: "#8893d1",
              },
            ]}
          />
        </Card>
       {/*  <Card className="p-4 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-bold mb-2">Downloads by Canvas</h3>
          <Charts
            labels={[
              "Canvas 1",
              "Canvas 2",
              "Canvas 3",
              "Canvas 4",
              "Canvas 5",
            ]}
            datasets={[
              {
                type: "bar",
                label: "Downloads",
                data: [120, 80, 150, 90, 60],
                color: "#fde4a5",
              },
              {
                type: "line",
                label: "Views",
                data: [200, 180, 250, 190, 160],
                color: "#FFCA28",
              },
            ]}
          />
        </Card> */}
      </div>

      {/* Recent Activity Table */}
      {/*   <Card className="p-4 rounded-xl shadow hover:shadow-lg transition">
        <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
        <DataTable value={recentActivity} responsiveLayout="scroll" className="p-datatable-striped p-datatable-hoverable">
          <Column field="id" header="ID" sortable style={{ minWidth: '3rem' }} />
          <Column field="user" header="User" sortable style={{ minWidth: '10rem' }} />
          <Column field="action" header="Action" style={{ minWidth: '15rem' }} />
          <Column field="date" header="Date" sortable style={{ minWidth: '8rem' }} />
        </DataTable>
      </Card> */}
    </div>
  );
};

export default Home;
