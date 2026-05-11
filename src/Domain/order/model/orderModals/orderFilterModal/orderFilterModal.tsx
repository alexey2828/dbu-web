import React, {Dispatch, FC, memo, SetStateAction, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {customerAPI} from "../../../../../Infrastructure/services/OrderServices/CustomerService";
import {orderAPI} from "../../../../../Infrastructure/services/OrderServices/OrderService";
import Input from "../../../../../ui/Components/Input/Input";
import Select from "../../../../../ui/Components/Select/select";
import Button from "../../../../../ui/Components/Button/Button";
import {plantAPI} from "../../../../../Infrastructure/services/PlantServices/PlantService";
import {dispatcherAPI} from "../../../../../Infrastructure/services/DispatcherServices/DispatcherService";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import {generalModals} from "../../../../../Infrastructure/const/modalNames";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import {IOrder} from "../../../const/IOrder";
import s from '../../../const/order.module.scss'
import globalStyles from '../../../../../global.module.scss'
import {useTranslation} from "react-i18next";

export interface IOrderFiltersModal {
    orderState: IOrder[] | undefined,
    setOrderState: Dispatch<SetStateAction<IOrder[] | undefined>>
}

const OrderFilterModal:FC<IOrderFiltersModal> = ({setOrderState}) => {

    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    const {closeModal, modals} = useModal()
    const isOpen = !!modals.find(item => item.name === generalModals.orderFilterModal)
    const {data: customers} = customerAPI.useFetchAllCustomersQuery('');
    const {data: plant} = plantAPI.useFetchAllPlantsQuery('')
    const {data: dispatcher} = dispatcherAPI.useFetchAllDispatcherQuery('')
    const [trigger, {data: order}] = orderAPI.useLazyFetchAllOrdersQuery();
    const {t} = useTranslation()


    useEffect(() => {
        let filterOrdersData = localStorage.getItem('filterOrders')
        const parseData = filterOrdersData && JSON.parse(filterOrdersData)
        if (parseData) {
            for (let key in parseData) {
                register(key, {value: parseData[key]})
            }
        }
    }, [isOpen]);

    useEffect(() => {
        setOrderState(order)
    }, [trigger, setOrderState, order]);

    const handlePut = (data: any) => {
        localStorage.setItem('filterOrders', JSON.stringify(data));
        trigger(data)
    }
    const clearFields = () => {
        reset()
        localStorage.setItem('filterOrders', '');
    }

    return (
        <ModalForm modalName={generalModals.orderFilterModal} title = {t('general.search')}>
            <form onSubmit={handleSubmit(handlePut)} className={s.orderFilterModal_form}>
                <div>
                    <label htmlFor="dateStart">{t('labels.dateStart')}</label>
                    <Input
                        name="dateStart"
                        register={register}
                        options={{required: false}}
                        type="datetime-local"
                        additionalStyles={globalStyles.input_width_40}
                    />
                </div>
                <div>
                    <label htmlFor="dateFinish">{t('labels.dateFinish')}</label>
                    <Input
                        name="dateFinish"
                        register={register}
                        options={{required: false}}
                        type="datetime-local"
                        additionalStyles={globalStyles.input_width_40}
                    />
                </div>
                <div>
                    <label htmlFor="idPlant">{t('labels.idPlant')}</label>
                    <Select
                        selectOptions={plant}
                        getOptionLabel={(plant) => plant.name}
                        getOptionValue={(plant) => plant.id}
                        register={register}
                        options={{required: false}}
                        name="idPlant"
                        additionalStyles={globalStyles.input_width_40}
                        additionalOptionLabel={t('placeholders.enterPlant')}
                    />
                </div>

                <div>
                    <label htmlFor="idCustomer">{t('labels.idCustomer')}</label>
                    <Select
                        selectOptions={customers}
                        getOptionLabel={(customer) => customer.name}
                        getOptionValue={(customer) => customer.id}
                        register={register}
                        options={{required: false}}
                        name="idCustomer"
                        additionalStyles={globalStyles.input_width_40}
                        additionalOptionLabel={t('placeholders.enterCustomer')}
                    />
                </div>

                <div>
                    <label htmlFor="dispatcher">{t('labels.dispatcher')}</label>
                    <Select
                        selectOptions={dispatcher}
                        getOptionLabel={(dispatcher: any) => dispatcher.name}
                        getOptionValue={(dispatcher: any) => dispatcher.code}
                        register={register}
                        options={{required: false}}
                        name="dispatcher"
                        additionalStyles={globalStyles.input_width_40}
                        additionalOptionLabel={t('placeholders.enterDispatcher')}
                    />
                </div>

                <div>
                    <label htmlFor="nameRecipe">{t('labels.nameRecipe')}</label>
                    <Input
                        type="search"
                        register={register}
                        options={{required: false}}
                        name="nameRecipe"
                        additionalStyles={globalStyles.input_width_40}
                    />
                </div>

            </form>

            <div className={s.orderFilterModal_form_buttons_container}>
                <Button onClick={handleSubmit((data) => handlePut(data))}>
                    {t('modals.apply')}
                </Button>
                <Button onClick={clearFields}>
                    {t('modals.clear')}

                </Button>
                <Button onClick={() => closeModal(generalModals.orderFilterModal)}>
                    {t('modals.close')}
                </Button>
            </div>

        </ModalForm>
    );
};

export default memo(OrderFilterModal);