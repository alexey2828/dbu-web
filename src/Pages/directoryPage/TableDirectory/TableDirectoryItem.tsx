import React, {Dispatch, SetStateAction} from 'react';

interface ITableDirectoryItem<T> {
    item: T
    setSelectedItemId: Dispatch<SetStateAction<number | string | null>>
    selectedItemId: number | string | null
}

const TableDirectoryItem = <T extends {}>({item, setSelectedItemId, selectedItemId}: ITableDirectoryItem<T>) => {

    return (
        // @ts-ignore
        <tr className={`border-b ${selectedItemId === item.id && 'bg-[#FEFFCF]'}`} onClick={() => setSelectedItemId(item.id)} key = {item.id}>
            {Object.values(item).slice(1).map((columnName, index) => (
                <td>
                    {String(columnName)}
                </td>
            ))}
        </tr>
    );
};

export default TableDirectoryItem;