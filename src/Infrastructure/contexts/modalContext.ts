import {createContext} from 'react';

export interface ModalInstance {
    name: string;
    props: Record<string, any>;
}

export interface ModalContextType {
    modals: ModalInstance[];
    openModal: (modalName: string, props?: Record<string, any>) => void;
    closeModal: (modalName: string) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);


