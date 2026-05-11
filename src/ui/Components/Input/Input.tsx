import React, {Dispatch, FC, SetStateAction, useContext} from 'react';
import {FieldValues, RegisterOptions, UseFormRegister} from "react-hook-form";
import {ReactComponent as Dots} from "../../../Public/Images/dots.svg"
import {useModal} from "../../../Infrastructure/hooks/useModal";

interface IInput {
    additionalStyles?: string
    register?: UseFormRegister<FieldValues>;
    options?: RegisterOptions;
    name: string
    placeholder?: string,
    type: string,
    defaultValue?: string | number
    nameOpeningModal?: string
    setOpenModal?: Dispatch<SetStateAction<boolean>>
    value?: string | number
    max?: string | number
    readonly?: boolean
    onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    onChange?: any

}

const Input: FC<IInput> = ({additionalStyles, disabled, register, onChange, options, name, placeholder, type, defaultValue, nameOpeningModal, setOpenModal, value, max, readonly, onInput}) => {

    const {openModal, closeModal} = useModal()

    return (
        <div className={'relative'}>
            <input type={`${type}`} id="search"
                   className={` block py-2 pl-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none focus:ring-blue-500 focus:border-blue-500 ${additionalStyles} input_123`}
                   {...(register ? register(name, options) : {})}
                   placeholder={placeholder}
                   defaultValue={defaultValue}
                   value = {value}
                   max = {max}
                   {...(readonly ? {readOnly: readonly} : {})}
                   {...(onInput ? {onInput: onInput} : {})}
                   {...(disabled ? {disabled: disabled} : {})}
                   {...(onChange ? {onChange: onChange} : {})}

            />
            {nameOpeningModal &&
                <span className="absolute inset-y-0 right-0 flex items-center justify-center border-l border-gray-300"
                      onClick={(e) => openModal(nameOpeningModal)}
                >
                    <Dots/>
                </span>
            }
            {setOpenModal &&
                <span className="absolute inset-y-0 right-0 flex items-center justify-center border-l border-gray-300"
                      onClick={(e) => setOpenModal(true)}
                >
                    <Dots/>
                </span>
            }

        </div>
    );
};

export default Input;
