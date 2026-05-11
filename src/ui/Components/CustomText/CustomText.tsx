import React, {FC, PropsWithChildren} from 'react';

export enum SIZE {
    base = 'text-base',
    xl = 'text-xl'
}
export enum WEIGHT {
    normal = 'font-normal',
    bold = 'font-bold'
}

export enum POSITION {
    center = 'text-center',
    left = 'text-left',
    right = 'text-right',
}

interface IText extends PropsWithChildren{
    size?: SIZE,
    isError?: boolean
    weight?: WEIGHT
    className?: string
    position?: POSITION
}

export const CustomText:FC<IText> = (
    {
        size = SIZE.base,
        isError = false,
        children,
        weight = WEIGHT.normal,
        className= '',
        position
    }
) => {
    return (
        <div className={`${size} ${isError ? 'text-red-700': ''} ${weight} ${className} ${position}`}>
            {children}
        </div>
    );
};
