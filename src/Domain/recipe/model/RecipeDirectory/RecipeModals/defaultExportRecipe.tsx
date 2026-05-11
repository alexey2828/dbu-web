import React from 'react';
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import {classRecipeAPI} from "../../../../../Infrastructure/services/RecipeServices/ClassRecipeService";
import {tKey} from "../../../../../Infrastructure/i18n/tKey";
import Select from "../../../../../ui/Components/Select/select";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import Button from "../../../../../ui/Components/Button/Button";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import {bsuAPI} from "../../../../../Infrastructure/services/PlantServices/BsuService";

const DefaultExportRecipe = () => {

    const {data: classRecipe} = classRecipeAPI.useFetchAllClassRecipeQuery('')
    const {data: bsu} = bsuAPI.useFetchAllBsuQuery('')
    const {register, handleSubmit, formState: {errors, isDirty}, watch} = useForm();
    const {t} = useTranslation();
    const selectedClassRecipe = watch('bsu');
    const {openModal, closeModal} = useModal()


    const exportData = (data: any) => {
        console.log(data)

        try {
            fetch(`http://asaiot.net/dbu/api/exportMqtt/uploadRecipeToArm.php?action=send_all&codeBsu=${data.bsu}`, {
                method: 'GET',
            })
        } catch (err) {
            console.error(err)
        }
        closeModal('confirmDefaultExport')
        closeModal('DefaultExportRecipeModal')

    }

    return (
        <>
            <ModalForm modalName={'DefaultExportRecipeModal'} title={tKey(t, 'recipe.export')}
        >
            <form onSubmit={handleSubmit(exportData)} className={'flex flex-col gap-3 '}>
                <label htmlFor="self-start">БЗВ</label>
                <Select
                    selectOptions={bsu || []}
                    getOptionLabel={item => item.name}
                    getOptionValue={item => item.code}
                    register={register}
                    options={{required: t('errors.required')}}
                    name="bsu"
                    additionalStyles="w-full"
                    additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}
                />
                <div className={'flex items-center justify-center'}>
                    <Button type = 'button' disabled={!selectedClassRecipe}
                            onClick={() => openModal('confirmDefaultExport')}
                    >
                        {tKey(t, 'recipe.export')}
                    </Button>
                </div>


            </form>
        </ModalForm>
            <SaveModal
                nameModal = 'confirmDefaultExport'
                handleSubmit={handleSubmit((data) => exportData(data))}
            />
        </>

    );
};

export default DefaultExportRecipe;