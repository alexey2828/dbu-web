import React, {useEffect, useState, useRef} from 'react';
import {recipeAPI} from "../../../../Infrastructure/services/RecipeServices/RecipeService";
import globalStyles from '../../../../global.module.scss'
import RecipeManager, {RecipeManagerRef} from "./RecipeManager/RecipeManager";
import {useForm, useWatch} from "react-hook-form";
import RecipeDescription from "./RecipeDescription/RecipeDescription";
import Button from "../../../../ui/Components/Button/Button";
import {useModal} from "../../../../Infrastructure/hooks/useModal";
import SaveModal from "../../../../ui/Components/Modal/SaveModal";
import {Roles} from "../../../../Infrastructure/const/roles";
import {useGetUser} from "../../../../Infrastructure/hooks/useGetUser";
import {useTranslation} from "react-i18next";
import {tKey} from "../../../../Infrastructure/i18n/tKey";
import DefaultExportRecipe from "./RecipeModals/defaultExportRecipe";
import ExcelExportRecipe from "./RecipeModals/excelExportRecipe";
import PanelTool from "../../../../ui/Components/PanelTools/panelTool";
import s from "../../../ttn/ttn/const/ttn.module.scss";


function buildComponents(data: any, prefix: any, count: any) {
    return Array.from({length: count}, (_, i) => {
        const idx = i + 1;
        const code = data[`${prefix}Select${idx}`];
        if (!code) return null;

        return {
            codeComponent: code,
            weightSummer: data[`${prefix}Summer${idx}`] || '0',
            weightWinter: data[`${prefix}Winter${idx}`] || '0',
        };
    }).filter(Boolean);
}

const RecipeDirectory = () => {

    const {
        register,
        handleSubmit,
        formState: {errors,isDirty},
        control,
        getValues,
        setValue,
        reset,
        watch
    } = useForm();


    const {data: recipes, isLoading} = recipeAPI.useFetchAllRecipeQuery('')
    const [currentRecipeCode, setCurrentRecipeCode] = useState<any>()
    const [trigger, {data: recipeDescription}] = recipeAPI.useLazyGetRecipeDescriptionQuery()
    const [triggerRecipe, {data: recipe}] = recipeAPI.useLazyFetchAllRecipeQuery()
    const recipeManagerRef = useRef<RecipeManagerRef>(null);
    const [isSelectedButton, setIsSelectedButton] = useState(false);
    const [editRecipeDescription] = recipeAPI.useEditRecipeDescriptionMutation()
    const [editRecipe] = recipeAPI.useEditRecipeMutation()

    const [createRecipe] = recipeAPI.usePostRecipeMutation()
    const [createRecipeDescription] = recipeAPI.usePostRecipeDescriptionMutation()
    const user = useGetUser()

    const {openModal, closeModal} = useModal()
    const {t} = useTranslation();



    const confirmEdit = async (data: any) => {
        if (recipeManagerRef.current) {
            const labelsString = recipeManagerRef.current.computeLabels(data);
            setValue('allSelectLabels', labelsString, {shouldValidate: false, shouldDirty: false});
            // Обновляем data с вычисленными labels
            data.allSelectLabels = labelsString;
        }


        const components = [
            buildComponents(data, 'filler', 5),
            buildComponents(data, 'cement', 3),
            buildComponents(data, 'chem', 4),
            buildComponents(data, 'water', 2),
        ].flat();

        const recipeParamObj = {
            maxV: data.maxV,
            mixTime: data.mixTime,
            openTime1: data.openTime1,
            openTime2: data.openTime2,
            fullOpenTime: data.fullOpenTime,
            weightWinter: data.winterWeigthSummury,
            weightSummer: data.summerWeigthSummury,
        };

        const recipeParam = `{
            maxV: ${recipeParamObj.maxV},
            mixTime: ${recipeParamObj.mixTime},
            openTime1: ${recipeParamObj.openTime1},
            openTime2: ${recipeParamObj.openTime2},
            fullOpenTime: ${recipeParamObj.fullOpenTime},
            weightWinter: ${recipeParamObj.weightWinter},
            weightSummer: ${recipeParamObj.weightSummer},
        }`;

        const recipeSendData = {
            code: data.code_recipe,
            name: data.allSelectLabels,
            mixt: data.mixture,
            strength: data.strength,
            mobil: data.mobil,
            frost: data.frost,
            water: data.wat,
            marka: data.marka,
            condition: data.condition,
            classRecipe: data.classRecipe,
            recipeParam: recipeParam
        }

        try {
            editRecipe({...recipeSendData, id: currentRecipeCode})

            // @ts-ignore
            const payload = {
                "codeRecipe": currentRecipeCode,
                components,
            };
            await Promise.all(
                components.map(component =>
                    editRecipeDescription({
                        codeRecipe: currentRecipeCode,
                        ...component
                    })
                )
            );
            reset()
            setIsSelectedButton(false)
        } catch (e) {
            console.error(e)

        }
        closeModal('confirmEdit')
    }


    const confirmCreation = async (data: any) => {

        // Вычисляем labels перед отправкой формы
        if (recipeManagerRef.current) {
            const labelsString = recipeManagerRef.current.computeLabels(data);
            setValue('allSelectLabels', labelsString, {shouldValidate: false, shouldDirty: false});
            // Обновляем data с вычисленными labels
            data.allSelectLabels = labelsString;
        }


        const components = [
            buildComponents(data, 'filler', 5),
            buildComponents(data, 'cement', 3),
            buildComponents(data, 'chem', 4),
            buildComponents(data, 'water', 2),
        ].filter(group => group.length > 0);

        const recipeParamObj = {
            maxV: data.maxV,
            mixTime: data.mixTime,
            openTime1: data.openTime1,
            openTime2: data.openTime2,
            fullOpenTime: data.fullOpenTime,
            weightWinter: data.winterWeigthSummury,
            weightSummer: data.summerWeigthSummury,
        };

        const recipeParam = `{
            maxV: ${recipeParamObj.maxV},
            mixTime: ${recipeParamObj.mixTime},
            openTime1: ${recipeParamObj.openTime1},
            openTime2: ${recipeParamObj.openTime2},
            fullOpenTime: ${recipeParamObj.fullOpenTime},
            weightWinter: ${recipeParamObj.weightWinter},
            weightSummer: ${recipeParamObj.weightSummer},
        }`;

        const recipeSendData = {
            code: data.code_recipe,
            name: data.allSelectLabels,
            mixt: data.mixture,
            strength: data.strength,
            mobil: data.mobil,
            frost: data.frost,
            water: data.wat,
            marka: data.marka,
            condition: data.condition,
            classRecipe: data.classRecipe,
            recipeParam: recipeParam
        }
        try {
            const res = await createRecipe(recipeSendData).unwrap()

            // @ts-ignore
            const recipeId = res.recipeId
            const payload = {
                "codeRecipe": recipeId,
                components,
            };
            await createRecipeDescription(payload);
            setIsSelectedButton(false)
        } catch (e) {
            console.error(e)

        }
        closeModal('confirmCreation')

    };


    return (
        <div>
            <PanelTool additionStyles={s.ttnPanelTool}>
                <Button
                    onClick={() => openModal('confirmEdit')}
                    disabled={!isDirty || !currentRecipeCode}
                >
                    {t('modals.edit')}
                </Button>
            </PanelTool>
            <div className="relative w-full">


                <div
                    className=" absolute top-0 bottom-0 left-[calc(102%*5/12)] w-px bg-gray-200 pointer-events-none h-[87vh]"/>

                <form
                    onSubmit={handleSubmit(confirmCreation)}
                    className={`grid grid-cols-12 ${globalStyles.container} pt-4`}
                >


                    <div className="col-span-5">
                        <RecipeManager
                            ref={recipeManagerRef}
                            recipes={recipes}
                            register={register}
                            setCurrentRecipeCode={setCurrentRecipeCode}
                            currentRecipeCode={currentRecipeCode}
                            control={control}
                            setValue={setValue}
                            watch={watch}
                            errors={errors}
                            reset={reset}
                            triggerRecipe={triggerRecipe}
                            triggerRecipeDesc={trigger}
                            recipe={recipe}
                            setIsSelectedButton={setIsSelectedButton}
                        />

                        {user && (user.user.role === Roles.CHIEF_TECHNOLOGIST || user.user.role === Roles.ADMIN) &&
                            <div className="flex items-center mt-4 gap-2">
                                {/* Левая кнопка */}
                                <Button
                                    type="button"
                                    onClick={() => openModal('DefaultExportRecipeModal')}
                                >
                                    {tKey(t, 'recipe.export')}
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => openModal('ExcelExportRecipeModal')}
                                >
                                    Експорт/Iмпорт Excel
                                </Button>

                                {/* Центр */}
                                <div className="flex items-center justify-center gap-2 flex-1">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setCurrentRecipeCode(null)
                                            reset()
                                            if (recipes?.length) {
                                                // @ts-ignore
                                                const lastCode = recipes[recipes.length - 1].code_recipe

                                                const nextCode = (Number(lastCode) + 1)
                                                    .toString()
                                                    .padStart(lastCode.length, '0')

                                                setValue('code_recipe', nextCode)
                                                setIsSelectedButton(true)
                                            }
                                        }}
                                        disabled={isSelectedButton}
                                    >
                                        {tKey(t, 'general.create')}
                                    </Button>

                                    <Button
                                        type='button'
                                        onClick={() => openModal('confirmCreation')}
                                        disabled={!!currentRecipeCode}
                                    >
                                        {tKey(t, 'modals.save')}
                                    </Button>
                                </div>
                            </div>
                        }

                    </div>

                    <div className="col-span-7">
                        <RecipeDescription
                            register={register}
                            control={control}
                            getValues={getValues}
                            setValue={setValue}
                            recipeDescData={recipeDescription}
                            currentRecipeCode={currentRecipeCode}
                            reset={reset}
                            recipe={recipe}
                            errors={errors}

                        />
                    </div>
                </form>

                <SaveModal
                    nameModal='confirmCreation'
                    handleSubmit={handleSubmit((data) => confirmCreation(data))}
                />

                <SaveModal nameModal = 'confirmEdit'
                           handleSubmit={handleSubmit((data) => confirmEdit(data))}
                />

                {/* <SaveModal
                nameModal = 'confirmExport'
                handleSubmit={() => exportData()}
            />*/}

                <DefaultExportRecipe/>
                <ExcelExportRecipe/>

            </div>
        </div>


    );
};

export default RecipeDirectory;