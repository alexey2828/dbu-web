import React, { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { customerAPI } from "../../../../Infrastructure/services/OrderServices/CustomerService";
import { orderAPI } from "../../../../Infrastructure/services/OrderServices/OrderService";
import Select from "../../../../ui/Components/Select/select";
import Input from "../../../../ui/Components/Input/Input";
import { formatDate } from "../../../../Infrastructure/functions/formatDate";
import { plantAPI } from "../../../../Infrastructure/services/PlantServices/PlantService";
import { directoryModals, generalModals } from "../../../../Infrastructure/const/modalNames";
import { dispatcherAPI } from "../../../../Infrastructure/services/DispatcherServices/DispatcherService";
import { classRecipeAPI } from "../../../../Infrastructure/services/RecipeServices/ClassRecipeService";
import { generalLinks } from "../../../../Infrastructure/const/links";
import { useNotification } from "../../../../Infrastructure/hooks/useNotification";
import { useCurrentItems } from "../../../../Infrastructure/hooks/useCurrentItems";
import Loader from "../../../../ui/Components/Loader/Loader";
import globalStyles from '../../../../global.module.scss'
import { CustomText } from "../../../../ui/Components/CustomText/CustomText";
import { useTranslation } from "react-i18next";
import { recipeAPI } from '../../../../Infrastructure/services/RecipeServices/RecipeService';
import { tKey } from "../../../../Infrastructure/i18n/tKey";

interface IOrderInputForm {
    formRef: React.RefObject<HTMLFormElement>;
    pressedAction: any
    setPressedAction: Dispatch<SetStateAction<any>>
}

const OrderInputForm: FC<IOrderInputForm> = ({
    formRef,
    pressedAction,
    setPressedAction,

}) => {

    const { notificationHandler } = useNotification();
    const { register, handleSubmit, formState: { errors, isDirty }, setValue } = useForm();
    const locationState = useLocation().state?.order;
    const { data: customers } = customerAPI.useFetchAllCustomersQuery('');
    const { data: orders, refetch } = orderAPI.useFetchAllOrdersQuery('');
    const { data: plants } = plantAPI.useFetchAllPlantsQuery('')
    const { data: dispatcherData } = dispatcherAPI.useFetchAllDispatcherQuery('')
    const { data: classRecipeData } = classRecipeAPI.useFetchAllClassRecipeQuery('')
    const { currentRecipeName, setCurrentRecipeName } = useCurrentItems()
    const { data: recipes } = recipeAPI.useFetchAllRecipeQuery('')

    const [editOrder, { isError: isEditError, isSuccess: isEditSuccess }] = orderAPI.useEditOrderFieldsMutation()
    const [addOrder, { isError: isAddError, isSuccess: isAddSuccess }] = orderAPI.usePostOrdersMutation();
    const navigate = useNavigate()
    const { t } = useTranslation()

    useEffect(() => {
        if (isDirty) {
            setPressedAction((prevState: any) => ({ ...prevState, isDirty: false }));
        }
    }, [isDirty]);


    useEffect(() => {
        if (isEditError || isAddError) {
            notificationHandler({ type: 'error', message: tKey(t, 'errors.general') });
        } else if (isEditSuccess || isAddSuccess) {
            notificationHandler({ type: 'success', message: tKey(t, 'errors.success') });
        }
    }, [isEditError, isAddError, isEditSuccess, isAddSuccess]);

    const handlePut = async (data: any) => {
        const date = new Date();
        const formattedDate = formatDate(date)

        if (pressedAction.action === 'create') {
            const newData = {
                ...data,
                dateCreate: formattedDate,
                number: formattedDate,
                state: 0,
                classRecipe: '1',
                
                adress: 'Адресс'
            };
            await addOrder(newData)
            await refetch()

        } else if (pressedAction.action === 'save') {
            const newData = {
                ...data,
                id: Number(locationState.id),
                dateCreate: locationState.dateCreate,
                number: locationState.number,
                state: locationState.state,
                adress: 'Адресс'
            };
            await editOrder(newData);
        }

    };
    useEffect(() => {
        if (isAddSuccess) {
            let order = orders && orders[orders.length - 1];
            order && navigate(`/${generalLinks.createEditOrder}/${order.id}`, { state: { order } })
        }
    }, [refetch, orders]);

    // Сетаем nameRecipe из модалки или с локал стоража или пустое значение
    /* useEffect(() => {
        setValue('nameRecipe', currentRecipeName || (locationState && locationState.nameRecipe) || '');
    }, [currentRecipeName, locationState, setValue, setCurrentRecipeName]); */

    // переход на ту же страницу create-order-page при изменении данных в ttn
    useEffect(() => {
        const order = locationState && orders?.find(item => item.id === locationState.id)
        if (isEditSuccess) {
            locationState && order && navigate(`/${generalLinks.createEditOrder}/${locationState.id}`, { state: { order } })
        }
    }, [isEditSuccess, orders])


    const onInputMaxValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value > 300) {
            e.target.value = '2000';
        }

    }

    return (
        <form onSubmit={handleSubmit(handlePut)} ref={formRef}
            className={`${globalStyles.container} ${globalStyles.indent_top}`}>

            {customers && orders && classRecipeData && recipes ? (
                <>
                    <div className={'flex'}>
                        <div className={'relative flex border-gray-300 border py-5 px-2 rounded-xl'}>
                            <span className="absolute -top-3.5 left-2 bg-white px-1 text-gray-500 text-base">
                                {tKey(t, 'labels.general')}
                            </span>

                            <div>
                                <label htmlFor="idCustomer"
                                    className={'text-black text-base'}>{tKey(t, 'labels.idCustomer')}</label>
                                <Select
                                    register={register}
                                    options={{ required: tKey(t, 'errors.required'), valueAsNumber: true }}
                                    selectOptions={customers}
                                    getOptionLabel={(customer) => customer.name}
                                    getOptionValue={(customer) => customer.id}
                                    name="idCustomer"
                                    additionalStyles={'w-44'}
                                    defaultValue={locationState?.idCustomer}
                                    nameOpeningModal={directoryModals.customer}
                                />
                                <CustomText isError={true}>{errors.idCustomer?.message?.toString()}</CustomText>
                            </div>

                            <div className={'ml-4'}>
                                <label htmlFor="nameRecipe"
                                    className={'text-black text-base'}>{tKey(t, 'labels.nameRecipe')}</label>


                                <Select
                                    name={'nameRecipe'}
                                    selectOptions={recipes}
                                    getOptionLabel={(recipe: any) => recipe.name_recipe}
                                    getOptionValue={(recipe: any) => recipe.name_recipe}
                                    register={register}
                                    options={{ required: tKey(t, 'errors.required') }}
                                    additionalStyles={'w-56'}
                                    defaultValue={locationState?.nameRecipe}
                                />


                                <CustomText isError={true}>{errors.nameRecipe?.message?.toString()}</CustomText>
                            </div>

                            <div className={'ml-4'}>
                                <label htmlFor="classRecipe"
                                    className={'text-black text-base'}>{tKey(t, 'labels.classRecipe')}</label>
                                <Select
                                    selectOptions={classRecipeData}
                                    getOptionLabel={(classRecipeData) => classRecipeData.name}
                                    getOptionValue={(classRecipeData) => classRecipeData.id}
                                    register={register}
                                    options={{ required: tKey(t, 'errors.required') }}
                                    name="classRecipe"
                                    additionalStyles={'w-48'}
                                    defaultValue={locationState?.classRecipe}
                                />
                                <CustomText isError={true}>{errors.classRecipe?.message?.toString()}</CustomText>
                            </div>

                            <div className={'ml-4'}>
                                <label htmlFor="vOrder" className={'text-black text-base'}>{tKey(t, 'labels.vOrder')}</label>
                                <div className={'flex items-center'}>
                                    <Input
                                        name="vOrder"
                                        register={register}
                                        options={{ required: tKey(t, 'errors.required'), valueAsNumber: true, max: 2000 }}
                                        type="number"
                                        defaultValue={locationState?.vOrder || 10}
                                        placeholder={tKey(t, 'placeholders.enterVolume')}
                                        onInput={onInputMaxValue}
                                    />
                                    <p className={'ml-1 text-gray-400 text-base'}>м³</p>
                                </div>
                                <CustomText isError={true}>{errors.vOrder?.message?.toString()}</CustomText>
                            </div>

                            <div className={'ml-4'}>
                                <label htmlFor="idPlant"
                                    className={'text-black text-base'}>{tKey(t, 'labels.idPlant')}</label>
                                <Select
                                    selectOptions={plants}
                                    getOptionLabel={(plants) => plants.name}
                                    getOptionValue={(plants) => plants.id}
                                    register={register}
                                    options={{ required: tKey(t, 'errors.required') }}
                                    name="idPlant"
                                    additionalStyles="w-40"
                                    defaultValue={locationState?.idPlant}
                                    nameOpeningModal={directoryModals.plants}
                                />
                                <CustomText isError={true}>{errors.idPlant?.message?.toString()}</CustomText>
                            </div>

                            <div className={'ml-4'}>
                                <label htmlFor="dispatcher"
                                    className={'text-black text-base'}>{tKey(t, 'labels.dispatcher')}</label>
                                <Select
                                    selectOptions={dispatcherData}
                                    getOptionLabel={(dispatcher: any) => dispatcher.name}
                                    getOptionValue={(dispatcher: any) => dispatcher.code}
                                    register={register}
                                    options={{ required: tKey(t, 'errors.required') }}
                                    name="dispatcher"
                                    additionalStyles="w-40"
                                    defaultValue={locationState?.dispatcher}
                                    nameOpeningModal={directoryModals.dispatcher}
                                />
                                <CustomText isError={true}>{errors.dispatcher?.message?.toString()}</CustomText>
                            </div>
                        </div>
                    </div>

                    <div className={'flex mt-4'}>
                        <div className="relative flex border border-gray-300 w-fit pr-5 py-5 pl-2 rounded-xl">
                            <span className="absolute -top-3.5 left-2 bg-white px-1 text-gray-500 text-base">
                                {tKey(t, 'labels.distance')}
                            </span>

                            <div>
                                <label htmlFor="fromObject"
                                    className="mr-2 text-black text-base">{tKey(t, 'labels.fromObject')}</label>
                                <Input
                                    name="fromObject"
                                    register={register}
                                    options={{ required: tKey(t, 'errors.required'), valueAsNumber: true }}
                                    type="search"
                                    additionalStyles="w-44"
                                    placeholder={tKey(t, 'placeholders.enterDistanceTo')}
                                    defaultValue={locationState?.fromObject}
                                />
                                <CustomText isError={true}>{errors.fromObject?.message?.toString()}</CustomText>
                            </div>

                            <div className="ml-3">
                                <label htmlFor="toObject"
                                    className="mr-2 text-black text-base">{tKey(t, 'labels.toObject')}</label>
                                <Input
                                    name="toObject"
                                    register={register}
                                    options={{ required: tKey(t, 'errors.required'), valueAsNumber: true }}
                                    type="search"
                                    placeholder={tKey(t, 'placeholders.enterDistanceFrom')}
                                    defaultValue={locationState?.toObject}
                                />
                                <CustomText isError={true}>{errors.toObject?.message?.toString()}</CustomText>
                            </div>
                        </div>

                        <div className={'relative flex border border-gray-300 w-fit pr-5 py-5 pl-2 rounded-xl ml-4'}>
                            <span className="absolute -top-3.5 left-2 bg-white px-1 text-gray-500 text-base">
                                {tKey(t, 'labels.delivery')}
                            </span>

                            <div>
                                <p className={'mr-1 text-black text-base'}>{tKey(t, 'labels.dateStart')}</p>
                                <Input
                                    name="dateStart"
                                    register={register}
                                    options={{ required: tKey(t, 'errors.required') }}
                                    type="datetime-local"
                                    defaultValue={locationState?.dateStart}
                                />
                                <CustomText isError={true}>{errors.dateStart?.message?.toString()}</CustomText>
                            </div>

                            <div className={'ml-8'}>
                                <p className={'mr-1 text-black text-base'}>{tKey(t, 'labels.dateFinish')}</p>
                                <Input
                                    name="dateFinish"
                                    register={register}
                                    options={{ required: tKey(t, 'errors.required') }}
                                    type="datetime-local"
                                    defaultValue={locationState?.dateFinish}
                                />
                                <CustomText isError={true}>{errors.dateFinish?.message?.toString()}</CustomText>
                            </div>

                            <div className={'ml-8 relative'}>
                                <label htmlFor="interval"
                                    className={'text-black text-base'}>{tKey(t, 'labels.interval')}</label>
                                <div className={'flex items-center'}>
                                    <Input
                                        name="interval"
                                        register={register}
                                        options={{ required: tKey(t, 'errors.required'), valueAsNumber: true }}
                                        type="search"
                                        placeholder={tKey(t, 'placeholders.enterInterval')}
                                        defaultValue={locationState?.interval}
                                    />
                                    <p className={'ml-1 text-gray-400 text-base'}>мин</p>
                                </div>
                                <CustomText isError={true}>{errors.interval?.message?.toString()}</CustomText>
                            </div>
                        </div>
                    </div>


                </>

            ) :
                <Loader />}

        </form>
    );
};

export default OrderInputForm;