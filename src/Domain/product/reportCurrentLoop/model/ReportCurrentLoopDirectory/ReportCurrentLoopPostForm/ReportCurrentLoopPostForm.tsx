import React, {Dispatch, FC, useContext, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {reportCurrentLoopAPI} from "../../../../../../Infrastructure/services/ProductServices/ReportCurrentLoopService";
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../../Infrastructure/const/modalNames";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";

const ReportCurrentLoopPostForm = () => {

    const { notificationHandler } = useNotification();
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = reportCurrentLoopAPI.usePostReportCurrentLoopMutation()
    const { openModal, closeModal } = useModal();

    const handlePut = async (data: any) => {
        await putData(data)
        closeModal(directoryModals.reportCurrentLoop)
    };

    useEffect(() => {
        if (isError ) {
            notificationHandler({ type: 'error', message: 'Что-то пошло не так' });
        } else if (isSuccess ) {
            notificationHandler({ type: 'success', message: 'Всё прошло успешно' });
        }
    }, [isError, isSuccess]);

    return (
        <>
            <ModalForm modalName={directoryModals.reportCurrentLoop} title={'Создать текущий отчет по заявке по каждому узлу'} width={'w-[800px]'}>

                <form onSubmit={handleSubmit(handlePut)} >
                    <div>
                        <label htmlFor="">v loop</label>
                        <Input
                            name={`vLoop`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите v loop'}
                        />
                        <CustomText isError={true}>{errors.vLoop?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="">loop number</label>
                        <Input
                            name={`loopNumber`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.loopNumber?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">code</label>
                        <Input
                            name={`code`}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            type={'search'}
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.code?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="">dispencer</label>
                        <Input
                            name={`dispencer`}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            type={'search'}
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.dispencer?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">doisingError</label>
                        <Input
                            name={`doisingError`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.doisingError?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">doising Error Persent</label>
                        <Input
                            name={`doisingErrorPersent`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.doisingErrorPersent?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">doisingKorr</label>
                        <Input
                            name={`doisingKorr`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.doisingKorr?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">Влажность</label>
                        <Input
                            name={`humidityKorr`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.humidityKorr?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">weight Fact Loop</label>
                        <Input
                            name={`weightFactLoop`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.weightFactLoop?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">weight Fact M3</label>
                        <Input
                            name={`weightFactM3`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.weightFactM3?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">weight Recipe Loop</label>
                        <Input
                            name={`weightRecipeLoop`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.weightRecipeLoop?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">weight Recipe M3</label>
                        <Input
                            name={`weightRecipeM3`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.weightRecipeM3?.message?.toString()}</CustomText>

                    </div>


                    <div className={'gap-3 col-span-3 flex items-center justify-center mt-5'}>
                        <Button onClick={() => {openModal(confirmModals.reportCurrentLoopCreateConfirm)}}>
                            Сохранить
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.reportCurrentLoop)}>
                            Закрыть
                        </Button>
                    </div>


                </form>
            </ModalForm>
            <SaveModal nameModal = {confirmModals.reportCurrentLoopCreateConfirm} handleSubmit={handleSubmit((data) => handlePut(data))} error = {errors}/>

        </>

    );
};

export default ReportCurrentLoopPostForm;