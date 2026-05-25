import React, {useContext, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {
    reportWeightManualAPI
} from "../../../../../../Infrastructure/services/ProductServices/ReportWeightManualService";
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../../Infrastructure/const/modalNames";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";

const ReportWeightManualPostForm = () => {

    const { notificationHandler } = useNotification();

    const {register, handleSubmit, setError, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = reportWeightManualAPI.usePostReportWeightManualMutation()
    const {data: reportWeightManualData} = reportWeightManualAPI.useFetchAllReportWeightManualQuery('')
    const { openModal, closeModal } = useModal();

    const handlePut = async (data: any) => {
        const existingCode = reportWeightManualData?.some((item: any) => item.code === data.code);
        if (existingCode) {
            setError('code', {
                type: 'manual',
                message: 'Код уже существует',
            });
            return true
        }
        await putData(data)
        closeModal(directoryModals.reportWeightManual)
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
            <ModalForm modalName={directoryModals.reportWeightManual} title={'Создать отчет по заявке по каждому цилку в ручном режиме'}>

                <form onSubmit={handleSubmit(handlePut)} >
                    <div>
                        <label htmlFor="">loop Number</label>
                        <Input
                            name={`loopNumber`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите loop number'}
                        />
                        <CustomText isError={true}>{errors.loopNumber?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="">Код</label>
                        <Input
                            name={`code`}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            type={'search'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите код'}

                        />
                        <CustomText isError={true}>{errors.code?.message?.toString()}</CustomText>

                    </div>


                    <div>
                        <label htmlFor="">dispenser</label>
                        <Input
                            name={`dispenser`}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            type={'search'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите dispenser'}

                        />
                        <CustomText isError={true}>{errors.dispenser?.message?.toString()}</CustomText>

                    </div>
                    <div>
                        <label htmlFor="">Вес</label>
                        <Input
                            name={`weight`}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            type={'search'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите вес'}
                        />
                        <CustomText isError={true}>{errors.weight?.message?.toString()}</CustomText>
                    </div>


                    <div className={'col-span-2 flex items-center justify-center mt-5 gap-2'}>
                        <Button onClick={() => {openModal(confirmModals.reportWeightManualCreateConfirm)}}>
                            Сохранить
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.reportWeightManual)}>
                            Закрыть
                        </Button>
                    </div>
                </form>

            </ModalForm>
            <SaveModal nameModal = {confirmModals.reportWeightManualCreateConfirm} handleSubmit={handleSubmit((data) => handlePut(data))} error = {errors}/>

        </>

    );
};

export default ReportWeightManualPostForm;