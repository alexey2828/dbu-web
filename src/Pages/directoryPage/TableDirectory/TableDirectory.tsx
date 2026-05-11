import React, {Dispatch, SetStateAction} from 'react';
import Table from "../../../ui/Components/Table/table";
import TableDirectoryItem from "./TableDirectoryItem";
import {useTranslation} from "react-i18next";

interface ITableDirectoryItem {
    id: string | number; // Assuming id can be string or number. Adjust if necessary.
}

interface ITableDirectory<T> {
    data: T[] | undefined,
    headers: object,
    deleteItem?: any
    setSelectedItemId: Dispatch<SetStateAction<any>>
    selectedItemId: number | string | null
}

const TableDirectory = <T extends ITableDirectoryItem>({
                                                           data,
                                                           headers,
                                                           deleteItem,
                                                           setSelectedItemId,
                                                           selectedItemId
                                                       }: ITableDirectory<T>) => {

    const {t} = useTranslation();

    return (
        <div className='mt-5 flex justify-center max-w-[98vw] mx-auto max-h-[75vh]'>
            <div className={'overflow-auto'}>
                <Table>
                    <thead>
                        <tr>
                            {Object.values(headers).map((columnName, index) => (
                                <th key={index}>
                                    {t(columnName)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    
                    <tbody>
                    {data && data.length > 0 && data.map(item => (
                        <TableDirectoryItem item={item} key={item.id} setSelectedItemId={setSelectedItemId}
                                            selectedItemId={selectedItemId}/>
                    ))}
                    </tbody>
                </Table>
            </div>

        </div>


    );
};

export default TableDirectory;
