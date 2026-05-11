import React, { Dispatch, FC, SetStateAction } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Cross } from '../../../Public/Images/cross.svg';
import { links, genTech, preProduction, generalLinks } from "../../../Infrastructure/const/links";
import Select from "../Select/select";
import { useTranslation } from "react-i18next";
import { useGetUser } from "../../../Infrastructure/hooks/useGetUser";
import { Roles } from "../../../Infrastructure/const/roles";
import { CustomText } from "../CustomText/CustomText";
import { tKey } from "../../../Infrastructure/i18n/tKey";

interface ISideBar {
    setIsOpened: Dispatch<SetStateAction<boolean>>;
    isOpened: boolean;
}

const SideBar: FC<ISideBar> = ({ setIsOpened, isOpened }) => {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = useGetUser();

    const onChange = (e: any) => {
        navigate(e.target.value);
        e.target.value = '';
    };

    return (
        <div
            id="sidebar-overlay"
            className={`fixed inset-0 transition-all duration-100 ${isOpened ? 'visible' : 'invisible'} z-40`}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div
                className={`absolute inset-y-0 left-0 flex flex-col bg-gray-800 min-h-screen transition-all duration-100 ${isOpened ? 'w-72 border-r z-50' : 'w-0'} overflow-auto`}
            >
                <div
                    className={`flex items-center justify-end p-2 text-white cursor-pointer ${isOpened ? 'visible' : 'hidden'}`}
                    onClick={() => setIsOpened(false)}
                >
                    <Cross />
                </div>

                <div className="pt-10 text-white flex flex-col flex-1">







                    <div className='flex flex-col border-b py-1'>
                        <div className='flex items-center cursor-pointer'>
                            <Select
                                selectOptions={links}
                                getOptionLabel={(links: any) => tKey(t, links.name)}
                                getOptionValue={(links: any) => links.link}
                                name={'directoryLink'}
                                additionalStyles={'!bg-gray-800 !text-white !border-none !focus:border-none !w-[280px]'}
                                handleOnChange={onChange}
                                optionOnClick={() => setIsOpened(false)}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col border-b py-1'>
                        <div className='flex items-center cursor-pointer'>
                            <Select
                                selectOptions={preProduction}
                                getOptionLabel={(links: any) => tKey(t, links.name)}
                                getOptionValue={(links: any) => links.link}
                                name={'preProduction'}
                                additionalStyles={'!bg-gray-800 !text-white !border-none !focus:border-none !w-[280px]'}
                                handleOnChange={onChange}
                                optionOnClick={() => setIsOpened(false)}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col border-b py-1'>
                        <div className='flex items-center cursor-pointer'>
                            <Select
                                selectOptions={genTech}
                                getOptionLabel={(links: any) => tKey(t, links.name)}
                                getOptionValue={(links: any) => links.link}
                                name={'directoryLink'}
                                additionalStyles={'!bg-gray-800 !text-white !border-none !focus:border-none !w-[280px]'}
                                handleOnChange={onChange}
                                optionOnClick={() => setIsOpened(false)}
                            />
                        </div>
                    </div>

                    <div className='flex items-center border-b py-2'>
                        <Link to={`/recipe-directory`} onClick={() => setIsOpened(false)}>
                            <p className='mx-2'>{tKey(t, 'tech.recipes')}</p>
                        </Link>
                    </div>


                </div>

                {/* Нижний блок */}
                <div className="mt-auto pb-4">
                    <p className='text-white px-2 text-center'>
                        {tKey(t, 'general.developed')} <br/>
                        +38 (096) 323-14-41
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SideBar;