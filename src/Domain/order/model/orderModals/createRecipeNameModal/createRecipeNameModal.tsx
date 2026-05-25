import React, { Dispatch, FC, memo, SetStateAction, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Button from "../../../../../ui/Components/Button/Button";
import { useForm } from "react-hook-form";
import Input from '../../../../../ui/Components/Input/Input';
import Select from "../../../../../ui/Components/Select/select";
import { recMobilityAPI } from "../../../../../Infrastructure/services/RecipeServices/recMobilityService";
import { recStrengthAPI } from "../../../../../Infrastructure/services/RecipeServices/RecStrengthService";
import { recFrostAPI } from "../../../../../Infrastructure/services/RecipeServices/RecFrostService";
import { recWatAPI } from "../../../../../Infrastructure/services/RecipeServices/RecWatService";
import { markaAPI } from "../../../../../Infrastructure/services/RecipeServices/MarkaService";
import { recCommentAPI } from "../../../../../Infrastructure/services/RecipeServices/recCommentService";
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import { generalModals } from "../../../../../Infrastructure/const/modalNames";
import { useModal } from "../../../../../Infrastructure/hooks/useModal";
import { useCurrentItems } from "../../../../../Infrastructure/hooks/useCurrentItems";
import globalStyles from '../../../../../global.module.scss';

interface ICreateRecipeNameModalProps {
    setPressedAction: Dispatch<SetStateAction<any>>;
}

const CreateRecipeNameModal: FC<ICreateRecipeNameModalProps> = ({ setPressedAction }) => {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { isDirty } } = useForm();
    const { closeModal, modals } = useModal();
    const isOpen = !!modals.find(item => item.name === generalModals.createRecipeNameModal);
    const { data: mobility } = recMobilityAPI.useFetchAllRecMobilityQuery('');
    const { data: strength } = recStrengthAPI.useFetchAllRecStrengthQuery('');
    const { data: frost } = recFrostAPI.useFetchAllRecFrostQuery('');
    const { data: wat } = recWatAPI.useFetchAllRecWatQuery('');
    const { data: marka } = markaAPI.useFetchAllMarkaQuery('');
    const { data: cond } = recCommentAPI.useFetchAllRecCommentQuery('');
    const { currentRecipeName, setCurrentRecipeName } = useCurrentItems();

    useEffect(() => {
        if (isOpen) {
            handleSubmit((data) => {
                setCurrentRecipeName(`${data.strength} ${data.marka} ${data.mobility} ${data.frost} ${data.wat} ${data.cond}`);
            })();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isDirty) {
            setPressedAction((prevState: any) => ({ ...prevState, isDirty: false }));
        }
    }, [isDirty]);

    const handlePut = (data: any) => {
        setCurrentRecipeName(`${data.strength} ${data.marka} ${data.mobility} ${data.frost} ${data.wat} ${data.cond}`);
        closeModal(generalModals.createRecipeNameModal);
    };

    const handlePutC = (data: any) => {
        setCurrentRecipeName(`${data.strength} ${data.marka} ${data.mobility} ${data.frost} ${data.wat} ${data.cond}`);
    };

    return (
        <ModalForm modalName={generalModals.createRecipeNameModal} title={currentRecipeName}>
            <Input
                type='search'
                name='name'
                value={currentRecipeName}
                additionalStyles={globalStyles.input_width_full}
                readonly={true}
            />
            <form onSubmit={handleSubmit(handlePut)}>
                <div>
                    <label htmlFor="strength">{t('createRecipeNameModal.strength')}</label>
                    <Select
                        selectOptions={strength}
                        getOptionLabel={(strength) => strength.name}
                        getOptionValue={(strength) => strength.name}
                        register={register}
                        options={{ required: true }}
                        name='strength'
                        additionalStyles={globalStyles.input_width_full}
                    />
                </div>
                <div>
                    <label htmlFor="marka">{t('createRecipeNameModal.marka')}</label>
                    <Select
                        selectOptions={marka}
                        getOptionLabel={(marka) => marka.name}
                        getOptionValue={(marka) => marka.name}
                        register={register}
                        options={{ required: true }}
                        name='marka'
                        additionalStyles={globalStyles.input_width_full}
                    />
                </div>
                <div>
                    <label htmlFor="mobility">{t('createRecipeNameModal.mobility')}</label>
                    <Select
                        selectOptions={mobility}
                        getOptionLabel={(mobility) => mobility.name}
                        getOptionValue={(mobility) => mobility.name}
                        register={register}
                        options={{ required: true }}
                        name='mobility'
                        additionalStyles={globalStyles.input_width_full}
                    />
                </div>
                <div>
                    <label htmlFor="frost">{t('createRecipeNameModal.frost')}</label>
                    <Select
                        selectOptions={frost}
                        getOptionLabel={(frost) => frost.name}
                        getOptionValue={(frost) => frost.name}
                        register={register}
                        options={{ required: true }}
                        name='frost'
                        additionalStyles={globalStyles.input_width_full}
                    />
                </div>
                <div>
                    <label htmlFor="wat">{t('createRecipeNameModal.wat')}</label>
                    <Select
                        selectOptions={wat}
                        getOptionLabel={(wat) => wat.name}
                        getOptionValue={(wat) => wat.name}
                        register={register}
                        options={{ required: true }}
                        name='wat'
                        additionalStyles={globalStyles.input_width_full}
                    />
                </div>
                <div>
                    <label htmlFor="cond">{t('createRecipeNameModal.comment')}</label>
                    <Select
                        selectOptions={cond}
                        getOptionLabel={(cond) => cond.name}
                        getOptionValue={(cond) => cond.name}
                        register={register}
                        options={{ required: true }}
                        name='cond'
                        additionalStyles={globalStyles.input_width_full}
                    />
                </div>

                <div className={globalStyles.form_buttons_container}>
                    <Button type="submit" onClick={handleSubmit(handlePut)}>
                        {t('modals.saveAndClose')}
                    </Button>
                    <Button type="submit" onClick={handleSubmit(handlePutC)}>
                        {t('modals.save')}
                    </Button>
                    <Button type="button" onClick={() => closeModal(generalModals.createRecipeNameModal)}>
                        {t('modals.close')}
                    </Button>
                </div>
            </form>
        </ModalForm>
    );
};

export default memo(CreateRecipeNameModal);
