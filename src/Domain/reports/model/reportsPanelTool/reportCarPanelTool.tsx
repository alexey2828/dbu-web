import React from 'react';
import PanelTool from "../../../../ui/Components/PanelTools/panelTool";
import globalStyles from '../../../../global.module.scss'
import {CustomText, SIZE} from "../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const ReportCarPanelTool = () => {
    const { t } = useTranslation();

    return (
        <PanelTool additionStyles={`${globalStyles.indent_top}`}>
            <CustomText className={globalStyles.container} size={SIZE.xl}>
                {t("reports.reportCar.title")}

            </CustomText>
        </PanelTool>
    );
};

export default ReportCarPanelTool;