import React, {FC, useState, useEffect} from 'react';
import {ttnAPI} from "../../../../../Infrastructure/services/TtnServices/TtnService";
import SelectStateManager from "../../../../../ui/Components/Select/selectStateManager";
import {ITtn} from "../../const/ttn";
import {useLocation} from "react-router-dom";
import {customerAPI} from "../../../../../Infrastructure/services/OrderServices/CustomerService";
import {carAPI} from "../../../../../Infrastructure/services/CarServices/CarService";
import {driverAPI} from "../../../../../Infrastructure/services/DriverServices/DriverService";
import {ReactComponent as Pause} from "../../../../../Public/Images/pause.svg";
import {ReactComponent as Resume} from "../../../../../Public/Images/start.svg";
import {formatDate} from "../../../../../Infrastructure/functions/formatDate";
import {plantAPI} from "../../../../../Infrastructure/services/PlantServices/PlantService";
import {classRecipeAPI} from "../../../../../Infrastructure/services/RecipeServices/ClassRecipeService";
import {useCurrentItems} from "../../../../../Infrastructure/hooks/useCurrentItems";
import {useGetUser} from "../../../../../Infrastructure/hooks/useGetUser";
import {Roles} from "../../../../../Infrastructure/const/roles";

interface IStateManager {
    state: number | undefined;
    ttnId: number | string | undefined;
    item: ITtn | undefined;
    isLoadingTtn: boolean,
    isLoadingTtnState: boolean
    currentTtn: ITtn | undefined;
}

const TtnStateManager: FC<IStateManager> = ({state, ttnId, item, isLoadingTtn, isLoadingTtnState}) => {

    const {data} = ttnAPI.useFetchStateEntitiesQuery('');
    const [putState, {isLoading}] = ttnAPI.usePutStateEntitiesMutation();
    const location = useLocation();
    const {data: customer} = customerAPI.useFetchAllCustomersQuery(location.state.order?.idCustomer);
    const {data: car} = carAPI.useFetchAllCarQuery(item?.car);
    const {data: driver} = driverAPI.useFetchAllDriverQuery(item?.driver);
    const {data: plants} = plantAPI.useFetchAllPlantsQuery('')
    const {data: classRecipe} = classRecipeAPI.useFetchAllClassRecipeQuery(location.state.order?.classRecipe)
    const [filteredData, setFilteredData] = useState<any>();
    const {setCurrentTtn} = useCurrentItems()
    const user = useGetUser()

    const date = new Date()
    const formattedDate = formatDate(date);

    const codeToNameMap = data?.reduce((acc: any, item: any) => {
        acc[item.code.toString()] = item.name;
        return acc;
    }, {} as {[key: string]: string});

    useEffect(() => {
        if (data) {
            const item = data.find((item: any) => +item.code === state);
            setFilteredData(item);
        }
    }, [state, data]);


    const clickOnPause = async () => {

        const plantCode = plants?.find(option => option.id == item?.idPlant)?.codePlant;

        const newData = {
            state: state && data && codeToNameMap[state],
            id: ttnId && +ttnId,
            isPause:  item?.isPause === 1 ? 0 : 1,
            code: state,
            date: formattedDate,
            codePlant: plantCode,
            idPlant: item?.idPlant,
            bsu: item?.idBsu,
            json: {
                ttn: [{
                    ind_ttn: item?.id,
                    customer: customer && customer[0]?.name,
                    timetask: item?.finishDate,
                    isPause:  item?.isPause === 1 ? 0 : 1,
                    car: car && car[0]?.name,
                    driver: driver && driver[0]?.name,
                    class_recipe: classRecipe && classRecipe[0].name,
                    code_mixture_recipe: classRecipe && classRecipe[0].code,
                    name_recipe: location.state.order.nameRecipe,
                    v_product: item?.vProduct,
                }]
            }
        };
        // @ts-ignore
        await putState(newData);
    }

    const onChangeState = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const plantId = item?.idPlant
        const plantCode = plants?.find(option => option.id == plantId)?.codePlant

        const newData = {
            state: codeToNameMap[event.target.value],
            id: ttnId && +ttnId,
            isPause: item?.isPause === 1 ? 1 : 0,
            code: +event.target.value,
            date: formattedDate,
            codePlant: plantCode,
            idPlant: item?.idPlant,
            bsu: item?.idBsu,

            json: {
                ttn: [{
                    ind_ttn: item?.id,
                    customer: customer && customer[0]?.name,
                    timetask: item?.finishDate,
                    car: car && car[0]?.name,
                    isPause: item?.isPause === 1 ? 1 : 0,
                    driver: driver && driver[0]?.name,
                    class_recipe: classRecipe && classRecipe[0].name,
                    code_mixture_recipe: classRecipe && classRecipe[0].code,
                    name_recipe: location.state.order.nameRecipe,
                    v_product: item?.vProduct,
                }]
            }
        };

        // @ts-ignore
        await putState(newData);
        if (item) {
            setCurrentTtn({...item, state: +event.target.value})
        }
    };

    return (
        <div className={'flex justify-center items-center gap-2'}>
            {filteredData && (
                <SelectStateManager
                    selectOptions={JSON.parse(filteredData.options)}
                    getOptionLabel={(option) => codeToNameMap[option]}
                    getOptionValue={(option: any) => option}
                    name='option'
                    additionalStyles={'w-44'}
                    defaultValue={filteredData.name}
                    handleOnChange={onChangeState}
                    disabled={user?.user.role === Roles.GUEST}
                />
            )}

            {item?.isPause === 1 ?
                <button disabled={isLoading || isLoadingTtn || isLoadingTtnState || isLoading}>
                    <Resume onClick={clickOnPause}/>
                </button> :
                <button disabled={isLoading || isLoadingTtn || isLoadingTtnState || isLoading || user?.user.role === Roles.GUEST}>
                    <Pause onClick={clickOnPause}/>
                </button>
            }

        </div>
    );
};

export default TtnStateManager;
