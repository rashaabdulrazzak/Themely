import { Menubar } from "primereact/menubar";
import SideBar from "./SideBar";
import { Avatar } from "primereact/avatar";
import { useRef,  } from "react";
import { Menu } from "primereact/menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


const NavBar = () =>{
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const menuLeft = useRef<any>(null);
const navigate = useNavigate()
const { logout } = useAuth();
const logOut = () =>{
    logout();
    navigate('/')
}
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
                icon: 'pi pi pi-sign-out',
                 command:() => logOut()
            }
        ]
    }
];
    const start = <SideBar/>
const end = (
  <div className="flex items-center space-x-3 pr-6 ml-6" >
    <i
      className="pi pi-bell text-lg cursor-pointer"
    ></i>

    <Avatar
      image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
      className="cursor-pointer w-10 h-10"
      onClick={(event) => menuLeft.current.toggle(event)}
      shape="circle"
    />

    {/* <h3 className="font-bold">Rasha</h3> */}
  </div>
);


    return (
        <div className="card ">
            <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
            <Menubar start={start} end={end} className="Navbar" />
        </div>
    )
}

export default NavBar;