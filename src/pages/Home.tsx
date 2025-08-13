import  { useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Charts from '../components/Charts';
 import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';

const Home = () => {
    // Overview cards
    const metrics = [
        { title: 'Total Users', value: 1200, icon: 'pi pi-users', color: 'bg-[#dfedf4]', colorHex: '#595555', trend: [1000, 1050, 1100, 1150, 1200] },
        { title: 'Active Canvases', value: 350, icon: 'pi pi-pencil', color: 'bg-[#d69db6]', colorHex: '#66BB6A', trend: [300, 310, 320, 340, 350] },
        { title: 'Downloads Today', value: 480, icon: 'pi pi-download', color: 'bg-[#8893d1]', colorHex: '#AB47BC', trend: [400, 420, 450, 470, 480] },
        { title: 'Pending Approvals', value: 12, icon: 'pi pi-clock', color: 'bg-[#fde4a5]', colorHex: '#FFCA28', trend: [5, 8, 10, 11, 12] },
    ];

    // Dummy recent activity
    const [recentActivity] = useState([
        { id: 1, user: 'John Doe', action: 'Downloaded Canvas One', date: '2025-08-13' },
        { id: 2, user: 'Jane Smith', action: 'Created Canvas Two', date: '2025-08-12' },
        { id: 3, user: 'Alice Johnson', action: 'Edited Canvas Three', date: '2025-08-11' },
        { id: 4, user: 'Bob Brown', action: 'Downloaded Canvas Two', date: '2025-08-10' },
        { id: 5, user: 'Carol White', action: 'Created Canvas Four', date: '2025-08-09' },
    ]);

    return (
        <div className="p-6 space-y-6">

            {/* Overview Cards with Sparklines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => (
                    <Card key={i} className="p-4 rounded-xl shadow hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 font-semibold">{metric.title}</p>
                                <p className="text-2xl font-bold">{metric.value}</p>
                            </div>
                            <div className={`p-3 text-white rounded-full ${metric.color}`}>
                                <i className={`pi ${metric.icon} text-xl`}></i>
                            </div>
                        </div>
                        {/* Mini Sparkline */}
                 {/*    <div className="mt-2 h-16 w-full">
                        <Sparkline data={metric.trend} color={metric.colorHex} />
                    </div> */}
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4 rounded-xl shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-bold mb-2">Monthly Downloads</h3>
                    <Charts
                        labels={['Jan','Feb','Mar','Apr','May','Jun','Jul']}
                        datasets={[
                            { type: 'bar', label: 'Downloads', data: [65, 59, 80, 81, 56, 55, 40] },
                            { type: 'line', label: 'New Users', data: [28,48,40,19,86,27,90], color: '#dfedf4' }
                        ]}
                    />
                </Card>
                <Card className="p-4 rounded-xl shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-bold mb-2">New Users Growth</h3>
                    <Charts
                        labels={['Jan','Feb','Mar','Apr','May','Jun','Jul']}
                        datasets={[
                            { type: 'bar', label: 'Signups', data: [50,70,60,90,100,80,110], color: '#d69db6' },
                            { type: 'line', label: 'Active Users', data: [40,60,50,80,90,70,100], color: '#29B6F6' }
                        ]}
                    />
                </Card>
                <Card className="p-4 rounded-xl shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-bold mb-2">Canvas Activity</h3>
                    <Charts
                        labels={['Jan','Feb','Mar','Apr','May','Jun','Jul']}
                        datasets={[
                            { type: 'bar', label: 'Created', data: [20,30,25,35,40,30,50], color: '#AB47BC' },
                            { type: 'line', label: 'Edited', data: [10,25,20,30,35,25,40], color: '#8893d1' }
                        ]}
                    />
                </Card>
                <Card className="p-4 rounded-xl shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-bold mb-2">Downloads by Canvas</h3>
                    <Charts
                        labels={['Canvas 1','Canvas 2','Canvas 3','Canvas 4','Canvas 5']}
                        datasets={[
                            { type: 'bar', label: 'Downloads', data: [120,80,150,90,60], color: '#fde4a5' },
                            { type: 'line', label: 'Views', data: [200,180,250,190,160], color: '#FFCA28' }
                        ]}
                    />
                </Card>
            </div>

            {/* Recent Activity Table */}
            <Card className="p-4 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                <DataTable value={recentActivity} responsiveLayout="scroll" className="p-datatable-striped p-datatable-hoverable">
                    <Column field="id" header="ID" sortable style={{ minWidth: '3rem' }} />
                    <Column field="user" header="User" sortable style={{ minWidth: '10rem' }} />
                    <Column field="action" header="Action" style={{ minWidth: '15rem' }} />
                    <Column field="date" header="Date" sortable style={{ minWidth: '8rem' }} />
                </DataTable>
            </Card>

        </div>
    );
};

export default Home;
