import React, {useEffect} from 'react';
import Input from "../../../../../ui/Components/Input/Input";
import Button from "../../../../../ui/Components/Button/Button";
import {useForm} from "react-hook-form";
import {productAPI} from "../../../../../Infrastructure/services/ProductServices/ProductService";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../Infrastructure/const/modalNames";
import Select from "../../../../../ui/Components/Select/select";
import {carAPI} from "../../../../../Infrastructure/services/CarServices/CarService";
import {driverAPI} from "../../../../../Infrastructure/services/DriverServices/DriverService";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import {useNotification} from "../../../../../Infrastructure/hooks/useNotification";
import {CustomText} from "../../../../../ui/Components/CustomText/CustomText";

const ProductPostForm = () => {

    const { notificationHandler } = useNotification();
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = productAPI.usePostProductMutation()
    const {data: car} = carAPI.useFetchAllCarQuery('')
    const {data: driver} = driverAPI.useFetchAllDriverQuery('')
    const { openModal, closeModal } = useModal();

    useEffect(() => {
        if (isError ) {
            notificationHandler({ type: 'error', message: 'Что-то пошло не так' });
        } else if (isSuccess ) {
            notificationHandler({ type: 'success', message: 'Всё прошло успешно' });
        }
    }, [isError, isSuccess]);
    const handlePut = async (data: any) => {
        await putData(data)
        closeModal(directoryModals.product)
    };

    return (
        <>
            <ModalForm modalName={directoryModals.product} title={'Создать продукт'} width={'w-[800px]'}>

                <form onSubmit={handleSubmit(handlePut)}>
                    <div>
                        <label htmlFor="">Дата начала</label>
                        <Input
                            name={`dateStart`}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            type={'datetime-local'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите дату начала'}
                        />
                        <CustomText isError={true}>{errors.dateStart?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">Дата конца</label>
                        <Input
                            name={`timeEnd`}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            type={'datetime-local'}
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.timeEnd?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="">Обьем</label>
                        <Input
                            name={`vProduct`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите обьем'}
                        />
                        <CustomText isError={true}>{errors.vProduct?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">Число циклов</label>
                        <Input
                            name={`loopNumber`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите число циклов'}
                        />
                        <CustomText isError={true}>{errors.loopNumber?.message?.toString()}</CustomText>

                    </div>

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
                        <label htmlFor="">Водитель</label>
                        <Select
                            selectOptions={driver}
                            getOptionLabel={(driver) => driver.name}
                            getOptionValue={(driver) => driver.id}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            name='driver'
                            additionalStyles={'w-full'}
                            nameOpeningModal={directoryModals.car}
                        />
                        <CustomText isError={true}>{errors.driver?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="">Машина</label>
                        <Select
                            selectOptions={car}
                            getOptionLabel={(car) => car.name}
                            getOptionValue={(car) => car.name}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            name='car'
                            additionalStyles={'w-full'}
                            nameOpeningModal={directoryModals.car}
                        />
                        <CustomText isError={true}>{errors.car?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="">Вид смеси</label>
                        <Input
                            name={`classRecipe`}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            type={'search'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите вид смеси'}
                        />
                        <CustomText isError={true}>{errors.classRecipe?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="">Название смеси</label>
                        <Input
                            name={`nameRecipe`}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            type={'search'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите название смеси'}
                        />
                        <CustomText isError={true}>{errors.nameRecipe?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="">Смесь</label>
                        <Input
                            name={`recipe`}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            type={'search'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите смесь'}
                        />
                        <CustomText isError={true}>{errors.recipe?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="">id Ttn</label>
                        <Input
                            name={`idTtn`}
                            register={register}
                            options={{required: 'Поле обязательно', valueAsNumber: true}}
                            type={'number'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите id ttn'}
                        />
                        <CustomText isError={true}>{errors.number?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="">Время начала</label>
                        <Input
                            name={`timeStart`}
                            register={register}
                            options={{required: 'Поле обязательно'}}
                            type={'datetime-local'}
                            additionalStyles={'w-full'}
                            placeholder={'Введите время начала'}
                        />
                        <CustomText isError={true}>{errors.timeStart?.message?.toString()}</CustomText>
                    </div>


                    <div className={'gap-3 flex items-center justify-center mt-5'}>
                        <Button onClick={() => {openModal(confirmModals.productCreateConfirm)}}>
                            Сохранить
                        </Button>
                        <Button onClick={() => closeModal(directoryModals.product)}>
                            Закрыть
                        </Button>
                    </div>


                </form>
            </ModalForm>

            <SaveModal nameModal = {confirmModals.productCreateConfirm} handleSubmit={handleSubmit((data) => handlePut(data))} error = {errors}/>

        </>

    );
};

export default ProductPostForm;