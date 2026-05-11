import React, {Dispatch, FC, SetStateAction, useEffect} from 'react';
import {ProductTableHeaderForReports} from "../../../product/const/ProductHeader";
import ReportProductTableItem from "./reportProductTableItem";
import {IReports} from "../../const/reports";
import {reportsAPI} from "../../../../Infrastructure/services/ReportsServices/ReportsService";
import {useLocation} from "react-router-dom";
import Loader from "../../../../ui/Components/Loader/Loader";
import Table from "../../../../ui/Components/Table/table";
import globalStyles from '../../../../global.module.scss'
import {useTranslation} from "react-i18next";

interface IReportProductTable {
    data: IReports | undefined
    setCurrentLoopData: any
    isLoadingAllCurrentLoopCalculate: boolean
    triggerCurrentLoopCalculate: any
    currentLoop: any
    isCleared: boolean,
    setIsCleared: any,
    isApplyingFilters: boolean,

}

const ReportProductTable: FC<IReportProductTable> = (
    {
        data,
        setCurrentLoopData,
        isLoadingAllCurrentLoopCalculate,
        triggerCurrentLoopCalculate,
        currentLoop,
        isCleared,
        setIsCleared,
        isApplyingFilters,
    }
) => {

    const [trigger, {data: currentLoopById, isLoading, isSuccess}] = reportsAPI.useLazyFetchAllCurrentLoopCalculateQuery()
    const location = useLocation()
    const {t} = useTranslation()


    useEffect(() => {
        if (location.state && data) {
            const reportId = data?.product.find(item => +item.idTtn === +location.state.currentTtn.id)
            const dataId = {idTtn: reportId?.idTtn}
            trigger(dataId)

        }
    }, [location.state, data, trigger]);



    useEffect(() => {
        if (isSuccess) {
            setCurrentLoopData(currentLoopById)
        }
    }, [trigger, isSuccess]);


    return (
        <div className={`min-h-[40vh] max-h-[60vh] overflow-auto ${globalStyles.container}`}>

            {!isLoadingAllCurrentLoopCalculate && !isLoading && !isApplyingFilters ?
                <Table>
                    <thead>
                        <tr>
                            {Object.values(ProductTableHeaderForReports).map((columnName, index) => (
                                <th key={index}>
                                    {t(columnName)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                    {data?.product.map(item => (
                        <ReportProductTableItem
                            item={item}
                            key={item.id}
                            setCurrentLoopData = {setCurrentLoopData}
                            reportData = {data}
                            triggerCurrentLoopCalculate = {triggerCurrentLoopCalculate}
                            currentLoop = {currentLoop}
                            isCleared = {isCleared}
                            setIsCleared = {setIsCleared}
                        />
                    ))}
                    </tbody>


                </Table> :
                <Loader/>
            }


        </div>
    );
};

export default ReportProductTable;