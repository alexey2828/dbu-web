import React, {Dispatch, FC, SetStateAction} from 'react';
import {RouteConfig} from "../../Config/RouteConfig/routeConfig";
import {Route, Routes} from "react-router-dom";
import Header from "./Header/Header";

interface IRouteComponent {
    isOpenedSideBar: boolean;
    setIsOpenSidebar: Dispatch<SetStateAction<boolean>>;
}

const RouteComponent: FC<IRouteComponent> = ({isOpenedSideBar, setIsOpenSidebar}) => {

    return (
        <div className='flex-1'>
            <Routes>
                {Object.values(RouteConfig).map(({element, path, name}) =>
                    <Route
                        key={path}
                        path={path}
                        element={(
                            <div>
                                <Header key={path} name={name} isOpenedSideBar={isOpenedSideBar} setIsOpenedSideBar={setIsOpenSidebar} />
                                <div className={'pt-[89px]'}>{element}</div>
                            </div>
                        )}
                    />
                )}
            </Routes>
        </div>

    );
};

export default RouteComponent;