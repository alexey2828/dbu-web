import React, {ReactElement} from 'react';
import {FieldValues, RegisterOptions, UseFormRegister} from "react-hook-form";
import {ReactComponent as Dots} from "../../../Public/Images/dots.svg";
import {useModal} from "../../../Infrastructure/hooks/useModal";
import s from './select.module.scss'

interface ISelect<T> {
    additionalStyles?: string;
    name: string;
    selectOptions: T[] | undefined;
    getOptionLabel: (options: T) => string | number | ReactElement;
    getOptionValue: (option: T) => string | number;
    register?: UseFormRegister<FieldValues>;
    options?: RegisterOptions;
    defaultValue?: string | number;
    handleOnClick?: (e: React.MouseEvent) => void;
    disabledValue?: string;
    handleOnChange?: (e: React.ChangeEvent<HTMLSelectElement>, item?: any) => void;
    defaultStateValue?: string;
    nameOpeningModal?: string;
    SvgIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
    additionalOptionLabel?: string;
    additionalOptionValue?: string | number;
    optionOnClick?: (option: T) => void;
}

const Select = <T extends {}>({
                                  additionalStyles,
                                  selectOptions,
                                  getOptionLabel,
                                  getOptionValue,
                                  register,
                                  options,
                                  name,
                                  defaultValue,
                                  handleOnClick,
                                  disabledValue,
                                  handleOnChange,
                                  nameOpeningModal,
                                  SvgIcon,
                                  optionOnClick,
                                  additionalOptionLabel,
                                  additionalOptionValue = ''
                              }: ISelect<T>) => {

    const {openModal} = useModal()
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (handleOnChange) {
            handleOnChange(e);
        }

        if (optionOnClick) {
            const selectedOption = selectOptions?.find(
                (option) => getOptionValue(option) === e.target.value
            );
            if (selectedOption) {
                optionOnClick(selectedOption);
            }
        }
    };

    return (
        <div className="relative">
            {SvgIcon && (
                <span className="absolute inset-y-0 left-1 flex items-center justify-center">
                    <SvgIcon/>
                </span>
            )}

            <select
                id={name}
                className={` ${s.Select} ${SvgIcon && '!pl-6 '} ${additionalStyles}`}
                {...(register ? register(name, options) : {})}
                defaultValue={defaultValue}
                onClick={handleOnClick}
                {...(handleOnChange ? {onChange: handleChange} : {})}

            >
                {additionalOptionLabel && <option value={additionalOptionValue}>{additionalOptionLabel}</option>}
                {selectOptions && selectOptions.length > 0 ? (
                    selectOptions.map(option => (
                        <option
                            key={getOptionValue(option)}
                            value={getOptionValue(option)}
                            disabled={getOptionValue(option) === disabledValue}
                        >
                            {getOptionLabel(option)}
                        </option>
                    ))
                ) : (
                    <option value={defaultValue}>{defaultValue}</option>
                )}
            </select>

            {nameOpeningModal && (
                <span
                    className="absolute inset-y-0 right-5 flex items-center justify-center border-x border-gray-300"
                    onClick={(e) => {
                        openModal(nameOpeningModal)
                    }}
                >
                    <Dots/>
                </span>
            )}
        </div>
    );
};

export default Select;
