import React, {FC} from 'react';
import Table from '../../../../../ui/Components/Table/table';
import {useTranslation} from 'react-i18next';
import {tKey} from '../../../../../Infrastructure/i18n/tKey';

interface BsuBreakdownTable {
    currentLoopData: any;
}

/** Пустий каркас таблиці під звітом при фільтрі БСУ — рядки й дані додасте ви. */
const BsuBreakdownTable: FC<BsuBreakdownTable> = ({currentLoopData}) => {
    const {t} = useTranslation();

    return (
        <div className="overflow-auto mt-3">
            <Table>
                <thead>
                    <tr>
                        <th>Назва</th>
                        <th>дозатор</th>
                        <th>силос</th>
                        <th>Фактична сума</th>
                    </tr>
                </thead>
                <tbody>
                {currentLoopData?.dispenser?.map((item: any, index: number) => (
                    <tr key={index}>
                        <td className="px-2 py-2">{item.name}</td>
                        <td className="px-2 py-2">{item.dispencer}</td>
                        <td className="px-2 py-2">{item.silos}</td>
                        <td className="px-2 py-2">{item.factSum}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default BsuBreakdownTable;
