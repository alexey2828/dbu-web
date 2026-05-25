import React, {FC, useEffect, useMemo} from 'react';
import Input from "../../../../../ui/Components/Input/Input";
import {compAPI} from "../../../../../Infrastructure/services/RecipeServices/CompService";
import Select from "../../../../../ui/Components/Select/select";
import {useWatch} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { tKey } from "../../../../../Infrastructure/i18n/tKey";
import {recipeAPI} from "../../../../../Infrastructure/services/RecipeServices/RecipeService";

interface Props {
    register: any
    control: any
    getValues: any
    setValue: any,
    recipeDescData: any
    currentRecipeCode: any
    reset: any,
    recipe: any,
    errors: any
}
const excludedFields = [
    'waterWinter2',
    'waterSummer2',
];

function getCategory(codeComponent: string) {
    switch (codeComponent[0]) {
        case '1': return 'water';
        case '2': return 'chem';
        case '3': return 'filler';
        case '4': return 'cement';
        default: return null;
    }
}


const RecipeDescription: FC<Props> = ({errors, register, control, getValues, setValue, currentRecipeCode, recipeDescData, reset, recipe}) => {

    const {data: compFiller} = compAPI.useFetchAllCompQuery({typeCode: '3000'})
    const {data: compWat} = compAPI.useFetchAllCompQuery({typeCode: '1000'})
    const {data: compCem} = compAPI.useFetchAllCompQuery({typeCode:'4000'})
    const {data: compChem} = compAPI.useFetchAllCompQuery({typeCode: '2000'})


    const formValues = useWatch({ control });
    const { t } = useTranslation();

    const recipeParams = useMemo(() => {
        const raw = recipe?.[0]?.recipeParam;
        if (!raw) return null;

        try {
            return JSON.parse(
                raw
                    .replace(/(\w+)\s*:/g, '"$1":')
                    .replace(/,(\s*})/g, '$1')
            );
        } catch (e) {
            console.error('Invalid recipeParam', raw);
            return null;
        }
    }, [recipe]);

    function populateForm(data: any, setValue: any) {
        if (!Array.isArray(data)) return;

        const counters: Record<string, number> = {
            water: 0,
            filler: 0,
            cement: 0,
            chem: 0,
        };

        data.forEach(item => {
            const category = getCategory(item.codeComponent);
            if (!category) return;

            counters[category] += 1;
            const idx = counters[category];

            setValue(`${category}Select${idx}`, item.codeComponent);
            setValue(`${category}Winter${idx}`, item.weightWinter);
            setValue(`${category}Summer${idx}`, item.weightSummer);
        });
    }



    const sumByPrefix = (prefixes: string[], season: 'Winter' | 'Summer') => {
        return Object.entries(formValues || {})
            .filter(([key]) =>
                prefixes.some(p => key.startsWith(p)) &&
                key.includes(season) &&
                !excludedFields.includes(key)   // <-- исключаем ненужные
            )
            .reduce((sum, [, value]) => {
                const num = Number(value);
                return sum + (isNaN(num) ? 0 : num);
            }, 0);
    };


    const winterSum = useMemo(() => {
        return sumByPrefix(['filler', 'cement', 'water'], 'Winter').toFixed(2);
    }, [formValues]);

    const summerSum = useMemo(() => {
        return sumByPrefix(['filler', 'cement', 'water'], 'Summer').toFixed(2);
    }, [formValues]);

    useEffect(() => {
        reset()
        populateForm(recipeDescData, setValue);
        if (currentRecipeCode && recipeParams) {
            setValue('maxV', recipeParams.maxV ?? '');
            setValue('mixTime', recipeParams.mixTime ?? '');
            setValue('openTime1', recipeParams.openTime1 ?? '');
            setValue('openTime2', recipeParams.openTime2 ?? '');
            setValue('fullOpenTime', recipeParams.fullOpenTime ?? '');
        }
        if (recipe) {
            setValue('code_recipe', recipe[0].code_recipe)
            setValue('classRecipe', recipe[0].classRecipe)
            setValue('strength', recipe[0].strength)
            setValue('mobil', recipe[0].mobil)
            setValue('frost', recipe[0].frost)
            setValue('wat', recipe[0].water)
            setValue('marka', recipe[0].marka)
            setValue('condition', recipe[0].condition)
            setValue('mixture', recipe[0].mixt)
        }
    }, [recipeDescData, recipeParams, recipe]);


    if (!compFiller || !compCem || !compWat || !compChem) return null;

    return (
        <>
            {compFiller && compWat && compCem && compChem && (
                <div className="grid grid-cols-1 xl:grid-cols-2 ml-10">

                    {/* ================= ЗАПОЛНИТЕЛИ ================= */}
                    <section className={'border-2 rounded-xl p-2 mr-10 border-[#FFEC8B]'}>
                        <h3 className="font-semibold mb-1">{tKey(t, 'recipeDescription.fillers')}</h3>

                        <div className="flex items-center gap-4 mb-1 pl-[12rem]">
                            <span className="w-20 text-sm text-gray-600 text-center">{tKey(t, 'recipeDescription.winter')}</span>
                            <span className="w-20 text-sm text-gray-600 text-center">{tKey(t, 'recipeDescription.summer')}</span>
                        </div>

                        {/* ===== Заполнитель 1 ===== */}
                        <div className="flex items-center gap-4 mb-1">
                            <Select
                                selectOptions={compFiller}
                                getOptionLabel={(i: any) => i.name}
                                getOptionValue={(i: any) => i.code}
                                name="fillerSelect1"
                                register={register}
                                options={{
                                    validate: (value: any) => !!value || tKey(t, 'recipeDescription.selectValue')
                                }}
                                additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                            />

                            <Input
                                name="fillerWinter1"
                                type="number"
                                register={register}
                                options={{
                                    validate: (value: any) => {
                                        const summer = getValues('fillerSummer1');
                                        const select = getValues('fillerSelect1');
                                        if (!select) return true;
                                        if (value !== '' || summer !== '') return true;
                                        return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                    }
                                }}
                                additionalStyles={`w-20 h-8 ${errors.fillerWinter1 ? 'border-red-700': ''}`}
                            />

                            <Input
                                name="fillerSummer1"
                                type="number"
                                register={register}
                                options={{
                                    validate: (value: any) => {
                                        const summer = getValues('fillerWinter1');
                                        const select = getValues('fillerSelect1');
                                        if (!select) return true;
                                        if (value !== '' || summer !== '') return true;
                                        return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                    }
                                }}
                                additionalStyles={`w-20 h-8 ${errors.fillerSummer1 ? 'border-red-700': ''}`}
                            />

                            <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>
                        </div>

                        {/* ===== Заполнитель 2 ===== */}
                        <div className="flex items-center gap-4 mb-1">
                            <Select
                                selectOptions={compFiller}
                                getOptionLabel={(i: any) => i.name}
                                getOptionValue={(i: any) => i.code}
                                name="fillerSelect2"
                                register={register}
                                additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                                additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}
                            />

                            <Input
                                name="fillerWinter2"
                                type="number"
                                register={register}
                                options={{
                                    validate: (value: any) => {
                                        const summer = getValues('fillerSummer2');
                                        const select = getValues('fillerSelect2');
                                        if (!select) return true;
                                        if (value !== '' || summer !== '') return true;
                                        return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                    }
                                }}
                                additionalStyles={`w-20 h-8 ${errors.fillerWinter2 ? 'border-red-700': ''}`}
                            />

                            <Input
                                name="fillerSummer2"
                                type="number"
                                register={register}
                                options={{
                                    validate: (value: any) => {
                                        const summer = getValues('fillerWinter2');
                                        const select = getValues('fillerSelect2');
                                        if (!select) return true;
                                        if (value !== '' || summer !== '') return true;
                                        return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                    }
                                }}
                                additionalStyles={`w-20 h-8 ${errors.fillerSummer2 ? 'border-red-700': ''}`}
                            />

                            <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>
                        </div>

                        {/* ===== Заполнитель 3 ===== */}
                        <div className="flex items-center gap-4 mb-1">
                            <Select
                                selectOptions={compFiller}
                                getOptionLabel={(i: any) => i.name}
                                getOptionValue={(i: any) => i.code}
                                name="fillerSelect3"
                                register={register}
                                additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                                additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}
                            />

                            <Input
                                name="fillerWinter3"
                                type="number"
                                register={register}
                                options={{
                                    validate: (value: any) => {
                                        const summer = getValues('fillerSummer3');
                                        const select = getValues('fillerSelect3');
                                        if (!select) return true;
                                        if (value !== '' || summer !== '') return true;
                                        return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                    }
                                }}
                                additionalStyles={`w-20 h-8 ${errors.fillerWinter3 ? 'border-red-700': ''}`}
                            />

                            <Input
                                name="fillerSummer3"
                                type="number"
                                register={register}
                                options={{
                                    validate: (value: any) => {
                                        const summer = getValues('fillerWinter3');
                                        const select = getValues('fillerSelect3');
                                        if (!select) return true;
                                        if (value !== '' || summer !== '') return true;
                                        return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                    }
                                }}
                                additionalStyles={`w-20 h-8 ${errors.fillerSummer3 ? 'border-red-700': ''}`}
                            />

                            <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>
                        </div>

                        {/* ===== Заполнитель 4 ===== */}
                        <div className="flex items-center gap-4 mb-1">
                            <Select
                                selectOptions={compFiller}
                                getOptionLabel={(i: any) => i.name}
                                getOptionValue={(i: any) => i.code}
                                name="fillerSelect4"
                                register={register}
                                additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                                additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}

                            />

                            <Input
                                name="fillerWinter4"
                                type="number"
                                register={register}
                                options={{
                                    validate: (value: any) => {
                                        const summer = getValues('fillerSummer4');
                                        const select = getValues('fillerSelect4');
                                        if (!select) return true;
                                        if (value !== '' || summer !== '') return true;
                                        return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                    }
                                }}
                                additionalStyles={`w-20 h-8 ${errors.fillerWinter4 ? 'border-red-700': ''}`}
                            />

                            <Input
                                name="fillerSummer4"
                                type="number"
                                register={register}
                                options={{
                                    validate: (value: any) => {
                                        const summer = getValues('fillerWinter4');
                                        const select = getValues('fillerSelect4');
                                        if (!select) return true;
                                        if (value !== '' || summer !== '') return true;
                                        return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                    }
                                }}
                                additionalStyles={`w-20 h-8 ${errors.fillerSummer4 ? 'border-red-700': ''}`}
                            />

                            <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>
                        </div>

                        <div className="flex items-center gap-4 mb-1">
                            <Select
                                selectOptions={compFiller}
                                getOptionLabel={(i: any) => i.name}
                                getOptionValue={(i: any) => i.code}
                                name="fillerSelect5"
                                register={register}
                                additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                                additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}

                            />

                            <Input
                                name="fillerWinter5"
                                type="number"
                                register={register}
                                options={{
                                    validate: (value: any) => {
                                        const summer = getValues('fillerSummer5');
                                        const select = getValues('fillerSelect5');
                                        if (!select) return true;
                                        if (value !== '' || summer !== '') return true;
                                        return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                    }
                                }}
                                additionalStyles={`w-20 h-8 ${errors.fillerWinter5 ? 'border-red-700': ''}`}
                            />

                            <Input
                                name="fillerSummer5"
                                type="number"
                                register={register}
                                options={{
                                    validate: (value: any) => {
                                        const summer = getValues('fillerWinter5');
                                        const select = getValues('fillerSelect5');
                                        if (!select) return true;
                                        if (value !== '' || summer !== '') return true;
                                        return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                    }
                                }}
                                additionalStyles={`w-20 h-8 ${errors.fillerSummer5 ? 'border-red-700': ''}`}
                            />

                            <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>
                        </div>
                    </section>

                        {/* ================= ЦЕМЕНТ ================= */}
                    <section className={'border-2 rounded-xl border-gray-200 p-2'}>
                        <h3 className="font-semibold mb-1">{tKey(t, 'recipeDescription.cement')}</h3>

                        <div className={''}>

                            <div className="flex items-center gap-4 mb-1 pl-[12rem]">
                                <span className="w-20 text-sm text-gray-600 text-center">{tKey(t, 'recipeDescription.winter')}</span>
                                <span className="w-20 text-sm text-gray-600 text-center">{tKey(t, 'recipeDescription.summer')}</span>
                            </div>

                            <div className="flex items-center gap-4 mb-1">
                                <Select
                                    selectOptions={compCem}
                                    getOptionLabel={(compCem: any) => compCem.name}
                                    getOptionValue={(compCem: any) => compCem.code}
                                    register={register}
                                    name="cementSelect1"
                                    additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                                />
                                <Input
                                    name="cementWinter1"
                                    register={register}
                                    type="number"
                                    additionalStyles={`w-20 h-8 ${errors.cementWinter1 ? 'border-red-700': ''}`}
                                    options={{
                                        validate: (value: any) => {
                                            const summer = getValues('cementSummer1');
                                            const select = getValues('cementSelect1');
                                            if (!select) return true;
                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}

                                />
                                <Input
                                    name="cementSummer1"
                                    register={register}
                                    type="number"
                                    additionalStyles={`w-20 h-8 ${errors.cementSummer1 ? 'border-red-700': ''}`}
                                    options={{
                                        validate: (value: any) => {
                                            const summer = getValues('cementWinter1');
                                            const select = getValues('cementSelect1');
                                            if (!select) return true;
                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>
                            </div>

                            <div className="flex items-center gap-4 mb-1">
                                <Select
                                    selectOptions={compCem}
                                    getOptionLabel={(compCem: any) => compCem.name}
                                    getOptionValue={(compCem: any) => compCem.code}
                                    register={register}
                                    name="cementSelect2"
                                    additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                                    additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}

                                />
                                <Input
                                    name="cementWinter2"
                                    register={register}
                                    type="number"
                                    additionalStyles={`w-20 h-8 ${errors.cementWinter2 ? 'border-red-700': ''}`}
                                    options={{
                                        validate: (value: any) => {
                                            const summer = getValues('cementSummer2');
                                            const select = getValues('cementSelect2');
                                            if (!select) return true;
                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <Input
                                    name="cementSummer2"
                                    register={register}
                                    type="number"
                                    additionalStyles={`w-20 h-8 ${errors.cementSummer2 ? 'border-red-700': ''}`}
                                    options={{
                                        validate: (value: any) => {
                                            const summer = getValues('cementWinter2');
                                            const select = getValues('cementSelect2');
                                            if (!select) return true;
                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <Select
                                    selectOptions={compCem}
                                    getOptionLabel={(compCem: any) => compCem.name}
                                    getOptionValue={(compCem: any) => compCem.code}
                                    register={register}
                                    name="cementSelect3"
                                    additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                                    additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}

                                />
                                <Input
                                    name="cementWinter3"
                                    register={register}
                                    type="number"
                                    additionalStyles={`w-20 h-8 ${errors.cementWinter3 ? 'border-red-700': ''}`}
                                    options={{
                                        validate: (value: any) => {
                                            const summer = getValues('cementSummer3');
                                            const select = getValues('cementSelect3');
                                            if (!select) return true;
                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <Input
                                    name="cementSummer3"
                                    register={register}
                                    type="number"
                                    additionalStyles={`w-20 h-8 ${errors.cementSummer3 ? 'border-red-700': ''}`}
                                    options={{
                                        validate: (value: any) => {
                                            const summer = getValues('cementWinter3');
                                            const select = getValues('cementSelect3');
                                            if (!select) return true;
                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>
                            </div>
                        </div>


                    </section>

                    {/* ================= ВОДА ================= */}
                    <section className = ''>
                        <div className={'border-2 rounded-xl p-2 mr-10 border-[#87CEFA] mt-6'}>
                            <h3 className="font-semibold mb-1 ">{tKey(t, 'recipeDescription.water')}</h3>

                            <div className="flex items-center gap-4 mb-1 pl-[12rem]">
                                <span className="w-20 text-sm text-gray-600 text-center">{tKey(t, 'recipeDescription.winter')}</span>
                                <span className="w-20 text-sm text-gray-600 text-center">{tKey(t, 'recipeDescription.summer')}</span>
                            </div>

                            <div className="flex items-center gap-4 mb-1">
                                <Select
                                    selectOptions={compWat}
                                    getOptionLabel={(compWat: any) => compWat.name}
                                    getOptionValue={(compWat: any) => compWat.code}
                                    register={register}
                                    name="waterSelect1"
                                    additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "

                                />
                                <Input
                                    name="waterWinter1"
                                    register={register}
                                    type="number"
                                    additionalStyles={`w-20 h-8 ${errors.waterWinter1 ? 'border-red-700': ''}`}
                                    options={{
                                        validate: (value: any) => {
                                            const summer = getValues('waterSummer1');
                                            const select = getValues('waterSelect1');
                                            if (!select) return true;
                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <Input
                                    name="waterSummer1"
                                    register={register}
                                    type="number"
                                    additionalStyles={`w-20 h-8 ${errors.waterSummer1 ? 'border-red-700': ''}`}
                                    options={{
                                        validate: (value: any) => {
                                            const summer = getValues('waterWinter1');
                                            const select = getValues('waterSelect1');
                                            if (!select) return true;
                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <Select
                                    selectOptions={compWat}
                                    getOptionLabel={(compWat: any) => compWat.name}
                                    getOptionValue={(compWat: any) => compWat.code}
                                    register={register}
                                    name="waterSelect2"
                                    additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                                    additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}

                                />
                                <Input
                                    name="waterWinter2"
                                    register={register}
                                    type="number"
                                    additionalStyles={`w-20 h-8 ${errors.waterWinter2 ? 'border-red-700': ''}`}
                                    options={{
                                        validate: (value: any) => {
                                            const summer = getValues('waterSummer2');
                                            const select = getValues('waterSelect2');
                                            if (!select) return true;
                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <Input
                                    name="waterSummer2"
                                    register={register}
                                    type="number"
                                    additionalStyles={`w-20 h-8 ${errors.waterSummer2 ? 'border-red-700': ''}`}
                                    options={{
                                        validate: (value: any) => {
                                            const summer = getValues('waterWinter2');
                                            const select = getValues('waterSelect2');
                                            if (!select) return true;
                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.percent')}</span>
                            </div>
                        </div>


                        <section className="border-2 rounded-xl p-4 mr-10 border-[#8A9597] mt-6">
                            <h3 className="font-semibold mb-3">
                                Параметри змiшувача
                            </h3>

                            <div className="flex flex-col gap-2">

                                {/* ROW */}
                                <div className="flex items-center gap-4">
                                    <label className="w-[180px]">Макс. обсяг мiшки</label>

                                    <div className="flex items-center">
                                        <Input
                                            name="maxV"
                                            register={register}
                                            type="number"
                                            defaultValue={recipeParams ? recipeParams.maxV : ''}
                                            additionalStyles={`w-20 h-8 ${errors.maxV ? 'border-red-700' : ''}`}
                                            options={{ required: true }}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                    {tKey(t, 'recipeDescription.units.m3')}
                </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="w-[180px]">
                                        {tKey(t, 'recipeDescription.mixingTime')}
                                    </label>

                                    <div className="flex items-center">
                                        <Input
                                            name="mixTime"
                                            register={register}
                                            type="number"
                                            defaultValue={recipeParams && recipeParams.mixTime}
                                            additionalStyles={`w-20 h-8 ${errors.mixTime ? 'border-red-700' : ''}`}
                                            options={{ required: true }}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                    {tKey(t, 'recipeDescription.units.sec')}
                </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="w-[180px]">Пауза на зупинцi 1</label>

                                    <div className="flex items-center">
                                        <Input
                                            name="openTime1"
                                            register={register}
                                            type="number"
                                            defaultValue={recipeParams ? recipeParams.openTime1 : ''}
                                            additionalStyles={`w-20 h-8 ${errors.openTime1 ? 'border-red-700' : ''}`}
                                            options={{ required: true }}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                    {tKey(t, 'recipeDescription.units.sec')}
                </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="w-[180px]">Пауза на зупинцi 2</label>

                                    <div className="flex items-center">
                                        <Input
                                            name="openTime2"
                                            register={register}
                                            type="number"
                                            defaultValue={recipeParams ? recipeParams.openTime2 : ''}
                                            additionalStyles={`w-20 h-8 ${errors.openTime2 ? 'border-red-700' : ''}`}
                                            options={{ required: true }}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                    {tKey(t, 'recipeDescription.units.sec')}
                </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="w-[180px]">
                                        {tKey(t, 'recipeDescription.fullOpenTime')}
                                    </label>

                                    <div className="flex items-center">
                                        <Input
                                            name="fullOpenTime"
                                            register={register}
                                            type="number"
                                            defaultValue={recipeParams ? recipeParams.fullOpenTime : ''}
                                            additionalStyles={`w-20 h-8 ${errors.fullOpenTime ? 'border-red-700' : ''}`}
                                            options={{ required: true }}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                    {tKey(t, 'recipeDescription.units.sec')}
                </span>
                                    </div>
                                </div>

                            </div>
                        </section>
                    </section>



                    {/* ================= ХИМИЯ ================= */}
                    <section>
                        <div className="border-2 rounded-xl p-2  border-[#90EE90] mt-6">
                            <h3 className="font-semibold mb-1">{tKey(t, 'recipeDescription.chemAdditives')}</h3>

                            <div className="flex items-center gap-4 mb-1 pl-[12rem]">
                                <span className="w-20 text-sm text-gray-600 text-center">{tKey(t, 'recipeDescription.winter')}</span>
                                <span className="w-20 text-sm text-gray-600 text-center">{tKey(t, 'recipeDescription.summer')}</span>
                            </div>

                            <div className="flex items-center gap-4 mb-1 text-xs">
                                <Select
                                    selectOptions={compChem}
                                    getOptionLabel={(compChem: any) => compChem.name}
                                    getOptionValue={(compChem: any) => compChem.code}
                                    register={register}
                                    name="chemSelect1"
                                    additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                                />
                                <Input
                                    name="chemWinter1"
                                    register={register}
                                    type="number"
                                    additionalStyles={`w-20 h-8 ${errors.chemWinter1 ? 'border-red-700' : ''}`}
                                    options={{
                                        max: {
                                            value: 20,
                                            message: 'Максимум 20'
                                        },
                                        validate: (value: any) => {
                                            const summer = getValues('chemSummer1');
                                            const select = getValues('chemSelect1');
                                            if (!select) return true;
                                            if (value > 20) return 'Максимум 20';

                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <Input
                                    name="chemSummer1" register={register}
                                    type="number"
                                    additionalStyles={`
                                 w-20 h-8
                                  ${errors.chemSummer1 ? 'border-red-700' : ''}
                                `}
                                    options={{
                                        max: {
                                            value: 20,
                                            message: 'Максимум 20'
                                        },
                                        validate: (value: any) => {
                                            const summer = getValues('chemWinter1');
                                            const select = getValues('chemSelect1');
                                            if (!select) return true;
                                            if (value > 20) return 'Максимум 20';

                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>


                            </div>

                            <div className="flex items-center gap-4 mb-1">
                                <Select
                                    selectOptions={compChem}
                                    getOptionLabel={(compChem: any) => compChem.name}
                                    getOptionValue={(compChem: any) => compChem.code}
                                    register={register}
                                    name="chemSelect2"
                                    additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}

                                    additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                                />
                                <Input
                                    name="chemWinter2"
                                    register={register}
                                    type="number"
                                    additionalStyles={`
                                  w-20 h-8
                                  ${errors.chemWinter2 ? 'border-red-700' : ''}
                                `}
                                    options={{
                                        max: {
                                            value: 20,
                                            message: 'Максимум 20'
                                        },
                                        validate: (value: any) => {
                                            const summer = getValues('chemSummer2');
                                            const select = getValues('chemSelect2');
                                            if (!select) return true;
                                            if (value > 20) return 'Максимум 20';

                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <Input
                                    name="chemSummer2"
                                    register={register}
                                    type="number"
                                    additionalStyles={`
                                  w-20 h-8
                                  ${errors.chemSummer2 ? 'border-red-700' : ''}
                                `}
                                    options={{
                                        max: {
                                            value: 20,
                                            message: 'Максимум 20'
                                        },
                                        validate: (value: any) => {
                                            const summer = getValues('chemWinter2');
                                            const select = getValues('chemSelect2');
                                            if (!select) return true;
                                            if (value > 20) return 'Максимум 20';

                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>
                            </div>

                            <div className="flex items-center gap-4 mb-1">
                                <Select
                                    selectOptions={compChem}
                                    getOptionLabel={(compChem: any) => compChem.name}
                                    getOptionValue={(compChem: any) => compChem.code}
                                    register={register}
                                    name="chemSelect3"
                                    additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}

                                    additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                        min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                                />
                                <Input
                                    name="chemWinter3"
                                    register={register}
                                    type="number"
                                    additionalStyles={`
                                  w-20 h-8
                                  ${errors.chemWinter3 ? 'border-red-700' : ''}
                                `}
                                    options={{
                                        max: {
                                            value: 20,
                                            message: 'Максимум 20'
                                        },
                                        validate: (value: any) => {
                                            const summer = getValues('chemSummer3');
                                            const select = getValues('chemSelect3');
                                            if (!select) return true;
                                            if (value > 20) return 'Максимум 20';

                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <Input
                                    name="chemSummer3"
                                    register={register}
                                    type="number"
                                    additionalStyles={`1
                                  w-20 h-8
                                  ${errors.chemSummer3 ? 'border-red-700' : ''}
                                `}
                                    options={{
                                        max: {
                                            value: 20,
                                            message: 'Максимум 20'
                                        },
                                        validate: (value: any) => {
                                            const summer = getValues('chemWinter3');
                                            const select = getValues('chemSelect3');
                                            if (!select) return true;
                                            if (value > 20) return 'Максимум 20';

                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <Select
                                    selectOptions={compChem}
                                    getOptionLabel={(compChem: any) => compChem.name}
                                    getOptionValue={(compChem: any) => compChem.code}
                                    register={register}
                                    name="chemSelect4"
                                    additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}
                                    additionalStyles="
                                    w-36 h-8 text-xs !p-0 !m-0
                                    min-[1600px]:w-44
                                    min-[1600px]:h-10
                                    min-[1600px]:text-base
                                "
                                />
                                <Input
                                    name="chemWinter4"
                                    register={register}
                                    type="number"
                                    additionalStyles={`
                                 w-20 h-8
                                  ${errors.chemWinter4 ? 'border-red-700' : ''}
                                `}
                                    options={{
                                        max: {
                                            value: 20,
                                            message: 'Максимум 20'
                                        },
                                        validate: (value: any) => {
                                            const summer = getValues('chemSummer4');
                                            const select = getValues('chemSelect4');
                                            if (!select) return true;
                                            if (value > 20) return 'Максимум 20';

                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}


                                />
                                <Input
                                    name="chemSummer4"
                                    register={register}
                                    type="number"
                                    additionalStyles={`
                                  w-20 h-8
                                  ${errors.chemSummer4 ? 'border-red-700' : ''}
                                `}
                                    options={{
                                        validate: (value: any) => {
                                            const summer = getValues('chemWinter4');
                                            const select = getValues('chemSelect4');
                                            if (!select) return true;
                                            if (value !== '' || summer !== '') return true;
                                            return tKey(t, 'recipeDescription.fillWinterOrSummer');
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>
                            </div>
                        </div>


                        <section className="mt-4 border-2 rounded-xl p-2  border-[#8A9597]">
                            <h3 className="font-semibold mb-2">{tKey(t, 'recipeDescription.sum')}</h3>

                            {/* Заголовки Лето/Зима */}
                            <div className="flex items-center gap-10 mb-1 ml-32">
                                <div className="w-32 text-center text-gray-600 text-sm">{tKey(t, 'recipeDescription.winter')}</div>

                                <div className="w-32 text-center text-gray-600 text-sm">{tKey(t, 'recipeDescription.summer')}</div>
                            </div>

                            {/* Инпуты с меткой Общий вес */}
                            <div className="flex items-center gap-4">
                                <label className="w-18 text-sm font-medium">{tKey(t, 'recipeDescription.totalWeight')}:</label>


                                <Input
                                    name="winterWeigthSummury"
                                    type="text"
                                    value={winterSum}
                                    register={register}
                                    additionalStyles="
                                      w-32 h-8 bg-gray-100 text-center
                                      min-[1600px]:w-40
                                      min-[1600px]:h-10
                                    "
                                    readonly
                                />

                                <Input
                                    name="summerWeigthSummury"
                                    type="text"
                                    value = {summerSum}
                                    register={register}
                                    additionalStyles="
                                      w-32 h-8 bg-gray-100 text-center
                                      min-[1600px]:w-40
                                      min-[1600px]:h-10
                                    "
                                    readonly
                                />
                                <span className="text-sm text-gray-500">{tKey(t, 'recipeDescription.units.kg')}</span>

                            </div>
                        </section>

                    </section>
                </div>
            )}
        </>


    );
};

export default RecipeDescription;