import React, {useContext, useEffect} from 'react';
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {useForm} from "react-hook-form";
import {recCompAPI} from "../../../../../../Infrastructure/services/RecipeServices/RecCompService";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../../Infrastructure/const/modalNames";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import { useTranslation } from "react-i18next";
import { tKey } from "../../../../../../Infrastructure/i18n/tKey";
const RecCompPostForm = () => {

    const { notificationHandler } = useNotification();
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = recCompAPI.usePostRecCompMutation()
    const { openModal, closeModal } = useModal();
    const { t } = useTranslation();

    const handlePut = async (data: any) => {
        await putData(data)
        closeModal(directoryModals.recComp)
    };

    useEffect(() => {
        if (isError ) {
            notificationHandler({ type: 'error', message: tKey(t, 'errors.general') });
        } else if (isSuccess ) {
            notificationHandler({ type: 'success', message: tKey(t, 'errors.success') });
        }
    }, [isError, isSuccess]);

    return (
        <>
            <ModalForm modalName={directoryModals.recComp} title={tKey(t, 'recComp.titleCreate')}>

                <form onSubmit={handleSubmit(handlePut)} >
                    <div>
                        <label htmlFor="">{tKey(t, 'recComp.idCodeRecipe')}</label>
                        <Input
                            name={`idCodeRecipe`}
                            register={register}
                            options={{required: tKey(t, 'errors.required'), valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                            placeholder={tKey(t, 'recComp.enterIdCodeRecipe')}

                        />
                        <CustomText isError={true}>{errors.idCodeRecipe?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">{tKey(t, 'recComp.idCodeComp')}</label>
                        <Input
                            name={`idCodeComp`}
                            register={register}
                            options={{required: tKey(t, 'errors.required'), valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                            placeholder={tKey(t, 'recComp.enterIdCodeComp')}
                        />
                        <CustomText isError={true}>{errors.idCodeComp?.message?.toString()}</CustomText>

                    </div>


                    <div>
                        <label htmlFor="">{tKey(t, 'recComp.weightCompS')}</label>
                        <Input
                            name={`weightCompS`}
                            register={register}
                            options={{required: tKey(t, 'errors.required'), valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                            placeholder={tKey(t, 'recComp.enterWeightCompS')}
                        />
                        <CustomText isError={true}>{errors.weightCompS?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">{tKey(t, 'recComp.weightCompW')}</label>
                        <Input
                            name={`weightCompW`}
                            register={register}
                            options={{required: tKey(t, 'errors.required'), valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                            placeholder={tKey(t, 'recComp.enterWeightCompW')}
                        />
                        <CustomText isError={true}>{errors.weightCompW?.message?.toString()}</CustomText>

                    </div>


                    <div className={'col-span-2 gap-3 flex items-center justify-center mt-5'}>
                        <Button onClick={() => {openModal(confirmModals.recCompCreateConfirm)}}>
                            {tKey(t, 'modals.save')}
                        </Button>

                        <Button onClick={() => closeModal(directoryModals.recComp)}>
                            {tKey(t, 'modals.close')}
                        </Button>
                    </div>


                </form>
            </ModalForm>
            <SaveModal nameModal = {confirmModals.recCompCreateConfirm} handleSubmit={handleSubmit((data) => handlePut(data))} error = {errors}/>

        </>

    );
};

export default RecCompPostForm;