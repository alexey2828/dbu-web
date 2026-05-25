import React, {Children, FC, PropsWithChildren} from 'react';
import {FieldValues, RegisterOptions, UseFormRegister} from "react-hook-form";
import * as child_process from "node:child_process";


interface ITextArea extends PropsWithChildren{
    additionalStyles?: string
    register?: UseFormRegister<FieldValues>;
    options?: RegisterOptions;
    name: string
    defaultValue?: string | number
    placeholder?: string,
}

const TextArea: FC<ITextArea> = ({additionalStyles, name,register,options, children, placeholder}) => {
    return (
        <textarea id="message"
                  className={`block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${additionalStyles}`}
                  placeholder={placeholder}
                  {...(register ? register(name, options) : {})}
        >
            {children}
        </textarea>

    );
};

export default TextArea;