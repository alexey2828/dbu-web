import React, {useState} from 'react';
import './App.css';
import RouteComponent from "./ui/Components/RouteComponent";
import SideBar from "./ui/Components/SideBar/sideBar";
import DirectoryModalManager from './Pages/directoryPage/DirectoryModalManager';
import Notification from "./ui/Components/Notification/Notification";
import Loader from "./ui/Components/Loader/Loader";

function App() {

    const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
    return (
        <div className="flex">

            <SideBar isOpened={isOpenSidebar} setIsOpened={setIsOpenSidebar} />
            <RouteComponent isOpenedSideBar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar} />
            <DirectoryModalManager />
            <Notification />
        </div>
    );
}

export default App;