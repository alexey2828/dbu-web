import React from 'react';
import {directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {reportWeightManualAPI} from "../../../../../Infrastructure/services/ProductServices/ReportWeightManualService";
import DirectoryPage from "../../../../../Pages/directoryPage/directoryPage";
import {reportWeightManualHeader} from "../../const/reportWeightManualHeader";

const ReportWeightManualDirectory = () => {

    const {data, isLoading} = reportWeightManualAPI.useFetchAllReportWeightManualQuery('')
    const [deleteReportWeightManual, {isError}] = reportWeightManualAPI.useDeleteReportWeightManualMutation()

    return (
/*
        <DirectoryPage data={data} headers={reportWeightManualHeader} deleteItem={deleteReportWeightManual} modalName={directoryModals.reportWeightManual} isLoading = {isLoading} />
*/
        <></>

    );
};

export default ReportWeightManualDirectory;