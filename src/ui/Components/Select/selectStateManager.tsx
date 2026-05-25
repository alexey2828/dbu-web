import React, { useState, useEffect } from 'react';
import { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form";

interface ISelect<T> {
    additionalStyles?: string;
    name: string;
    selectOptions: T[] | undefined;
    getOptionLabel: (options: T) => string | number;
    getOptionValue: (option: T) => string | number;
    register?: UseFormRegister<FieldValues>;
    options?: RegisterOptions;
    defaultValue?: string | number;
    handleOnClick?: (e: React.MouseEvent) => void;
    disabledValue?: string;
    handleOnChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean; // 👈 добавляем
}

const SelectStateManager = <T extends {}>({
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
                                              disabled // 👈 принимаем
                                          }: ISelect<T>) => {

    const [selectedValue, setSelectedValue] = useState<string | number | undefined>(defaultValue);

    useEffect(() => {
        setSelectedValue(defaultValue);
    }, [defaultValue]);

    const uniqueOptions = selectOptions ? Array.from(new Set(selectOptions.map(item => getOptionLabel(item))))
            .map(label => selectOptions.find(item => getOptionLabel(item) === label)) as T[]
        : [];

    const defaultOption = uniqueOptions.find(option => option && getOptionValue(option) === defaultValue);

    return (
        <select
            id={name}
            disabled={disabled} // 👈 здесь
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-2 pl-1 ${additionalStyles}`}
            {...(register ? register(name, options) : {})}
            value={selectedValue}
            onClick={handleOnClick}
            onChange={(e) => {
                setSelectedValue(e.target.value);
                if (handleOnChange) handleOnChange(e);
            }}
        >
            {defaultOption ? (
                <option value={getOptionValue(defaultOption)}>
                    {getOptionLabel(defaultOption)}
                </option>
            ) : (
                defaultValue !== undefined && (
                    <option value={defaultValue} disabled>
                        {defaultValue}
                    </option>
                )
            )}
            {uniqueOptions && uniqueOptions.length > 0 && uniqueOptions.map(option => (
                  getOptionValue(option) !== defaultValue && (
                    <option key={getOptionValue(option)}
                            value={getOptionValue(option)}
                            disabled={getOptionValue(option) === disabledValue}
                    >
                        {getOptionLabel(option)}
                    </option>
                )
            ))}
        </select>
    );
};

export default SelectStateManager;
