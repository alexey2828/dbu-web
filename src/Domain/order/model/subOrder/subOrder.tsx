import React, {FC} from 'react';
import Button from '../../../../ui/Components/Button/Button';
import {useNavigate} from "react-router-dom";
import {generalLinks} from "../../../../Infrastructure/const/links";
import {useCurrentItems} from "../../../../Infrastructure/hooks/useCurrentItems";
import globalStyles from '../../../../global.module.scss'
import s from '../../const/order.module.scss'
import {useTranslation} from "react-i18next";

const SubOrder:FC = () => {

    const {currentOrder} = useCurrentItems()
    const navigate = useNavigate()
    const {t} = useTranslation();
    let order = currentOrder

    const handleOnClick = (data: any) => {
        data && navigate(`/${generalLinks.createEditOrder}/${order?.id}`, {state: {order}})
    }

    return (
        <div className={`${s.sub_order}`}>
            <div className={`${globalStyles.container} ${globalStyles.flex_justify_between}`}>
                <div>
                    {order && (
                        <div>
                            <div>{t('order.vOrder')}: {order.vOrder}</div>
                            <div>{t('order.ttnVProductSum')}: {order.ttnVProductSum}</div>
                            <div>{t('order.remainingVolume')}: {+order.vOrder - +order.ttnVProductSum}</div>
                        </div>
                    )}
                </div>
                <div>
                    {order && (
                        <Button onClick={(currentOrder) => handleOnClick(currentOrder)}>
                            {t('general.moveTo')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubOrder;