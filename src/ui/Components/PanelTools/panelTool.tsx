import React, {FC, ReactNode} from 'react';

interface IPanelTool {
    additionStyles?: string
    children: ReactNode
}

const PanelTool:FC<IPanelTool> = ({children, additionStyles}) => {
    return (
        <div className={`flex bg-gray-300 py-1 ${additionStyles} `}>
            {children}
        </div>
    );
};

export default PanelTool;