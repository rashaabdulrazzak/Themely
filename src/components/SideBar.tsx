
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';

const SideBar = () =>{
    const [visible, setVisible] = useState(false);

    const items = [
        {
            label: 'Products',
            icon: 'pi pi-home',
        },
        {
            label: 'Orders',
            icon: 'pi pi-car',
        },
        {
            label: 'Stores',
            icon: 'pi pi-cloud',
        }
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