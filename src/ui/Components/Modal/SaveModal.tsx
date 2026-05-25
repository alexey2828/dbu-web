import React, { FC } from 'react';
import { useTranslation } from "react-i18next";
import Button from "../Button/Button";
import ModalForm from "./ModalForm";
import { useModal } from "../../../Infrastructure/hooks/useModal";
import { tKey } from "../../../Infrastructure/i18n/tKey";

interface ISaveModal {
    handleSubmit: () => void;
    error?: any;
    success?: any;
    nameModal: string;
}

const SaveModal: FC<ISaveModal> = ({ nameModal, handleSubmit, error, success }) => {
    const { closeModal } = useModal();
    const { t } = useTranslation();

    const handleOnClick = () => {
        if (error) {
            handleSubmit();
            closeModal(nameModal);
        } else {
            handleSubmit();
        }
    };

    return (
        <ModalForm modalName={nameModal}>
            <div className={'flex flex-col items-center justify-center'}>
                <p className={'mb-4 font-bold text-xl'}>{tKey(t, 'modals.confirmAction')}</p>
                <div className={'flex'}>
                    <Button onClick={handleOnClick} additionalStyles={'mr-2'}>{tKey(t, 'modals.confirm')}</Button>
                    <Button onClick={() => closeModal(nameModal)}>{tKey(t, 'modals.back')}</Button>
                </div>
            </div>
        </ModalForm>
    );
};

export default SaveModal;
