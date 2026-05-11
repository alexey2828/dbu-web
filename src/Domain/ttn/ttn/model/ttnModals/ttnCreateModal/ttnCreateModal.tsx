    import React, {memo, useEffect, useState} from 'react';
import Input from "../../../../../../ui/Components/Input/Input";
import {useForm} from "react-hook-form";
import {useLocation, useNavigate} from "react-router-dom";
import Button from '../../../../../../ui/Components/Button/Button';
import {ttnAPI} from "../../../../../../Infrastructure/services/TtnServices/TtnService";
import {formatDate} from "../../../../../../Infrastructure/functions/formatDate";
import {dispatcherAPI} from "../../../../../../Infrastructure/services/DispatcherServices/DispatcherService";
import {confirmModals, directoryModals, generalModals} from "../../../../../../Infrastructure/const/modalNames";
import Select from "../../../../../../ui/Components/Select/select";
import {carAPI} from "../../../../../../Infrastructure/services/CarServices/CarService";
import {plantAPI} from "../../../../../../Infrastructure/services/PlantServices/PlantService";
import {driverAPI} from "../../../../../../Infrastructure/services/DriverServices/DriverService";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import {skipToken} from "@reduxjs/toolkit/query";
import {orderAPI} from "../../../../../../Infrastructure/services/OrderServices/OrderService";
import {bsuAPI} from "../../../../../../Infrastructure/services/PlantServices/BsuService";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import {generalLinks} from "../../../../../../Infrastructure/const/links";
import {useNotification} from "../../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../../Infrastructure/hooks/useModal";
import Loader from "../../../../../../ui/Components/Loader/Loader";
import {IBsu} from "../../../../../plants/bsu/const/bsu";
import {CustomText} from "../../../../../../ui/Components/CustomText/CustomText";
    import {useTranslation} from "react-i18next";
    import {
    ttnCreateEditModalLabels,
    ttnCreateEditModalPlaceholders,
        ttnCreateEditModalTitles
    } from "../../../const/ttnTitles";
    import {button} from "../../../../../../Infrastructure/const/generalTitles";
import { tKey } from "../../../../../../Infrastructure/i18n/tKey";

const TtnCreateModal = () => {

    const {notificationHandler} = useNotification();

    const {register, handleSubmit, formState: {errors}, setError} = useForm();
    const location = useLocation()
    const navigate = useNavigate()
    const [addTtn,  {isError: isErrorAdd, isSuccess: isSuccessAdd}] = ttnAPI.usePostTtnMutation();
    const {data: dispatcher, isLoading: isLoadingDispatcher} = dispatcherAPI.useFetchAllDispatcherQuery('')
    const {data: cars, isLoading: isLoadingCars} = carAPI.useFetchAllCarQuery('')
    const {data: plant, isLoading: isLoadingPlant} = plantAPI.useFetchAllPlantsQuery('')
    const {data: driver, isLoading: isLoadingDriver} = driverAPI.useFetchAllDriverQuery('')
    const [triggerBsu, {data: bsu, isLoading: isLoadingBSU}] = bsuAPI.useLazyFetchAllBsuQuery()
    const {openModal, closeModal, modals} = useModal();
    const isOpen = !!modals.find(item => item.name === generalModals.ttnCreateModal)
    const [currentCarId, setCurrentCarId] = useState<number | string | undefined>()
    const {data: car} = carAPI.useFetchAllCarQuery(isOpen && currentCarId ? currentCarId : skipToken)
    const [trigger, {data: orderById, isSuccess: isSuccessOrderById}] = orderAPI.useLazyFetchOrderByIdQuery()
    const [workingBsu, setWorkingBsu] = useState<IBsu[]>()

    const {t} = useTranslation()

    useEffect(() => {
        let currentPlantId = location.state?.order?.idPlant
        let currentPlant = plant && plant.find(item => +item.id === +currentPlantId)

        if (plant) {
            triggerBsu(currentPlant?.codePlant);
        }
    }, [plant, triggerBsu]);

    useEffect(() => {
        if (bsu) {
            setWorkingBsu(bsu && bsu?.filter(item => item.isWork !== 0))
        }
    }, [bsu]);

    useEffect(() => {
        cars && setCurrentCarId(cars[0].id)
    }, [isOpen]);

    useEffect(() => {
        if (isErrorAdd) {

            notificationHandler({type: 'error', message: tKey(t, 'errors.general')});
        } else if (isSuccessAdd) {

            notificationHandler({type: 'success', message: tKey(t, 'errors.success')});
        }
    }, [isErrorAdd, isSuccessAdd]);

    const handlePut = async (data: any) => {
        const date = new Date();
        const formattedDate = formatDate(date);
        const newData = {
            ...data,
            state: 21,
            idOrder: location?.state.order.id,
            date: formattedDate,
        };
        const result = await trigger(location.state.order.id);

        if (result.isSuccess && result.data && data.vProduct + result.data[0].ttnVProductSumCreated > location.state?.order.vOrder) {
            setError('vProduct', {
                type: 'manual',
                message: tKey(t, 'errors.exceededOrderVolume'),
            });
            return true
        }

        if (workingBsu && workingBsu.length == 0) {
            setError('bsu', {
                type: 'manual',
                message: tKey(t, 'errors.emptyBsu'),
            });
            return true
        }

        await addTtn(newData);
        closeModal(generalModals.ttnCreateModal)
        const order = result.data && result.data[0]
        result.data && location.state && navigate(`/${generalLinks.createEditOrder}/${location.state.order.id}`, {state: {order}})
    }

    const onInputMaxValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (car && value > car[0].maxV) {
            e.target.value = car[0].maxV.toString()
        }
    }

    const onChangeCar = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentCarId(e.target.value)
    }

    const onChangePlant = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let currentPlantId = e.target.value
        let currentPlant = plant && plant.find(item => +item.id === +currentPlantId)
        triggerBsu(currentPlant?.codePlant)
    }


    return (
        location.state && (
            <ModalForm
                modalName={generalModals.ttnCreateModal}
                title={tKey(t, ttnCreateEditModalTitles.ttnCreateModal)}
                width={'w-[1000px]'}
            >

                <SaveModal nameModal={confirmModals.ttnCreateConfirm}
                           handleSubmit={handleSubmit((data) => handlePut(data))}
                           error={errors}
                />

                {!isLoadingDispatcher && !isLoadingCars && !isLoadingPlant && !isLoadingDriver && !isLoadingBSU ?
                    <form
                        onSubmit={handleSubmit(handlePut)}
                        className={'p-3 gap-5 grid grid-cols-2 justify-center items-center'}
                    >

                        <div>
                            <label htmlFor="dispatcher">{tKey(t, ttnCreateEditModalLabels.dispatcher)}</label>
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
                            <label htmlFor="Car">{tKey(t, ttnCreateEditModalLabels.car)}</label>
                            <Select
                                selectOptions={cars}
                                getOptionLabel={(car) => car.name}
                                getOptionValue={(car) => car.id}
                                register={register}
                                options={{required: true}}
                                name='car'
                                additionalStyles={'w-full'}
                                nameOpeningModal={directoryModals.car}
                                handleOnChange={onChangeCar}
                            />
                        </div>

                        <div>
                            <label htmlFor="driver">{tKey(t, ttnCreateEditModalLabels.driver)}</label>
                            <Select
                                selectOptions={driver}
                                getOptionLabel={(driver) => driver.name}
                                getOptionValue={(driver) => driver.id}
                                register={register}
                                options={{required: true}}
                                name='driver'
                                additionalStyles={'w-full'}
                                nameOpeningModal={directoryModals.driver}
                            />
                        </div>


                        <div>
                            <label htmlFor="idPlant">{tKey(t, ttnCreateEditModalLabels.idPlant)}</label>
                            <Select
                                selectOptions={plant}
                                getOptionLabel={(plant) => plant.name}
                                getOptionValue={(plant) => plant.id}
                                register={register}
                                options={{required: true}}
                                name='idPlant'
                                additionalStyles={'w-full'}
                                defaultValue={location.state.order.idPlant}
                                handleOnChange={onChangePlant}

                            />
                        </div>
                        <div>
                            <label htmlFor="Bsu">{tKey(t, ttnCreateEditModalLabels.bsu)}</label>
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
{/*
                            <CustomText isError={true}>{errors?.bsu?.message?.toString()}</CustomText>
*/}
                        </div>
                        <div>
                            <label htmlFor="finishAdress">{tKey(t, ttnCreateEditModalLabels.finishAdress)}</label>
                            <Input name='finishAdress'
                                   type={'search'}
                                   register={register}
                                   options={{required: tKey(t, 'errors.required')}}
                                   additionalStyles={'w-full'}
                                   placeholder={tKey(t, ttnCreateEditModalPlaceholders.finishAdress)}

                            />
                            {/*<CustomText isError={true}>{errors?.finishAdress?.message?.toString()}</CustomText>*/}

                        </div>

                        <div>
                            <label htmlFor="finishDate">{tKey(t, ttnCreateEditModalLabels.finishDate)}</label>
                            <Input name='finishDate'
                                   type={'datetime-local'}
                                   register={register}
                                   options={{required: tKey(t, 'errors.required')}}
                                   additionalStyles={'w-full'}
                            />
{/*
                            <CustomText isError={true}>{errors.finishDate?.message?.toString()}</CustomText>
*/}


                        </div>
                        <div className={'items-center'}>
                            <label htmlFor="VProduct">{tKey(t, ttnCreateEditModalLabels.vProduct)}</label>
                            <Input
                                name='vProduct'
                                type={'number'}
                                register={register}
                                options={{
                                    required: tKey(t, 'errors.required'),
                                    valueAsNumber: true, max: car && car[0]?.maxV ?
                                        {value: car[0].maxV, message: tKey(t, 'errors.exceededCarVolume')} :
                                        undefined
                                }}
                                additionalStyles={'w-full'}
                                placeholder={tKey(t, ttnCreateEditModalPlaceholders.vProduct)}
                                defaultValue={14}
                                onInput={onInputMaxValue}

                            />
{/*
                            <CustomText isError={true}>{errors.vProduct?.message?.toString()}</CustomText>
*/}
                        </div>


                        <div className={'flex align-items-center mt-5'}>
                            <p>{tKey(t, 'ttnEditModal.maxVolume')}: {car && car[0].maxV}</p>

                        </div>
                        <div className={'col-span-2 flex items-center justify-center mt-5 gap-3'}>
                            <Button onClick={() => openModal(confirmModals.ttnCreateConfirm)}>{tKey(t, button.create)}</Button>
                            <Button onClick={() => closeModal(generalModals.ttnCreateModal)}>{tKey(t, button.close)}</Button>
                        </div>


                    </form> :
                    <Loader/>

                }
            </ModalForm>
        ))


};

export default TtnCreateModal;