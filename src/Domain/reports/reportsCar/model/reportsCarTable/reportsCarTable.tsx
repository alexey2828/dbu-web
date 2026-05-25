import React, {FC, useEffect, useState} from 'react';
import Table from "../../../../../ui/Components/Table/table";
import {v4 as uuidv4} from 'uuid';
import Loader from "../../../../../ui/Components/Loader/Loader";
import globalStyles from '../../../../../global.module.scss'
import {useTranslation} from "react-i18next";

interface ReportsCarTableProps {
    data: any,
    isVisibleCarTable: boolean
    isLoadingAllCurrentLoopCalculate: boolean,
    currentLoopById: any
    isApplyingFilters: boolean
}

const ReportsCarTable: FC<ReportsCarTableProps> = (
    {data, isVisibleCarTable, isLoadingAllCurrentLoopCalculate, currentLoopById, isApplyingFilters}
) => {

    const loopData = data?.reportCurrentLoopByLoop;
    const totalData = data?.reportCurrentLoopByLoopSum
    const productData = currentLoopById?.product
    const {t} = useTranslation();

    const shouldDisplayData = productData && productData.length > 0 &&
        productData.every((item: any) => item.idTtn === productData[0].idTtn);

    return (
        <div className={`${globalStyles.indent_top} ${globalStyles.container} overflow-auto max-h-[20vh]`}>

            {!isLoadingAllCurrentLoopCalculate && !isApplyingFilters ?
                <Table>
                    <thead>
                    <tr>
                        <th rowSpan={2} className = 'text-center border'>{t("reports.reportCar.cycle")}</th>
                        <th rowSpan={2} colSpan={1} className = 'text-center border'>{t("reports.reportCar.vCycle")}</th>
                        <th rowSpan={2} colSpan={1} className = 'text-center border'> Навантаження на ЕД</th>
                        <th colSpan={3} className="border text-center">{t("reports.reportCar.cement")}</th> {/* 4*/}
                        <th colSpan={3} className="border text-center">{t("reports.reportCar.filler")}</th> {/* 3*/}
                        <th colSpan={3} className="text-center border">{t("reports.reportCar.liquidChemAdditive")}</th> {/* 2*/}

                        <th colSpan={3} className="text-center border">{t("reports.reportCar.water")}</th> {/* 1*/}
                    </tr>
                    <tr>
                        <th className="text-center border">{t("reports.reportCar.targetKg")}</th>
                        <th className="text-center border">{t("reports.reportCar.actualKg")}</th>
                        <th className="text-center border">{t("reports.reportCar.percentage")}</th>
                        <th className="text-center border">{t("reports.reportCar.targetKg")}</th>
                        <th className="text-center border">{t("reports.reportCar.actualKg")}</th>
                        <th className="text-center border">{t("reports.reportCar.percentage")}</th>
                        <th className="text-center border">{t("reports.reportCar.targetKg")}</th>
                        <th className="text-center border">{t("reports.reportCar.actualKg")}</th>
                        <th className="text-center border">{t("reports.reportCar.percentage")}</th>
                        <th className="text-center border">{t("reports.reportCar.targetKg")}</th>
                        <th className="text-center border">{t("reports.reportCar.actualKg")}</th>
                        <th className="text-center border">{t("reports.reportCar.percentage")}</th>
                    </tr>
                    </thead>

                    {shouldDisplayData &&
                        <tbody>
                        {loopData && Object.keys(loopData).map((loopKey) =>
                            Object.keys(loopData[loopKey]).map((innerKey) => {
                                const entries = loopData[loopKey][innerKey];
                                return (
                                    <tr key={`${loopKey}-${innerKey}`}>
                                        <td className="px-4 py-2 border">{innerKey}</td>
                                        <td className="px-4 py-2 border">
                                            {entries[0]?.vLoop || '-'}
                                        </td>

                                        <td className="px-4 py-2 border">
                                            {entries[0]?.powerLoop || '-'}
                                        </td>

                                        {['4', '3', '2', '1'].map((prefix) => {
                                            const item = entries.find((el: any) => el.codePrefix === parseInt(prefix));
                                            return (
                                                <React.Fragment key={uuidv4()}>
                                                    <td className="px-4 py-2 border">
                                                        {item?.sumWeightRecipeLoop?.toFixed(3) || '-'}
                                                        {item?.humidityKorrSum && item?.humidityKorrSum !== 0 && item.humidityKorrSum > 0 ?
                                                            ` (+${item?.humidityKorrSum} корр)` :
                                                            item?.humidityKorrSum !== 0 && ` (${item?.humidityKorrSum} корр)`}
                                                    </td>
                                                    <td className="px-4 py-2 border">{item?.sumWeightFactLoop?.toFixed(3) || '-'}</td>
                                                    <td className="px-4 py-2 border">{item?.sumWeightRecipeLoopPercent?.toFixed(2) || '-'}</td>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        )}
                        {totalData && (
                        <tr>
                            <td className="px-4 py-2 border text-center" colSpan={3}>Итого:</td>
                            {['4', '3', '2', '1'].map((prefix) => {
                                // Проверяем, что reportCurrentLoopByLoopSum определен и является массивом
                                const item = Array.isArray(totalData)
                                    ? totalData.find(el => el.codePrefix === parseInt(prefix))
                                    : null;

                                return (
                                    <React.Fragment key={prefix}>
                                        <td className="px-4 py-2 border">
                                            {item?.sumWeightRecipeLoop.toFixed(2) || '-'}
                                            {item?.humidityKorrSum !== 0 && ` (${item?.humidityKorrSum.toFixed(1)} корр)`}
                                        </td>
                                        <td className="px-4 py-2 border">{item?.sumWeightFactLoop.toFixed(2) || '-'}</td>
                                        <td className="px-4 py-2 border">{item?.percent.toFixed(2) || '-'}</td>
                                    </React.Fragment>
                                );
                            })}
                        </tr>)}
                        </tbody>}

                </Table> :
                <Loader/>

            }
        </div>
    );
};

export default ReportsCarTable;
