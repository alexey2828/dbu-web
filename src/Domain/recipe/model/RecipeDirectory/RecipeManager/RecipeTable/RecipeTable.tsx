import React, {FC, useMemo, useState} from 'react';
import Table from "../../../../../../ui/Components/Table/table";
import {classRecipeAPI} from "../../../../../../Infrastructure/services/RecipeServices/ClassRecipeService";
import { useTranslation } from "react-i18next";
import { tKey } from "../../../../../../Infrastructure/i18n/tKey";

interface Props {
    recipes: any[];
    setCurrentRecipeCode: any;
    currentRecipeCode: any;
    reset: any;
    triggerRecipe: any;
    triggerRecipeDesc: any
    setIsSelectedButton: any
}

const RecipeTable: FC<Props> = ({
                                    recipes,
                                    setCurrentRecipeCode,
                                    currentRecipeCode,
                                    reset, triggerRecipe, triggerRecipeDesc,
                                    setIsSelectedButton
                                }) => {

    const [classFilter, setClassFilter] = useState<string>('all');
    const {data} = classRecipeAPI.useFetchAllClassRecipeQuery('')
    const { t } = useTranslation();


    // фильтрация рецептов
    const filteredRecipes = useMemo(() => {
        if (classFilter === 'all') return recipes;
        return recipes.filter(r => r.classRecipe === classFilter);
    }, [recipes, classFilter]);


    return (
        <div className="h-[40vh] flex flex-col gap-2">

            {/* SELECT */}
            <select
                className="bg-gray-50 border border-gray-300 text-gray-900
                          rounded-lg focus:ring-blue-500 focus:border-blue-500 block
                          py-2 pl-1 pr-8"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
            >
                <option value="all">{tKey(t, 'recipeManager.mixtureType')}</option>
                {data?.map((cls) => (
                    <option key={cls.code} value={cls.code}>
                        {cls.name}
                    </option>
                ))}
            </select>

            {/* TABLE */}
            <div className="overflow-y-auto">
                <Table>
                    <thead>
                    <tr>
                        <th>{tKey(t, 'recipeTable.code')}</th>
                        <th>{tKey(t, 'recipeTable.name')}</th>
                        <th>{tKey(t, 'recipeTable.date')}</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredRecipes && filteredRecipes.map((recipe: any) => (
                        <tr
                            key={recipe.id}
                            onClick={() => {
                                setCurrentRecipeCode(recipe.id);
                                triggerRecipeDesc(recipe.id);
                                triggerRecipe(recipe.id);
                                setIsSelectedButton(false)
                            }}
                            className={`${currentRecipeCode === recipe.id ? 'bg-[#FEFFCF]' : ''}`}
                        >
                            <th>{recipe.classRecipe + recipe.code_recipe}</th>
                            <th>
                                {recipe.name_recipe}
                                {recipe.comment && ` (${recipe.comment})`}
                            </th>
                            <th>{recipe.datetime}</th>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default RecipeTable;
