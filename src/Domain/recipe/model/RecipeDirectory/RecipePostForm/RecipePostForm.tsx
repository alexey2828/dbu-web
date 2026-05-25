import React, {useContext, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {mixtureAPI} from "../../../../../Infrastructure/services/RecipeServices/MixtureService";
import {recipeAPI} from "../../../../../Infrastructure/services/RecipeServices/RecipeService";
import Input from "../../../../../ui/Components/Input/Input";
import Button from "../../../../../ui/Components/Button/Button";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import {recStrengthAPI} from "../../../../../Infrastructure/services/RecipeServices/RecStrengthService";
import {recMobilityAPI} from "../../../../../Infrastructure/services/RecipeServices/recMobilityService";
import {recFrostAPI} from "../../../../../Infrastructure/services/RecipeServices/RecFrostService";
import {recWatAPI} from "../../../../../Infrastructure/services/RecipeServices/RecWatService";
import {markaAPI} from "../../../../../Infrastructure/services/RecipeServices/MarkaService";
import Select from "../../../../../ui/Components/Select/select";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import {confirmModals, directoryModals} from "../../../../../Infrastructure/const/modalNames";
import {useNotification} from "../../../../../Infrastructure/hooks/useNotification";
import {useModal} from "../../../../../Infrastructure/hooks/useModal";
import {CustomText} from "../../../../../ui/Components/CustomText/CustomText";
import TextArea from "../../../../../ui/Components/Textarea/TextArea";
import {recCommentAPI} from "../../../../../Infrastructure/services/RecipeServices/recCommentService";
import {useTranslation} from "react-i18next";
import { tKey } from "../../../../../Infrastructure/i18n/tKey";
const RecipePostForm = () => {

    const { notificationHandler } = useNotification();
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [putData, {isError, isSuccess}] = recipeAPI.usePostRecipeMutation()
    const {data: strength} = recStrengthAPI.useFetchAllRecStrengthQuery('')
    const {data: mobility} = recMobilityAPI.useFetchAllRecMobilityQuery('')
    const {data: frost} = recFrostAPI.useFetchAllRecFrostQuery('')
    const {data: water} = recWatAPI.useFetchAllRecWatQuery('')
    const {data: marka} = markaAPI.useFetchAllMarkaQuery('')
    const {data: cond} = recCommentAPI.useFetchAllRecCommentQuery('')

    const { openModal, closeModal } = useModal();
    const {t} = useTranslation();

    useEffect(() => {
        if (isError ) {
            notificationHandler({ type: 'error', message: tKey(t, 'errors.general') });
        } else if (isSuccess ) {
            notificationHandler({ type: 'success', message: tKey(t, 'errors.success') });
        }
    }, [isError, isSuccess]);

    const handlePut = async (data: any) => {
        await putData(data)
        closeModal(directoryModals.recipe)
    };

    return (
        <>
            <ModalForm modalName={directoryModals.recipe} width={'w-[700px]'} title={tKey(t, 'recipe.titleCreate')}>

                <form onSubmit={handleSubmit(handlePut)} >

                    <div>
                        <label htmlFor="">{tKey(t, 'RecipeHeader.condition')}</label>
                        <Select
                            selectOptions={cond}
                            getOptionLabel={(cond) => cond.name}
                            getOptionValue={(cond) => cond.id}
                            register={register}
                            options={{required: tKey(t, 'errors.required')}}
                            name='condition'
                            additionalStyles={'w-full'}
                            nameOpeningModal={directoryModals.recStrength}
                        />
                        <CustomText isError={true}>{errors.condition?.message?.toString()}</CustomText>

                    </div>



                    <div className={''}>
                        <label htmlFor="mixt" className={'text-black text-base'}>{tKey(t, 'RecipeHeader.strength')}</label>
                        <Select
                            selectOptions={strength}
                            getOptionLabel={(strength) => strength.name}
                            getOptionValue={(strength) => strength.id}
                            register={register}
                            options={{required: tKey(t, 'errors.required')}}
                            name='strength'
                            additionalStyles={'w-full'}
                            nameOpeningModal={directoryModals.recStrength}
                        />
                        <CustomText isError={true}>{errors.strength?.message?.toString()}</CustomText>

                    </div>

                    <div className={''}>
                        <label htmlFor="mixt" className={'text-black text-base'}>{tKey(t, 'RecipeHeader.mobil')}</label>
                        <Select
                            selectOptions={mobility}
                            getOptionLabel={(mobility) => mobility.name}
                            getOptionValue={(mobility) => mobility.id}
                            register={register}
                            options={{required: tKey(t, 'errors.required')}}
                            name='mobil'
                            additionalStyles={'w-full'}
                            nameOpeningModal={directoryModals.recMobility}
                        />
                        <CustomText isError={true}>{errors.mobil?.message?.toString()}</CustomText>

                    </div>

                    <div className={''}>
                        <label htmlFor="frost" className={'text-black text-base'}>{tKey(t, 'RecipeHeader.frost')}</label>
                        <Select
                            selectOptions={frost}
                            getOptionLabel={(frost) => frost.name}
                            getOptionValue={(frost) => frost.id}
                            register={register}
                            options={{required: tKey(t, 'errors.required')}}
                            name='frost'
                            additionalStyles={'w-full'}
                            nameOpeningModal={directoryModals.recFrost}
                        />
                        <CustomText isError={true}>{errors.frost?.message?.toString()}</CustomText>

                    </div>

                    <div className={''}>
                        <label htmlFor="water" className={'text-black text-base'}>{tKey(t, 'RecipeHeader.water')}</label>
                        <Select
                            selectOptions={water}
                            getOptionLabel={(water) => water.name}
                            getOptionValue={(water) => water.id}
                            register={register}
                            options={{required: tKey(t, 'errors.required')}}
                            name='water'
                            additionalStyles={'w-full'}
                            nameOpeningModal={directoryModals.recWat}
                        />
                        <CustomText isError={true}>{errors.water?.message?.toString()}</CustomText>

                    </div>

                    <div className={''}>
                        <label htmlFor="mixt" className={'text-black text-base'}>{tKey(t, 'RecipeHeader.marka')}</label>
                        <Select
                            selectOptions={marka}
                            getOptionLabel={(marka: any) => marka.name}
                            getOptionValue={(marka: any) => marka.id}
                            register={register}
                            options={{required: tKey(t, 'errors.required')}}
                            name='marka'
                            additionalStyles={'w-full'}
                        />
                        <CustomText isError={true}>{errors.marka?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">{tKey(t, 'RecipeHeader.date')}</label>
                        <Input
                            name={`date`}
                            register={register}
                            options={{required: tKey(t, 'errors.required')}}
                            type={'date'}
                            additionalStyles={'w-full'}
                            placeholder={tKey(t, 'recipe.enterDate')}
                        />
                        <CustomText isError={true}>{errors.date?.message?.toString()}</CustomText>

                    </div>

                    <div>
                        <label htmlFor="">{tKey(t, 'RecipeHeader.season')}</label>
                        <Input
                            name={`season`}
                            register={register}
                            type = ''
                            options={{required: tKey(t, 'errors.required')}}
                            additionalStyles={'w-full'}
                            placeholder={tKey(t, 'recipe.enterSeason')}
                        />
                        <CustomText isError={true}>{errors.date?.message?.toString()}</CustomText>

                    </div>


                    <div>
                        <label htmlFor="">{tKey(t, 'RecipeHeader.comment')}</label>
                        <TextArea
                            name={`comment`}
                            register={register}
                            additionalStyles={'w-full'}
                            placeholder={tKey(t, 'recipe.enterComment')}
                        />
                        <CustomText isError={true}>{errors.date?.message?.toString()}</CustomText>

                    </div>


                    <div className={' gap-3 flex items-center justify-center mt-5'}>
                        <Button  onClick={() => {openModal(confirmModals.recipeCreateConfirm)}}
                        >{tKey(t, 'modals.save')}</Button>
                        <Button  onClick={() => closeModal(directoryModals.recipe)}>
                            {tKey(t, 'modals.close')}
                        </Button>
                    </div>


                </form>
            </ModalForm>
            <SaveModal nameModal = {confirmModals.recipeCreateConfirm} handleSubmit={handleSubmit((data) => handlePut(data))} error = {errors}/>
        </>


);
};

export default RecipePostForm;