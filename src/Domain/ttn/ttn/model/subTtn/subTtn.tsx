import React, {useEffect, useState} from 'react';
import {skipToken} from "@reduxjs/toolkit/query";
import TtnTableByOrder from "../ttnTableByOrder/ttnTableByOrder";
import TtnStateTable from '../ttnStateTable/ttnStateTable';
import TtnPanelTool from "../ttnPanelTools/ttnPanelTool";
import TtnStatePanelTool from "../ttnPanelTools/ttnStatePanelTool";
import {ttnAPI} from "../../../../../Infrastructure/services/TtnServices/TtnService";
import {ITtn} from "../../const/ttn";
import {useLocation} from "react-router-dom";
import {useCurrentItems} from "../../../../../Infrastructure/hooks/useCurrentItems";
import globalStyles from '../../../../../global.module.scss'

const SubTtn = () => {

    const location = useLocation()
    const {currentTtn} = useCurrentItems()
    const {data: ttnState, isLoading, isSuccess} = ttnAPI.useFetchTtnStateQuery(currentTtn?.id ? currentTtn.id: skipToken)
    const {data: ttnByOrderId, isLoading: isLoadingTtnByOrderId} = ttnAPI.useFetchTtnByOrderIdQuery(location.state ? location.state.order.id: skipToken,
        {
            pollingInterval: 5000,
            skipPollingIfUnfocused: true,
        }
    );
    const [currentTtnByOrderId, setCurrentTtnByOrderId] =
        useState<ITtn[] | undefined>()

    useEffect(() => {
        setCurrentTtnByOrderId(ttnByOrderId)
    }, [ttnByOrderId, setCurrentTtnByOrderId]);

    return (
        <div className={'grid grid-cols-10 border-b border-gray-300'}>

            <div className={'col-span-8'}>
                <TtnPanelTool
                    ttnByOrderId = {ttnByOrderId}
                    setCurrentTtnByOrderId = {setCurrentTtnByOrderId}
                    currentTtnByOrderId = {currentTtnByOrderId}
                    isSuccessTtnByOrderId = {isSuccess}
                />
                <div className={`${globalStyles.container}`}>
                    <TtnTableByOrder
                        isLoadingTtnState = {isLoading}
                        isLoadingTtnByOrderId = {isLoadingTtnByOrderId}
                        ttnByOrderId = {currentTtnByOrderId}
                    />
                </div>
            </div>

            <div className={'col-span-2 border-l-2 border-gray-300 '}>
                <TtnStatePanelTool  />
                <div className={`${globalStyles.container}`}>
                    <TtnStateTable ttnState={ttnState} isLoadingTtnState = {isLoading}/>
                </div>
            </div>
        </div>
    );
};

export default SubTtn;
