import React, {useEffect, useState} from 'react';
import CurrentLoopCalculateTable
    from "../../Domain/reports/currentLoopCalculate/model/currentLoopCalculateTable/currentLoopCalculateTable";
import BsuBreakdownTable
    from "../../Domain/reports/currentLoopCalculate/model/bsuBreakdownTable/BsuBreakdownTable";
import ReportProductTable from "../../Domain/reports/model/reportProductTable/reportProductTable";
import ReportProductPanelTool from "../../Domain/reports/model/reportsPanelTool/reportProductPanelTool";
import {reportsAPI} from "../../Infrastructure/services/ReportsServices/ReportsService";
import ReportsCarTable from "../../Domain/reports/reportsCar/model/reportsCarTable/reportsCarTable";
import ReportCarPanelTool from "../../Domain/reports/model/reportsPanelTool/reportCarPanelTool";
import {IReports} from "../../Domain/reports/const/reports";
import globalStyles from '../../global.module.scss'
import {useTranslation} from "react-i18next";
import { tKey } from "../../Infrastructure/i18n/tKey";

const ReportsPage = () => {

    const {data, isLoading: isLoadingAllCurrentLoopCalculate} = reportsAPI.useFetchAllCurrentLoopCalculateQuery('');
    const [currentLoopData, setCurrentLoopData] = useState<IReports | undefined>()
    const [isVisibleCarTable, setIsVisibleCarTable] = useState<boolean>(false)
    const {t} = useTranslation();
    const [trigger, {data: currentLoopById, isLoading, isSuccess}] = reportsAPI
        .useLazyFetchAllCurrentLoopCalculateQuery()
    const [isCleared, setIsCleared] = useState<boolean>(false)
    const [isBsuFilterApplied, setIsBsuFilterApplied] = useState(false)
    const [isApplyingFilters, setIsApplyingFilters] = useState(false)

    useEffect(() => {
        data && setCurrentLoopData(data)
    }, [data]);


    /*useEffect(() => {
        try {
            const raw = localStorage.getItem('filteredReports');
            if (raw) {
                const parsed = JSON.parse(raw) as { bsuCode?: string };
                setIsBsuFilterApplied(Boolean(parsed.bsuCode));
            }
        } catch {
            /!* ignore *!/
        }
        return () => {
            setIsBsuFilterApplied(false)
        }
    }, []);*/

    return (
        <div className="overflow-x-hidden">

            <div className={'grid grid-cols-12'}>
                <ReportProductPanelTool
                    setCurrentLoopData={setCurrentLoopData}
                    setIsVisibleCarTable={setIsVisibleCarTable}
                    triggerCurrentLoop = {trigger}
                    setIsCleared = {setIsCleared}
                    setIsBsuFilterApplied={setIsBsuFilterApplied}
                    setIsApplyingFilters={setIsApplyingFilters}
                />

                <div className={`col-span-8 ${globalStyles.indent_top}`}>
                    <ReportProductTable
                        data={currentLoopData}
                        setCurrentLoopData={setCurrentLoopData}
                        isLoadingAllCurrentLoopCalculate={isLoadingAllCurrentLoopCalculate}
                        triggerCurrentLoopCalculate = {trigger}
                        currentLoop = {currentLoopById}
                        isCleared = {isCleared}
                        setIsCleared = {setIsCleared}
                        isApplyingFilters={isApplyingFilters}
                    />
                </div>

                <div className={'col-span-4'}>
                    {/*<ReportLoopCalculatePanelTool/>*/}
                    <div className={`${globalStyles.container} ${globalStyles.indent_top}`}>
                        <CurrentLoopCalculateTable
                            data={currentLoopData}
                            isLoadingAllCurrentLoopCalculate={isLoadingAllCurrentLoopCalculate}
                            isApplyingFilters={isApplyingFilters}
                        />
                        <div className={`${globalStyles.indent_top} font-bold`}>
                            {tKey(t, 'reports.currentLoopCalculateHeader.completedProductVolume')}: {currentLoopData?.totalVProduct.toFixed(2)} м3
                            <br/>
                            {tKey(t, 'reports.currentLoopCalculateHeader.totalVProductExpected')}: {currentLoopData?.totalVProductExpected.toFixed(2)} м3
                        </div>
                        {isBsuFilterApplied ?
                            <BsuBreakdownTable currentLoopData = {currentLoopData}/> :
                            null
                        }
                    </div>
                </div>
            </div>


            <ReportCarPanelTool/>
            <ReportsCarTable
                data={currentLoopData}
                isVisibleCarTable={isVisibleCarTable}
                isLoadingAllCurrentLoopCalculate={isLoadingAllCurrentLoopCalculate}
                currentLoopById = {currentLoopById}
                isApplyingFilters={isApplyingFilters}
            />

        </div>
    );
};

export default ReportsPage;