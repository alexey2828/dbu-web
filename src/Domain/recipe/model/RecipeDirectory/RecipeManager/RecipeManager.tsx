import React, {FC, useEffect, useLayoutEffect, useMemo, useRef, useImperativeHandle, forwardRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

import Select from '../../../../../ui/Components/Select/select';
import Input from '../../../../../ui/Components/Input/Input';
import RecipeTable from './RecipeTable/RecipeTable';

import {classRecipeAPI} from '../../../../../Infrastructure/services/RecipeServices/ClassRecipeService';
import {mixtureAPI} from '../../../../../Infrastructure/services/RecipeServices/MixtureService';
import {recStrengthAPI} from '../../../../../Infrastructure/services/RecipeServices/RecStrengthService';
import {recMobilityAPI} from '../../../../../Infrastructure/services/RecipeServices/recMobilityService';
import {recFrostAPI} from '../../../../../Infrastructure/services/RecipeServices/RecFrostService';
import {recWatAPI} from '../../../../../Infrastructure/services/RecipeServices/RecWatService';
import {markaAPI} from '../../../../../Infrastructure/services/RecipeServices/MarkaService';
import {recCommentAPI} from '../../../../../Infrastructure/services/RecipeServices/recCommentService';
import {recipeAPI} from "../../../../../Infrastructure/services/RecipeServices/RecipeService";
import {plantAPI} from "../../../../../Infrastructure/services/PlantServices/PlantService";
import { tKey } from "../../../../../Infrastructure/i18n/tKey";

interface Props {
    recipes: any;
    currentRecipeCode: any;
    setCurrentRecipeCode: any;
    register: any;
    watch: any;
    setValue: any;
    control: any;
    errors: any
    reset: any
    triggerRecipe: any;
    triggerRecipeDesc: any
    recipe: any
    setIsSelectedButton: any
}

export interface RecipeManagerRef {
    computeLabels: (formData: any) => string;
}

const RecipeManager = forwardRef<RecipeManagerRef, Props>(({
                                                               recipes,
                                                               currentRecipeCode,
                                                               setCurrentRecipeCode,
                                                               register,
                                                               watch,
                                                               setValue,
                                                               errors,
                                                               reset,
                                                               triggerRecipe,
                                                               triggerRecipeDesc,
                                                               recipe,
                                                               setIsSelectedButton
                                                           }, ref) => {
    const {t} = useTranslation();

    // API
    const {data: classRecipe} = classRecipeAPI.useFetchAllClassRecipeQuery('');
    const {data: mixture} = mixtureAPI.useFetchAllMixtureQuery('');
    const {data: strength} = recStrengthAPI.useFetchAllRecStrengthQuery('');
    const {data: mobil} = recMobilityAPI.useFetchAllRecMobilityQuery('');
    const {data: frost} = recFrostAPI.useFetchAllRecFrostQuery('');
    const {data: wat} = recWatAPI.useFetchAllRecWatQuery('');
    const {data: marka} = markaAPI.useFetchAllMarkaQuery('');
    const {data: condition} = recCommentAPI.useFetchAllRecCommentQuery('');

    // Отслеживаем изменения в Select'ах
    const watchedClassRecipe = watch('classRecipe');
    const watchedMixture = watch('mixture');
    const watchedStrength = watch('strength');
    const watchedMobil = watch('mobil');
    const watchedFrost = watch('frost');
    const watchedWat = watch('wat');
    const watchedMarka = watch('marka');
    const watchedCondition = watch('condition');



    useEffect(() => {
        const selectedCode = watch('classRecipe');
        const item = classRecipe && classRecipe.find(i => i.code === selectedCode);
        if (item) {
            setValue('mixture', item.shortName);
        }
    }, [watch('classRecipe')]);


    // Функция вычисления labels на основе данных формы
    const computeLabels = (formData: any): string => {
        if (!classRecipe || !mixture || !strength || !mobil || !frost || !wat || !marka || !condition) {
            return '';
        }

        const labels: string[] = [];

        // Вид смеси


        if (formData.classRecipe && classRecipe) {
            const selectedItem = classRecipe.find((item: any) => item.code === formData.classRecipe);
            if (selectedItem) {
                labels.push(selectedItem.shortName);
            }
        }

        // Прочность
        if (formData.strength && strength) {
            const selectedItem = strength.find((item: any) => item.code === formData.strength);
            if (selectedItem) {
                labels.push(selectedItem.name);
            }
        } else {
            labels.push('-');
        }

        // Марка
        if (formData.marka && marka) {
            const selectedItem = marka.find((item: any) => item.code === formData.marka);
            if (selectedItem) {
                labels.push(selectedItem.name);
            }
        } else {
            labels.push('-');
        }
        // Пластичность
        if (formData.mobil && mobil) {
            const selectedItem = mobil.find((item: any) => item.code === formData.mobil);
            if (selectedItem) {
                labels.push(selectedItem.name);
            }
        } else {
            labels.push('-');
        }

        // Морозостойкость
        if (formData.frost && frost) {
            const selectedItem = frost.find((item: any) => item.code === formData.frost);
            if (selectedItem) {
                labels.push(selectedItem.name);
            }
        } else {
            labels.push('-');
        }

        // Водонепроницаемость
        if (formData.wat && wat) {
            const selectedItem = wat.find((item: any) => item.code === formData.wat);
            if (selectedItem) {
                labels.push(selectedItem.name);
            } else {
                labels.push('-');
            }
        } else {
            labels.push('-');
        }
        // Условия
        if (formData.condition) {


            labels.push(formData.condition);

        } else {
            labels.push('-');
        }

        return labels.join(' ');
    };

    // Экспортируем функцию через ref
    useImperativeHandle(ref, () => ({
        computeLabels
    }));

    // Вычисляем labels синхронно через useMemo для обновления UI
    const labelsString = useMemo(() => {
        if (!classRecipe || !mixture || !strength || !mobil || !frost || !wat || !marka || !condition) {
            return '';
        }

        const formData = {
            classRecipe: watchedClassRecipe,
            mixture: watchedMixture,
            strength: watchedStrength,
            mobil: watchedMobil,
            frost: watchedFrost,
            wat: watchedWat,
            marka: watchedMarka,
            condition: watchedCondition
        };

        return computeLabels(formData);
    }, [
        watchedClassRecipe,
        watchedMixture,
        watchedStrength,
        watchedMobil,
        watchedFrost,
        watchedWat,
        watchedMarka,
        watchedCondition,
        classRecipe,
        mixture,
        strength,
        mobil,
        frost,
        wat,
        marka,
        condition
    ]);

    // Обновляем скрытое поле с labels при изменении labelsString
    // Используем useLayoutEffect для синхронного обновления перед отрисовкой
    useLayoutEffect(() => {
        setValue('allSelectLabels', labelsString, {shouldValidate: false, shouldDirty: false});
    }, [labelsString, setValue]);


    // @ts-ignore
    const mobilSorted =
        mobil && [...mobil].sort((a, b) =>
            a.name.localeCompare(b.name)
        );





    return (
        <div className="grid gap-6">
            <input type="hidden" {...register('allSelectLabels')} />

            {/* Вид смеси */}


            {/* Основные характеристики */}
            <div className="relative border-gray-300 border py-5 px-4 rounded-xl">
                <div className="flex items-center gap-4">
                    <label>{tKey(t, 'recipeManager.mixtureType')}</label>
                    <Select
                        selectOptions={classRecipe || []}
                        getOptionLabel={item => item.name}
                        getOptionValue={item => item.code}
                        register={register}
                        options={{required: t('errors.required')}}
                        name="classRecipe"
                        additionalStyles="w-full"
                        additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}
                    />
                </div>
                <div className="grid grid-cols-5 gap-2 mb-4">
                    <div>
                        <label style={{visibility: 'hidden'}}>{tKey(t, 'recipeManager.mixtureShort')}</label>
                        {/*<Select
                            selectOptions={classRecipe || []}
                            getOptionLabel={(item: any) => item.shortName}
                            getOptionValue={(item: any) => item.shortName}
                            name="mixture"
                            register={register}
                            additionalStyles="w-22"
                        />*/}
                        <Input
                            name='mixture'
                            register={register}
                            type='text'
                            additionalStyles="w-36 h-10"
                            placeholder={tKey(t, 'recipeManager.mixtureType')}
                            readonly={true}
                        />
                    </div>

                    <div>
                        <label>{tKey(t, 'recipeManager.strength')}</label>
                        <Select
                            selectOptions={strength || []}
                            getOptionLabel={item => item.name}
                            getOptionValue={item => item.code}
                            register={register}
                            name="strength"
                            additionalStyles="w-36 !m-0 !p-0 h-10"
                            additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}

                        />
                    </div>

                    <div>
                        <label>{tKey(t, 'recipeManager.mobility')}</label>
                        <Select
                            selectOptions={mobilSorted || []}
                            getOptionLabel={item => item.name}
                            getOptionValue={item => item.code}
                            register={register}
                            name="mobil"
                            additionalStyles="w-36 !m-0 !p-0 h-10"
                            additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}

                        />
                    </div>

                    <div>
                        <label>{tKey(t, 'recipeManager.frost')}</label>
                        <Select
                            selectOptions={frost || []}
                            getOptionLabel={item => item.name}
                            getOptionValue={item => item.code}
                            register={register}
                            name="frost"
                            additionalStyles="w-36 !m-0 !p-0 h-10"
                            additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}

                        />
                    </div>

                    <div>
                        <label>{tKey(t, 'recipeManager.waterResistance')}</label>
                        <Select
                            selectOptions={wat || []}
                            getOptionLabel={item => item.name}
                            getOptionValue={item => item.code}
                            register={register}
                            name="wat"
                            additionalStyles="w-36 !m-0 !p-0 h-10"
                            additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}

                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div>
                        <label>{tKey(t, 'recipeManager.marka')}</label>
                        <Select
                            selectOptions={marka || []}
                            getOptionLabel={item => item.name}
                            getOptionValue={item => item.code}
                            register={register}
                            name="marka"
                            additionalStyles="w-36 !m-0 !p-0 h-10"
                            additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}

                        />
                    </div>

                    <div>
                        <label>{tKey(t, 'recipeManager.conditions')}</label>
                        <Input
                            type='text'
                            register={register}
                            name="condition"
                            additionalStyles="w-64 h-10"
                            placeholder={tKey(t, 'recipeManager.enterConditions')}
                        />
                    </div>

                    <div>
                        <label>{tKey(t, 'recipeManager.code')}</label>
                        <Input
                            name="code_recipe"
                            register={register}
                            options={{required: t('errors.required')}}
                            type="text"
                            placeholder={tKey(t, 'recipeManager.enterCode')}
                            additionalStyles={`${errors.code_recipe ? 'border-red-700' : ''}`}

                        />
                    </div>
                </div>
            </div>

            <RecipeTable
                recipes={recipes}
                setCurrentRecipeCode={setCurrentRecipeCode}
                currentRecipeCode={currentRecipeCode}
                reset={reset}
                triggerRecipe={triggerRecipe}
                triggerRecipeDesc={triggerRecipeDesc}
                setIsSelectedButton = {setIsSelectedButton}
            />
        </div>
    );
});

RecipeManager.displayName = 'RecipeManager';

export default RecipeManager;
