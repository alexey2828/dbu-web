import React, {Dispatch, FC, lazy, SetStateAction, Suspense} from 'react';
import SaveModal from '../../../../../ui/Components/Modal/SaveModal';
import CreateRecipeNameModal
    from "../../../../order/model/orderModals/createRecipeNameModal/createRecipeNameModal";
import TtnEditModal from "./ttnEditModal/ttnEditModal";
import {confirmModals} from "../../../../../Infrastructure/const/modalNames";
import Loader from "../../../../../ui/Components/Loader/Loader";

interface ITtnModals {
    handleSubmitSaveModal: () => void
    setPressedAction: Dispatch<SetStateAction<any>>;
}

const LazyTtnCreateModal = lazy(() => import('./ttnCreateModal/ttnCreateModal'))
const LazyTtnEditModal = lazy(() => import('./ttnEditModal/ttnEditModal'))

const TtnModals: FC<ITtnModals> = ({
                                       handleSubmitSaveModal,
                                       setPressedAction,
}) => {
    return (
        <>
            <SaveModal nameModal = {confirmModals.orderCreateConfirm} handleSubmit = {handleSubmitSaveModal}/>
            <CreateRecipeNameModal setPressedAction = {setPressedAction}/>
            <TtnEditModal />
            <Suspense fallback={<Loader/>}>
                <LazyTtnCreateModal/>
                <LazyTtnEditModal />
            </Suspense>
        </>
    );
};

export default TtnModals;