
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';

const SideBar = () =>{
    const [visible, setVisible] = useState(false);

    const items = [
       
        {
            label: 'Users',
            icon: 'pi pi-home',
             url: "/users",
        },
        {
            label: 'Canvases',
            icon: 'pi pi-car',
             url: "/canvases",
        },
        {
            label: 'Downloads',
            icon: 'pi pi-cloud',
            url: "/downloads",
        },
        {
            label: 'Payments',
            icon: 'pi pi-cloud',
            url: "/payments",
        },
        {
            label: 'Reviews',
            icon: 'pi pi-cloud',
             url: "/reviews",
        },
       

    ];
    const customHeader = (
        <div className="flex align-items-center gap-2">
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
            <h2 className="font-bold">Timply</h2>
        </div>
    );
 
    return (
        <div className="card flex justify-content-center">
        <Sidebar header={customHeader} visible={visible} onHide={() => setVisible(false)}>
        <PanelMenu model={items} className="w-full md:w-20rem" />
        </Sidebar>
        <Button icon="pi pi-align-justify" size="small" onClick={() => setVisible(true)} />
    </div>
    )
}
export default SideBar