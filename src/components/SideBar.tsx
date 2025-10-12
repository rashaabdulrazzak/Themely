import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { navbarConfig, navbarConfigLower, getPanelMenuItems } from '../config/config';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook

const SideBar = () => {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth(); // Get user from AuthContext

  // Get menu items based on user role
  const items = user?.role 
    ? getPanelMenuItems(user.role, navbarConfig)
    : [];
    
  const itemsLower = user?.role 
    ? getPanelMenuItems(user.role, navbarConfigLower)
    : [];

  const customHeader = (
    <div className="flex align-items-center justify-content-between flex-shrink-0">
      <span className="inline-flex align-items-center gap-2">
        <Avatar 
          image="https://thimly.com/assets/black-01-removebg-preview-Bo65H6jM.png" 
          shape="circle" 
          size="xlarge"
        />
      </span>
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Sidebar header={customHeader} visible={visible} onHide={() => setVisible(false)}>
        <div className="flex flex-col h-full">
          <PanelMenu model={items} className="w-full md:w-20rem" />
          <hr className='my-3 mx-3' />

          <PanelMenu model={itemsLower} className="w-full md:w-20rem" />
          <div className="mt-auto">
            <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
            <a className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
              <Avatar 
                image={user?.avatar || "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"} 
                shape="circle" 
              />
              <span className="font-bold">{user?.name || "Guest User"}</span>
            </a>
          </div>
        </div>
      </Sidebar>

      <Button 
        className="menu-btn" 
        icon="pi pi-align-justify" 
        size="small" 
        onClick={() => setVisible(true)} 
      />
    </div>
  );
};

export default SideBar;
