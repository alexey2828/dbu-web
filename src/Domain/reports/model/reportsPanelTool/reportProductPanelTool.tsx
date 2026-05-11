import React, {Dispatch, FC, SetStateAction, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import Button from '../../../../ui/Components/Button/Button';
import Input from '../../../../ui/Components/Input/Input';
import PanelTool from '../../../../ui/Components/PanelTools/panelTool';
import Select from '../../../../ui/Components/Select/select';
import {reportsAPI} from '../../../../Infrastructure/services/ReportsServices/ReportsService';
import {plantAPI} from '../../../../Infrastructure/services/PlantServices/PlantService';
import {driverAPI} from '../../../../Infrastructure/services/DriverServices/DriverService';
import {carAPI} from '../../../../Infrastructure/services/CarServices/CarService';
import {IReports} from '../../const/reports';
import Loader from "../../../../ui/Components/Loader/Loader";
import {orderAPI} from "../../../../Infrastructure/services/OrderServices/OrderService";
import {useTranslation} from "react-i18next";
import {bsuAPI} from "../../../../Infrastructure/services/PlantServices/BsuService";

interface IReportProductPanelToolProps {
    setCurrentLoopData: Dispatch<SetStateAction<IReports | undefined>>;
    setIsVisibleCarTable: Dispatch<SetStateAction<boolean>>
    triggerCurrentLoop: any;
    setIsCleared: any;
    setIsBsuFilterApplied: Dispatch<SetStateAction<boolean>>;
    setIsApplyingFilters: Dispatch<SetStateAction<boolean>>;
}

const ReportProductPanelTool: FC<IReportProductPanelToolProps> = (
    {setCurrentLoopData, setIsVisibleCarTable, triggerCurrentLoop, setIsCleared, setIsBsuFilterApplied, setIsApplyingFilters}
) => {

    const {register, handleSubmit, formState: {errors}, reset, setError} = useForm();
    const [trigger, {isLoading: isLoadingLazyFetch}] = reportsAPI.useLazyFetchAllCurrentLoopCalculateQuery();
    const {data: plants, isLoading: isLoadingPlants} = plantAPI.useFetchAllPlantsQuery('');
    const {data: drivers, isLoading: isLoadingDrivers} = driverAPI.useFetchAllDriverQuery('');
    const {data: cars, isLoading: isLoadingCars} = carAPI.useFetchAllCarQuery('');
    const {data: orders, isLoading: isLoadingOrders} = orderAPI.useFetchAllOrdersQuery('');
    const {data: bsu, isLoading: isLoadingBsu} = bsuAPI.useFetchAllBsuQuery('');
    const {t} = useTranslation();



    useEffect(() => {
        if (!plants || !drivers || !bsu) return;

        const filterReports = localStorage.getItem('filteredReports');
        if (!filterReports) return;

        const parsedData = JSON.parse(filterReports);

        // 1. восстановили форму
        reset(parsedData);

        const {
            timeStart,
            timeEnd,
            idPlant,
            car,
            driver,
            idTtn,
            order,
            bsuCode
        } = parsedData;

        // 2. проверка как в handlePut
        if ((timeStart && !timeEnd) || (!timeStart && timeEnd)) return;

        const hasFilters =
            timeStart || timeEnd || idPlant || car || driver || idTtn || order || bsuCode;

        if (!hasFilters) return;

        // 3. применяем фильтры
        (async () => {
            try {
                const data1 = await trigger(parsedData).unwrap();

                setCurrentLoopData({
                    ...data1,
                    reportCurrentLoopByLoop: null,
                    reportCurrentLoopByLoopSum: null
                });

                setIsBsuFilterApplied(Boolean(bsuCode));

                if (idTtn) {
                    setIsVisibleCarTable(true);
                }

            } catch (err) {
                console.error(err);
            }
        })();

    }, [plants, drivers, bsu, reset]);
    useEffect(() => {
        const filterReports = localStorage.getItem('filteredReports');

        if (filterReports) {
            const parsedData = JSON.parse(filterReports);
            reset(parsedData); // 🔥 вот это главное
        }
    }, [reset]);

    const handlePut = async (data: any) => {
        await setIsCleared(true)

        const {timeStart, timeEnd, idPlant, car, driver, idTtn, order, bsuCode} = data;

        if (idTtn) {
            setIsVisibleCarTable(true)
        }

        if ((timeStart && !timeEnd) || (!timeStart && timeEnd)) {
            setError('timeStart', {type: 'manual', message: t('errors.bothStartEndRequired')});
            setError('timeEnd', {type: 'manual', message: t('errors.bothStartEndRequired')});
            return;
        }

        setIsApplyingFilters(true);
        try {
            if (!timeStart && !timeEnd && !idPlant  && !driver && !idTtn && !order && !bsuCode) {
                setIsBsuFilterApplied(false);
                try {
                    const data1 = await triggerCurrentLoop('').unwrap()
                    setCurrentLoopData({...data1, reportCurrentLoopByLoop: null,
                        reportCurrentLoopByLoopSum: null
                    })
                }
                catch (err) {
                    console.error(err)
                }
            }

            localStorage.setItem('filteredReports', JSON.stringify(data));
            const data1 = await trigger(data).unwrap()
            // @ts-ignore
            setCurrentLoopData({...data1, reportCurrentLoopByLoop: null,
                reportCurrentLoopByLoopSum: null
            })
            setIsBsuFilterApplied(Boolean(bsuCode));
        } finally {
            setIsApplyingFilters(false);
        }

    };

    const clearFields = async () => {
        reset();
        localStorage.removeItem('filteredReports');
        setIsBsuFilterApplied(false);
    }

    return (

        <PanelTool additionStyles="col-span-12">
            {!isLoadingPlants && !isLoadingDrivers && !isLoadingBsu?
                <div className="w-[98%] mx-auto">
                    {plants && drivers && (
                        <form onSubmit={handleSubmit(handlePut)} className="flex flex-wrap mt-2 gap-2">
                            <div className="relative border-white border py-5 px-2 rounded-xl mt-2">
                                    <span className="absolute -top-3 left-2 bg-gray-300 px-1 text-gray-800 text-base">
                                        {t('reports.startDate')}
                                    </span>
                                <div className="flex items-center gap-2">
                                    <p>{t('reports.from')}</p>
                                    <Input
                                        type="datetime-local"
                                        name="timeStart"
                                        register={register}
                                        options={{required: false}}
                                        additionalStyles={`${errors.timeEnd ? 'border-red-700' : ''} w-36`}
                                    />
                                    <p>{t('reports.to')}</p>
                                    <Input
                                        type="datetime-local"
                                        name="timeEnd"
                                        register={register}
                                        options={{required: false}}
                                        additionalStyles={`${errors.timeEnd ? 'border-red-700' : ''} w-36`}
                                    />
                                </div>
                            </div>

                            <div
                                className="relative flex border-white border py-5 px-2 rounded-xl items-center mt-2 gap-2">
                                <span className="absolute -top-3 left-2 bg-gray-300 px-1 text-gray-800 text-base">
                                    {t('reports.order')}
                                </span>
                                <p>{t('reports.number')}</p>
                                <Select
                                    selectOptions={orders}
                                    getOptionLabel={(orders) => orders.number}
                                    getOptionValue={(orders) => orders.id}
                                    name="order"
                                    register={register}
                                    options={{required: false}}
                                    additionalStyles={`${errors.timeEnd ? 'border-red-700' : ''}`}
                                    additionalOptionLabel={t('reports.selectValue')}
                                />
                            </div>

                            <div
                                className="relative flex border-white border py-5 px-2 rounded-xl items-center mt-2 gap-2">
                                <span className="absolute -top-3 left-2 bg-gray-300 px-1 text-gray-800 text-base">
                                    {t('reports.plant')}
                                </span>
                                <p>{t('reports.name')}</p>
                                <Select
                                    selectOptions={plants}
                                    getOptionLabel={(plant) => plant.name}
                                    getOptionValue={(plant) => plant.codePlant}
                                    name="idPlant"
                                    register={register}
                                    options={{required: false}}
                                    additionalStyles={`${errors.timeEnd ? 'border-red-700' : ''}`}
                                    additionalOptionLabel={t('reports.selectValue')}
                                />
                                <p>{t('reports.bsu')}</p>
                                <Select
                                    selectOptions={bsu}
                                    getOptionLabel={(bsu) => bsu.name}
                                    getOptionValue={(bsu) => bsu.code}
                                    name="bsuCode"
                                    register={register}
                                    options={{required: false}}
                                    additionalStyles={`${errors.timeEnd ? 'border-red-700' : ''}`}
                                    additionalOptionLabel={t('reports.selectValue')}
                                />
                            </div>

                            <div
                                className="relative flex border-white border py-5 px-2 rounded-xl items-center mt-2 gap-2">
                                <span className="absolute -top-3 left-2 bg-gray-300 px-1 text-gray-800 text-base">
                                    {t('reports.mixer')}
                                </span>
                                <p>{t('reports.driver')}</p>

                                <Select
                                    selectOptions={drivers}
                                    getOptionLabel={(driver) => driver.name}
                                    getOptionValue={(driver) => driver.name}
                                    name="driver"
                                    register={register}
                                    options={{required: false}}
                                    additionalStyles={`${errors.timeEnd ? 'border-red-700' : ''}`}
                                    additionalOptionLabel={t('reports.selectValue')}
                                />
                                <p>{t('reports.number')}</p>

                                <Select
                                    selectOptions={cars}
                                    getOptionLabel={(car) => car.name}
                                    getOptionValue={(car) => car.name}
                                    name="car"
                                    register={register}
                                    options={{required: false}}
                                    additionalStyles={`${errors.timeEnd ? 'border-red-700' : ''}`}
                                    additionalOptionLabel={t('reports.selectValue')}
                                />
                            </div>

                            <div
                                className="relative flex border-white border py-5 px-2 rounded-xl items-center mt-3 gap-2">
                                <span className="absolute -top-3 left-2 bg-gray-300 px-1 text-gray-800 text-base">
                                    {t('reports.application')}
                                </span>
                                <p>{t('reports.number')}</p>
                                <Input
                                    type="number"
                                    name="idTtn"
                                    register={register}
                                    options={{required: false}}
                                    additionalStyles={`${errors.timeEnd ? 'border-red-700' : ''} w-40`}
                                    placeholder = {t('reports.enterOrderNumber')}
                                />
                            </div>

                            <div className="flex items-center justify-center gap-2 flex-1">
                                <Button onClick={handleSubmit(handlePut)}>{t('general.display')}</Button>
                                <Button onClick={clearFields}>
                                    {t('modals.clear')}
                                </Button>
                                {/*<Button>Експорт CSV</Button>*/}
                            </div>
                        </form>
                    )}

                </div> :
                <Loader/>
            }
        </PanelTool>
    );
};

export default ReportProductPanelTool;
