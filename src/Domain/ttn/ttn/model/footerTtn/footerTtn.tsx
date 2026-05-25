import React, {FC, useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {orderAPI} from "../../../../../Infrastructure/services/OrderServices/OrderService";
import {useTranslation} from "react-i18next";
import {ttnFooterTitle} from "../../const/ttnTitles";

interface IFooterTtn {
}

const FooterTtn:FC<IFooterTtn> = () => {

    const location = useLocation();
    const { t } = useTranslation();

    const [trigger, {data: orderById}] = orderAPI.useLazyFetchOrderByIdQuery();

    useEffect(() => {
        if (location.state) {
            trigger(location.state.order.id);
        }
    }, [location.state, trigger]);

    return (
        <div className={'!h-[4vh] flex items-center justify-center'}>
            {
                orderById &&
                <div className={'flex items-center justify-center gap-2'}>
                    <div>{t(ttnFooterTitle.vOrder)}: {orderById[0].vOrder}</div>
                    <div>{t(ttnFooterTitle.ttnVProductSumCreated)}: {orderById[0].ttnVProductSumCreated}</div>
                    <div>{t(ttnFooterTitle.ttnVProductSum)}: {orderById[0].ttnVProductSum}</div>
                    <div>{t(ttnFooterTitle.remainingVolume)}: {+orderById[0].vOrder - +orderById[0].ttnVProductSum}</div>
                </div>
            } <br/>

        </div>
    );
};

export default FooterTtn;