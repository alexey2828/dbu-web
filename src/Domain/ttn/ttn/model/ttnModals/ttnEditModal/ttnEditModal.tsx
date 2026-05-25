import React, {Dispatch, FC, SetStateAction, useEffect, useState, useContext, memo, useTransition} from 'react';
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {ttnAPI} from "../../../../../../Infrastructure/services/TtnServices/TtnService";
import {useForm} from "react-hook-form";
import {useLocation} from "react-router-dom";
import {dispatcherAPI} from "../../../../../../Infrastructure/services/DispatcherServices/DispatcherService";
import {carAPI} from "../../../../../../Infrastructure/services/CarServices/CarService";
import {plantAPI} from "../../../../../../Infrastructure/services/PlantServices/PlantService";
import {driverAPI} from "../../../../../../Infrastructure/services/DriverServices/DriverService";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import Select from "../../../../../../ui/Components/Select/select";
import {confirmModals, directoryModals, generalModals} from "../../../../../../Infrastructure/const/modalNames";
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import {skipToken} from "@reduxjs/toolkit/query";
import {customerAPI} from "../../../../../../Infrastructure/services/OrderServices/CustomerService";
import {classRecipeAPI} from "../../../../../../Infrastructure/services/RecipeServices/ClassRecipeService";
import {bsuAPI} from "../../../../../../Infrastructure/services/PlantServices/BsuService";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import {useCurrentItems} from "../../../../../../Infrastructure/hooks/useCurrentItems";
import {IBsu} from "../../../../../plants/bsu/const/bsu";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
import {useTranslation} from "react-i18next";
import {ttnCreateEditModalTitles} from "../../../const/ttnTitles";
import { tKey } from "../../../../../../Infrastructure/i18n/tKey";

const TtnEditModal= () => {

    const { notificationHandler } = useNotification();
    const { openModal, closeModal, modals } = useModal();
    const {currentTtn, setCurrentTtn} = useCurrentItems()
    const location = useLocation();
    const [currentCarId, setCurrentCarId] = useState<number | string | undefined>();

    const {register, handleSubmit, formState: {errors}, setValue, getValues, setError} = useForm();
    const isOpen = !!modals.find(item => item.name === generalModals.ttnEditModal)

    const {data: dispatcher} = dispatcherAPI.useFetchAllDispatcherQuery('');
    const {data: cars} = carAPI.useFetchAllCarQuery('');
    const {data: plant} = plantAPI.useFetchAllPlantsQuery('');
    const {data: driver} = driverAPI.useFetchAllDriverQuery('');
    const [triggerBsu, {data: bsu, isLoading: isLoadingBSU}] = bsuAPI.useLazyFetchAllBsuQuery()
    const {data: customer} = customerAPI.useFetchAllCustomersQuery(location.state ? location.state.order.idCustomer : skipToken)
    const {data: classRecipe} = classRecipeAPI.useFetchAllClassRecipeQuery(location.state ? location.state.order.classRecipe : skipToken)
    const {data: car} = carAPI.useFetchAllCarQuery(isOpen && currentCarId ? currentCarId : skipToken);
    const [editTtn, {isError, isSuccess}] = ttnAPI.useEditTtnFieldsMutation();
    const [workingBsu, setWorkingBsu] = useState<IBsu[]>()
    const {t} = useTranslation()

    useEffect(() => {
        let currentPlantId = currentTtn?.idPlant
        // @ts-ignore
        let currentPlant = plant && plant.find(item => +item.id === +currentPlantId)

        if (plant) {
            triggerBsu({codePlant: currentPlant?.codePlant});
        }
    }, [plant, triggerBsu, isOpen]);

    useEffect(() => {
        if (bsu) {
            setWorkingBsu(bsu && bsu?.filter(item => item.isWork !== 0))
        }
    }, [bsu]);

    const initialFormValues = {
        finishAdress: currentTtn?.finishAdress || '',
        dispatcher: currentTtn?.dispatcher || '',
        car: currentTtn?.car || '',
        driver: currentTtn?.driver || '',
        idPlant: currentTtn?.idPlant || '',
        finishDate: currentTtn?.finishDate || '',
        vProduct: currentTtn?.vProduct || 10
    };

    useEffect(() => {
        cars && setCurrentCarId(cars[0].id);
        setValue('finishAdress', currentTtn?.finishAdress);
        setValue('dispatcher', currentTtn?.dispatcher);
        setValue('car', currentTtn?.car);
        setValue('driver', currentTtn?.driver);
        setValue('idPlant', currentTtn?.idPlant);
        setValue('finishDate', currentTtn?.finishDate);
        setValue('vProduct', currentTtn?.vProduct || 10);
    }, [isOpen]);

    useEffect(() => {
        if (isError) {
            notificationHandler({type: 'error', message: tKey(t, 'errors.general')});
        } else if (isSuccess) {
            notificationHandler({type: 'success', message: tKey(t, 'errors.success')});
        }
    }, [isError, isSuccess]);

    const handlePut = (data: any) => {


        const carId = getValues("car")
        const carName = cars?.find(option => option.id == carId)?.name

        const dispatcherCode = getValues('dispatcher')
        const dispatcherName = dispatcher?.find(option => option.code == dispatcherCode)?.name

        const driverId = getValues('driver')
        const driverName = driver?.find(option => option.id == driverId)?.name

        const plantId = getValues('idPlant')
        const plantName = plant?.find(option => option.id == plantId)?.name
        const plantCode = plant?.find(option => option.id == plantId)?.codePlant

        /*const changedFields = Object.keys(initialFormValues).reduce((acc: any, key) => {
            if (initialFormValues[key as keyof typeof initialFormValues] !== data[key]) {
                if (key === 'car') {
                    acc[key] = carName;
                } else if (key === 'dispatcher') {
                    acc[key] = dispatcherName;
                } else if (key === 'driver') {
                    acc[key] = driverName;
                } else if (key === 'idPlant') {
                    acc[key] = plantName;
                } else {
                    acc[key] = data[key];
                }
            }
            return acc;
        }, {});
        console.log(changedFields)*/

        const changedData = {
            customer: customer && customer[0].name,
            timetask: currentTtn?.date,
            isPause: currentTtn?.isPause,
            car: carName,
            driver: driverName,
            class_recipe: classRecipe && classRecipe[0].name,
            name_recipe: location.state.order.nameRecipe,
            v_product: data.vProduct,
            bsu: currentTtn?.idBsu
        }

        const newData = {
            ...data,
            id: Number(currentTtn?.id),
            idOrder: location.state.order.id,
            state: currentTtn?.state,
            date: currentTtn?.date,
            codePlant: plantCode,
            json: {ind_ttn: Number(currentTtn?.id), ...changedData}
        };


        const newCurrentData = {
            id: currentTtn?.id,
            car: data.car,
            driver: data.driver,
            date: currentTtn?.date,
            dispatcher: data.dispatcher,
            finishAdress: data.finishAdress,
            finishDate: data.finishDate,
            idOrder: location.state.order.id,
            idPlant: data.idPlant,
            isPause: currentTtn?.isPause,
            state: currentTtn?.state,
            vProduct: data.vProduct,
        }
        if (workingBsu && workingBsu.length == 0) {
            setError('bsu', {
                type: 'manual',
                message: tKey(t, 'errors.emptyBsu'),
            });
            return true
        }

        // @ts-ignore
        setCurrentTtn(newCurrentData)
        editTtn(newData);
        closeModal(generalModals.ttnEditModal)
    };

    const onInputMaxValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (car && value > car[0].maxV) {
            e.target.value = car[0].maxV.toString();
        }
    };

    const onChangePlant = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let currentPlantId = e.target.value
        let currentPlant = plant && plant.find(item => +item.id === +currentPlantId)
        triggerBsu({codePlant: currentPlant?.codePlant});
    }

    return (
        <>
            <ModalForm modalName={generalModals.ttnEditModal} title={tKey(t, ttnCreateEditModalTitles.ttnEditModal)}
                       width={'w-[1000px]'}>
                <form action="" onSubmit={handleSubmit(handlePut)}
                      className={'p-3 gap-5 grid grid-cols-2 justify-center items-center'}>
                    <div>
                        <label htmlFor="dispatcher">{tKey(t, 'ttnEditModal.dispatcher')}</label>
                        <Select
                            selectOptions={dispatcher}
                            getOptionLabel={(dispatcher: any) => dispatcher.name}
                            getOptionValue={(dispatcher: any) => dispatcher.code}
                            register={register}
                            options={{required: true}}
                            name='dispatcher'
                            additionalStyles={'w-full'}
                            nameOpeningModal={directoryModals.dispatcher}
                        />
                    </div>

                    <div>
                        <label htmlFor="Car">{tKey(t, 'ttnEditModal.car')}</label>
                        <Select
                            selectOptions={cars}
                            getOptionLabel={(car) => car.name}
                            getOptionValue={(car) => car.id}
                            register={register}
                            options={{required: true}}
                            name='car'
                            additionalStyles={'w-full'}
                            nameOpeningModal={directoryModals.car}
                        />
                    </div>

                    <div>
                        <label htmlFor="driver">{tKey(t, 'ttnEditModal.driver')}</label>
                        <Select
                            selectOptions={driver}
                            getOptionLabel={(driver) => driver.name}
                            getOptionValue={(driver) => driver.id}
                            register={register}
                            options={{required: true, valueAsNumber: true}}
                            name='driver'
                            additionalStyles={'w-full'}
                            nameOpeningModal={directoryModals.driver}
                        />
                    </div>

                    <div>
                        <label htmlFor="idPlant">{tKey(t, 'ttnEditModal.idPlant')}</label>
                        <Select
                            selectOptions={plant}
                            getOptionLabel={(plant) => plant.name}
                            getOptionValue={(plant) => plant.id}
                            register={register}
                            options={{required: true, valueAsNumber: true}}
                            name='idPlant'
                            additionalStyles={'w-full'}
                            handleOnChange={onChangePlant}

                        />
                    </div>
                    <div className={'items-center'}>
                        <label htmlFor="Bsu">{tKey(t, 'ttnEditModal.bsu')}</label>
                        {workingBsu && workingBsu.length <= 0 ?
                            <Select
                                selectOptions={[{name: tKey(t, 'ttnEditModal.noBsu'), code: '0'}]}
                                getOptionLabel={(workingBsu) => workingBsu.name}
                                getOptionValue={(workingBsu) => workingBsu.code}
                                register={register}
                                options={{required: tKey(t, 'errors.required'), valueAsNumber: true}}
                                name='bsu'
                                additionalStyles={'w-full'}
                            /> :
                            <Select
                                selectOptions={workingBsu}
                                getOptionLabel={(workingBsu) => workingBsu.name}
                                getOptionValue={(workingBsu) => workingBsu.code}
                                register={register}
                                options={{required: tKey(t, 'errors.required'), valueAsNumber: true}}
                                name='bsu'
                                additionalStyles={'w-full'}
                            />
                        }
                        <CustomText isError={true}>{errors?.bsu?.message?.toString()}</CustomText>
                    </div>

                    <div>
                        <label htmlFor="finishAdress">{tKey(t, 'ttnEditModal.finishAdress')}</label>
                        <Input name='finishAdress'
                               type={'search'}
                               register={register}
                               options={{required: true}}
                               additionalStyles={'w-full'}
                               placeholder={tKey(t, 'placeholders.finishAdress')}
                        />
                    </div>

                    <div>
                        <label htmlFor="finishDate">{tKey(t, 'ttnEditModal.finishDate')}</label>
                        <Input name='finishDate'
                               type={'datetime-local'}
                               register={register}
                               options={{required: true}}
                               additionalStyles={'w-full'}
                        />
                    </div>

                    <div className={'items-center'}>
                        <label htmlFor="VProduct">{tKey(t, 'ttnEditModal.vProduct')}</label>
                        <Input name='vProduct'
                               type={'number'}
                               register={register}
                               options={{required: true, valueAsNumber: true, max: car && car[0].maxV}}
                               additionalStyles={'w-full'}
                               placeholder={tKey(t, 'placeholders.vProduct')}
                               onInput={onInputMaxValue}
                        />
                    </div>

                    <div className={'flex align-items-center mt-5'}>
                        <p>{tKey(t, 'ttnEditModal.maxVolume')} {car && car[0].maxV}</p>
                    </div>

                    <div className={'col-span-2 flex items-center justify-center mt-5 gap-3'}>
                        <Button onClick={() => openModal(confirmModals.ttnEditConfirm)}>{tKey(t, 'modals.save')}</Button>
                        <Button onClick={() => closeModal(generalModals.ttnEditModal)}>{tKey(t, 'modals.close')}</Button>
                    </div>
                </form>
            </ModalForm>
            <SaveModal nameModal={confirmModals.ttnEditConfirm}
                       handleSubmit={handleSubmit((data) => handlePut(data))} error={errors}/>
        </>
    );
};

export default memo(TtnEditModal);
