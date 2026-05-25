import React, { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useModal } from '../../../Infrastructure/hooks/useModal';

const modalRootElement = document.querySelector('#modal2');
interface IModalForm extends PropsWithChildren {
    modalName: string;
    title?: string;
    width?: string;
}
const ModalForm: FC<IModalForm> = ({ children, modalName, title, width }) => {
    const { modals, closeModal } = useModal();
    const element = useMemo(() => document.createElement('div'), []);

    useEffect(() => {
        modalRootElement?.appendChild(element);
        return () => {
            modalRootElement?.removeChild(element);
        };
    }, []);

    const modalInstance = modals.find((modal) => modal.name === modalName);

    if (modalInstance) {
        return createPortal(
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden bg-gray-400 flex flex-row justify-center items-center bg-opacity-80 z-50">
                <div
                    className={`bg-white border-3 border-black rounded-2xl max-h-full overflow-y-auto ${width}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {title && (
                        <div className="relative p-5 font-bold text-xl border-gray-300 border-b text-center">
                            <span>{title}</span>
                            <button
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-black text-2xl font-bold focus:outline-none"
                                onClick={() => closeModal(modalName)}
                            >
                                &times;
                            </button>
                        </div>
                    )}
                    <div className="px-12 py-10">
                        {React.isValidElement(children)
                            ? React.cloneElement(children, { ...modalInstance.props })
                            : children}
                    </div>
                </div>
            </div>,
            element
        );
    }
    return null;
};

export default ModalForm;
