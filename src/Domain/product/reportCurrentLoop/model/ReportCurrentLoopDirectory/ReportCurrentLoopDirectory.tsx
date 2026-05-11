import React from 'react';
import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {reportCurrentLoopAPI} from "../../../../../Infrastructure/services/ProductServices/ReportCurrentLoopService";
import DirectoryPage from "../../../../../Pages/directoryPage/directoryPage";
import {ReportCurrentLoopHeader} from "../../const/ReportCurrentLoopHeader";

const ReportCurrentLoopDirectory = () => {

    const {data, isLoading} = reportCurrentLoopAPI.useFetchAllReportCurrentLoopQuery('')
    const [deleteReportCurrentLoop, {isError}] = reportCurrentLoopAPI.useDeleteReportCurrentLoopMutation()

    return (
/*
        <DirectoryPage data={data} headers={ReportCurrentLoopHeader} deleteItem={deleteReportCurrentLoop} modalName={directoryModals.reportCurrentLoop} isLoading = {isLoading}/>
*/
        <></>

    );
};

export default ReportCurrentLoopDirectory;