import React, {FC, PropsWithChildren} from 'react';

interface ITable extends PropsWithChildren {
    additionalStyles?: string
}

const Table: FC<ITable> = ({children, additionalStyles}) => {
    return (
        <div>
            <table
                className={`text-sm text-left border-solid border border-gray-200 w-full overflow-auto ${additionalStyles}`}
            >
                {children}
            </table>
        </div>
    );
};

export default Table;