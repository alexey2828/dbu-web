import React, {FC, PropsWithChildren, useState} from "react";
import {ModalContext, ModalInstance} from "../contexts/modalContext";

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {

    const [modals, setModals] = useState<ModalInstance[]>([]);
    const openModal = (modalName: string, props: Record<string, any> = {}) => {
        setModals((prevModals) => [...prevModals, { name: modalName, props }]);
    };

    const closeModal = (modalName: string) => {
        setModals((prevModals) => prevModals.filter(modal => modal.name !== modalName));
    };

    return (
        <ModalContext.Provider value={{ modals, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};