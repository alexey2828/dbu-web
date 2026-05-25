import React, {Dispatch, FC, SetStateAction, useLayoutEffect, useState} from 'react';
import PanelTool from "../../../../../ui/Components/PanelTools/panelTool";
import {ReactComponent as Sort} from '../../../../../Public/Images/sort.svg';
import {ReactComponent as Gear} from '../../../../../Public/Images/gear.svg';
import Select from "../../../../../ui/Components/Select/select";
import {ITtn} from "../../const/ttn";
import {useLocation} from "react-router-dom";
import {generalModals} from "../../../../../Infrastructure/const/modalNames";
import {useNotification} from "../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import {useCurrentItems} from "../../../../../Infrastructure/hooks/useCurrentItems";
import s from '../../const/ttn.module.scss';
import {SIZE, CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {useGetUser} from "../../../../../Infrastructure/hooks/useGetUser";
import {Roles} from "../../../../../Infrastructure/const/roles";


interface ITtnPanelTool {
    setCurrentTtnByOrderId: Dispatch<SetStateAction<ITtn[] | undefined>>;
    currentTtnByOrderId: ITtn[] | undefined;
    ttnByOrderId: ITtn[] | undefined;
    isSuccessTtnByOrderId: boolean
}

const TtnPanelTool: FC<ITtnPanelTool> = (
    {
        setCurrentTtnByOrderId,
        currentTtnByOrderId,
        isSuccessTtnByOrderId
    }
) => {


    const {t} = useTranslation();
    const {currentTtn} = useCurrentItems();
    const {notificationHandler} = useNotification();
    const {openModal, closeModal} = useModal();
    const location = useLocation();
    const [currentSortName, setCurrentSortName] = useState<number>();
    const user = useGetUser()
    const ttnControl = [
        {id: 0, name: t('ttn.control.manage')},
        {id: 1, name: t('ttn.control.create')},
        {id: 2, name: t('ttn.control.edit')}
    ];

    const ttnSort = [
        {id: 0, name: t('ttn.sort.sortByDate')},
        {id: 1, name: t('ttn.sort.descending')},
        {id: 2, name: t('ttn.sort.ascending')}
    ];

    const onHandleChangeTtnControl = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let value = Number(e.target.value);
        if (value === 1) {
            if (location.state && location.state.order.state === 1) {
                openModal(generalModals.ttnCreateModal);
            } else {
                closeModal(generalModals.ttnCreateModal);
            }
            e.target.value = '0';
        }
        if (value === 2) {
            if (currentTtn) {
                openModal(generalModals.ttnEditModal);
            } else {
                notificationHandler({type: 'warning', message: t('ttn.notifications.selectForEdit')});
                closeModal(generalModals.ttnEditModal);
            }
            e.target.value = '0';
        }
    };

    useLayoutEffect(() => {
        if (currentSortName === 1) {
            const sortedTtn = currentTtnByOrderId?.slice().sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime());

            if (sortedTtn && JSON.stringify(sortedTtn) !== JSON.stringify(currentTtnByOrderId)) {
                setCurrentTtnByOrderId(sortedTtn);
            }
        } else if (currentSortName === 2) {
            const sortedTtn = currentTtnByOrderId?.slice().sort((a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime());

            if (sortedTtn && JSON.stringify(sortedTtn) !== JSON.stringify(currentTtnByOrderId)) {
                setCurrentTtnByOrderId(sortedTtn);
            }
        }
    }, [currentSortName, setCurrentTtnByOrderId, currentTtnByOrderId, isSuccessTtnByOrderId]);

    const onHandleChangeTtnSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentSortName(Number(e.target.value));
    };

    return (
        <PanelTool additionStyles={s.ttnPanelTool}>
            <CustomText size={SIZE.xl}>
                {t('ttn.list')}
            </CustomText>
            {location.state && location.state.order.state === 1 && user && (user.user.role == Roles.SPEC_REALIZE_PRODUCT || user.user.role === Roles.ADMIN) && (
                <Select
                    name='control'
                    selectOptions={ttnControl}
                    getOptionLabel={(ttnControl) => ttnControl.name}
                    getOptionValue={(ttnControl) => ttnControl.id}
                    handleOnChange={onHandleChangeTtnControl}
                    additionalStyles={s.ttnControlSelect}
                    SvgIcon={Gear}
                />
            )}
            {currentTtnByOrderId && currentTtnByOrderId.length > 0 && (
                <Select
                    name='control'
                    selectOptions={ttnSort}
                    getOptionLabel={(ttnSort) => ttnSort.name}
                    getOptionValue={(ttnSort) => ttnSort.id}
                    handleOnChange={onHandleChangeTtnSort}
                    additionalStyles={s.ttnControlSelect}
                    SvgIcon={Sort}
                />
            )}
        </PanelTool>
    );
};


export default TtnPanelTool;
