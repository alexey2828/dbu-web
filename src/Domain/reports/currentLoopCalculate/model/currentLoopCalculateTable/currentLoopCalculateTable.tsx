import React, {FC} from 'react';
import {currentLoopCalculateHeader} from "../../const/currentLoopCalculateHeader";
import Table from "../../../../../ui/Components/Table/table";
import {IReports} from "../../../const/reports";
import Loader from "../../../../../ui/Components/Loader/Loader";
import {useTranslation} from "react-i18next";
import {isNumber} from "node:util";

export interface ICurrentLoopCalculateTable {
    data: IReports | undefined,
    isLoadingAllCurrentLoopCalculate: boolean
    isApplyingFilters: boolean
}

const CurrentLoopCalculateTable: FC<ICurrentLoopCalculateTable> = ({data, isLoadingAllCurrentLoopCalculate, isApplyingFilters}) => {

    const {t} = useTranslation()

    const formatSum = (factSum: string) => {


        const mainNumber = factSum.split(" ")[0]
        const formattedNumber = Number(mainNumber).toFixed(2)
        const restPart = factSum.substring(mainNumber.length);
        return formattedNumber + restPart;

    }

    return (
        <div className={'overflow-auto flex flex-col'}>
            {!isLoadingAllCurrentLoopCalculate && !isApplyingFilters ?
                <Table>
                    <thead>
                        <tr>
                            {Object.values(currentLoopCalculateHeader).map((columnName, index) => (
                                <th key={index}>
                                    {t(columnName)}
                                </th>
                            ))}
                        </tr>
                    </thead>


                    <tbody>
                        {data?.calculate.map(item => (
                            <tr key={item.code}>
                                <td>{item.name}</td>
                                <td>{typeof item.recipeSum == "number" ? item.recipeSum.toFixed(2) : formatSum(item.recipeSum)}
                                    {item?.humidityKorrSum && item?.humidityKorrSum !== 0 && ` (${item?.humidityKorrSum.toFixed(1)} корр)`}</td>

                                <td>{typeof item.factSum == "number" ? item.factSum.toFixed(3) : formatSum(item.factSum)}</td>
                                <td>{item.errorKg}</td>
                                <td>{item.errorPercent}%</td>


                            </tr>
                        ))}
                    </tbody>
                </Table> :
                <Loader/>
            }

        </div>

    );
};

export default CurrentLoopCalculateTable;