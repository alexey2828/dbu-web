import React from 'react';
import PanelTool from "../../../../../ui/Components/PanelTools/panelTool";
import {useNavigate} from "react-router-dom";
import {ReactComponent as Report} from "../../../../../Public/Images/reports.svg";
import {generalLinks} from "../../../../../Infrastructure/const/links";
import {useCurrentItems} from "../../../../../Infrastructure/hooks/useCurrentItems";
import s from '../../const/ttn.module.scss'
import  {SIZE, CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";

const TtnStatePanelTool = () => {

    const {currentTtn} = useCurrentItems()
    const navigate = useNavigate()
    const { t } = useTranslation();

    const onClickToReports = () => {
        navigate(`/${generalLinks.reports}`, {state: {currentTtn}})
    }
    return (
        <PanelTool additionStyles={s.ttnStatePanelTool}>
            <div className={s.ttnStatePanelTool_item}>
                <CustomText size={SIZE.xl}>{t('ttn.statusHistory')}</CustomText>

                {currentTtn && currentTtn?.state === 15 &&
                    <button onClick={() => onClickToReports()}>
                        <Report />
                    </button>
                }
            </div>
        </PanelTool>
    );
};

export default TtnStatePanelTool;