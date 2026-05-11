import React, {FC, MouseEventHandler, PropsWithChildren} from 'react';

interface IButton extends PropsWithChildren{
    additionalStyles?: string,
    onClick?: MouseEventHandler<HTMLButtonElement>,
    SvgIcon?: React.FC<React.SVGProps<SVGSVGElement>>
    type?: 'button' | 'submit' | 'reset',
    disabled?: boolean,
}

const Button:FC<IButton> = ({additionalStyles, children, onClick, SvgIcon, type = 'button', disabled}) => {
    return (
        <button
            type={type}
            className={`bg-gray-800 disabled:bg-gray-400 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded-lg w-fit ${additionalStyles} text-base flex justify-center items-center `}
            onClick={onClick}
            disabled={disabled}

        >
           <div className={'flex justify-center items-center'}>
               {SvgIcon && <SvgIcon className = 'mr-2'/>}{children}
           </div>

        </button>

);
};

export default Button;