import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import PanelTool from "../../../../ui/Components/PanelTools/panelTool";
import Button from "../../../../ui/Components/Button/Button";
import {ReactComponent as Save} from '../../../../Public/Images/save.svg'
import {ReactComponent as Edit} from '../../../../Public/Images/edit.svg'
import {ReactComponent as Factory} from '../../../../Public/Images/factory.svg'
import {useLocation} from "react-router-dom";
import {plantAPI} from "../../../../Infrastructure/services/PlantServices/PlantService";
import {confirmModals} from "../../../../Infrastructure/const/modalNames";
import {useModal} from "../../../../Infrastructure/hooks/useModal";
import {useTranslation} from "react-i18next";
import {Roles} from "../../../../Infrastructure/const/roles";
import {useGetUser} from "../../../../Infrastructure/hooks/useGetUser";
import { tKey } from "../../../../Infrastructure/i18n/tKey";

interface IOrderEditPanelTool {
    setPressedAction: Dispatch<SetStateAction<any>>
    pressedAction: any
}

const OrderEditPanelTool:FC<IOrderEditPanelTool> = ({ setPressedAction, pressedAction}) => {

    const { openModal, closeModal } = useModal();
    const location = useLocation();
    const {t} = useTranslation();
    const [trigger, {data: plant}] = plantAPI.useLazyFetchAllPlantsQuery()
    const user = useGetUser()

    const handleOnSubmit = (e: any) => {
        setPressedAction({action: location.state?.order ? 'save' : 'create', isDirty: false});
        openModal(confirmModals.orderCreateConfirm)
    }

    useEffect(() => {
        location.state && trigger(location.state?.order.idPlant)
    }, [location.state?.order.idPlant]);

    return (
        <PanelTool additionStyles={'pl-4 h-[47px]'}>
            {location.state?.order ?
                (
                    <div className={'flex justify-center items-center'}>
                        {
                            user && (user.user.role == Roles.SPEC_REALIZE_PRODUCT || user.user.role === Roles.ADMIN) &&
                                <Button additionalStyles={'mr-3'}
                                        onClick={handleOnSubmit}
                                        SvgIcon={Edit}
                                        disabled={pressedAction.isDirty}>
                                    {tKey(t, 'general.save')}
                                </Button>
                        }

                        <div className={'border-2 border-black bg-white p-1 rounded-lg flex gap-2 items-center justify-center pr-10 '}>
                            <Factory/> {plant && plant[0].name}
                        </div>
                    </div>
                ) :
                (
                    user && (user.user.role == Roles.SPEC_REALIZE_PRODUCT || user.user.role === Roles.ADMIN) && (
                        <Button additionalStyles="mr-3" onClick={handleOnSubmit} SvgIcon={Save}>
                            {tKey(t, 'general.create')}
                        </Button>
                    )
                )
            }

        </PanelTool>
    );
};

export default OrderEditPanelTool