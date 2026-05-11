import React from 'react';
import PanelTool from "../../../../ui/Components/PanelTools/panelTool";
import {useTranslation} from "react-i18next";
import { tKey } from "../../../../Infrastructure/i18n/tKey";

const OrderStatePanelTool = () => {
    const { t } = useTranslation();

    return (
        <PanelTool additionStyles={'pl-1 items-center h-[47px]'}>
            <div className={'text-xl'}>{tKey(t, 'order.statusHistory')}</div>
        </PanelTool>
    );
};

export default OrderStatePanelTool;