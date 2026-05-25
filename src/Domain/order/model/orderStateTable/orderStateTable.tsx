import React from 'react';

import {orderAPI} from "../../../../Infrastructure/services/OrderServices/OrderService";
import {useLocation} from "react-router-dom";
import {skipToken} from "@reduxjs/toolkit/query";


const OrderStateTable = () => {

    const location = useLocation()
    const {data: orderState} = orderAPI.useFetchAllOrderStateQuery(location.state?.order ? location.state?.order.id : skipToken)

    return (
        <>
            {orderState && orderState.length > 0 && (
                <div className="relative w-[98%] mx-auto px-4 h-80 overflow-y-auto flex flex-col">

                    {orderState.map((item, index) => {
                        /*const [date, time] = item.date.split(' ');*/
                        return (
                            <div key={index} className={`grid grid-cols-3 py-3 relative pl-8 text-sm `}>

                                <div className={`circle ${index === orderState.length - 1 ? 'circle-last' : ''}`}></div>
                                <div className="flex flex-col col-span-2"> {item.date} </div>
                                <span className={'text-left'}> {item.state} </span>

                                {index !== orderState.length - 1 && (
                                    <div className="vertical-line"></div>
                                )}

                            </div>
                        );
                    })}

                </div>
            )}
        </>
    );
};

export default OrderStateTable;
