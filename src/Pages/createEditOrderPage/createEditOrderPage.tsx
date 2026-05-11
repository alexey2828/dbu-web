import React, {useRef, useState} from 'react';
import SubTtn from "../../Domain/ttn/ttn/model/subTtn/subTtn";
import FooterTtn from "../../Domain/ttn/ttn/model/footerTtn/footerTtn";
import OrderEditPanelTool from "../../Domain/order/model/orderPanelTool/orderEditPanelTool";
import OrderInputForm from "../../Domain/order/model/orderInputForm/orderInputForm";
import OrderStateTable from "../../Domain/order/model/orderStateTable/orderStateTable";
import TtnModals from "../../Domain/ttn/ttn/model/ttnModals/ttnModals";
import OrderStatePanelTool from "../../Domain/order/model/orderPanelTool/orderStatePanelTool";
import {confirmModals} from "../../Infrastructure/const/modalNames";
import {useModal} from "../../Infrastructure/hooks/useModal";

const CreateEditOrderPage = () => {

    const [pressedAction, setPressedAction] = useState<any>({action: '', isDirty: true});
    const formRef = useRef<HTMLFormElement>(null)
    const {closeModal} = useModal();

    const handleSubmitCreate = () => {
        formRef.current?.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
        closeModal(confirmModals.orderCreateConfirm)
    };



    return (
        <>
            <TtnModals
                handleSubmitSaveModal={handleSubmitCreate}
                setPressedAction={setPressedAction}
            />

            <div className={'grid grid-cols-10'}>
                <div className='col-span-8'>
                    <OrderEditPanelTool setPressedAction={setPressedAction} pressedAction={pressedAction}/>
                    <OrderInputForm
                        formRef={formRef}
                        pressedAction={pressedAction}
                        setPressedAction={setPressedAction}
                    />
                </div>

                <div className={'col-span-2 border-l-2 border-gray-300'}>
                    <OrderStatePanelTool/>
                    <OrderStateTable/>
                </div>
            </div>

            <SubTtn />
            <FooterTtn/>
        </>
    );
};

export default CreateEditOrderPage;