import { Menubar } from "primereact/menubar";
import SideBar from "./SideBar";
import { Avatar } from "primereact/avatar";
import { useRef,  } from "react";
import { Menu } from "primereact/menu";
import { useNavigate } from "react-router-dom";


const NavBar = () =>{
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const menuLeft = useRef<any>(null);
const navigate = useNavigate()
 const items = [
    {
        label: 'Rasha',
        items: [
            {
                label: 'My Profile',
                icon: 'pi pi-user',
            },
            {
                label: 'Log Out',
                icon: 'pi pi-step-backward-alt',
                command:() => navigate('/login')
            }
        ]
    }
];
    const start = <SideBar/>
    const end = (
        < div className="flex flex-nowrap ">
            <i className="pi pi-bell mx-2 mt-3"  style={{ cursor: 'pointer' }}></i>
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" className="mx-2" 
            onClick={(event) => menuLeft.current.toggle(event)}  shape="circle" style={{cursor:'pointer'}} />
            <h3 className="mt-2 mr-2 font-bold	">Rasha</h3>

      </div>
    );
    return (
        <div className="card">
            <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
            <Menubar start={start} end={end} className="Navbar" />
        </div>
    )
}

export default NavBar;