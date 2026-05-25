import React, {Dispatch, FC, useEffect, useRef, useState} from 'react';
import {ReactComponent as Burger} from '../../../Public/Images/burger.svg';
import {ReactComponent as Settings} from '../../../Public/Images/settings.svg';
import {ReactComponent as User} from '../../../Public/Images/user.svg';
import {ReactComponent as Clock} from '../../../Public/Images/clock.svg';
import {ReactComponent as ArrowBack} from '../../../Public/Images/arrowBack.svg';
import {ReactComponent as Reload} from '../../../Public/Images/reload.svg';
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {useCurrentItems} from "../../../Infrastructure/hooks/useCurrentItems";
import {CustomText, SIZE, WEIGHT} from "../CustomText/CustomText";
import Select from "../Select/select";
import {useTranslation} from "react-i18next";
import {useGetUser} from "../../../Infrastructure/hooks/useGetUser";
import {tKey} from "../../../Infrastructure/i18n/tKey";
import CustomSelect from "../Select/customSelect";
import {generalLinks, preProduction} from "../../../Infrastructure/const/links";
import {Roles} from "../../../Infrastructure/const/roles";
import {recipeAPI} from "../../../Infrastructure/services/RecipeServices/RecipeService";
import {userAPI} from "../../../Infrastructure/services/UserService/UserService";

interface IHeader {
    name: string | undefined
    isOpenedSideBar: boolean;
    setIsOpenedSideBar: Dispatch<React.SetStateAction<boolean>>;
}

const languageList = [
    {label: 'UA', value: 'ua'},
    {label: 'EN', value: 'en'},
]

const analysisProduction = [
    {label: 'Аналiз виробництва', link: ''},
    {label: 'Обсяг виробництва', link: '/production-analysis'},
    {label: 'Витрати матеріалів', link: '/components-analysis'},
]

const Header: FC<IHeader> = ({name, isOpenedSideBar, setIsOpenedSideBar}) => {

    const [time, setTime] = useState(new Date())
    const {setCurrentTtn} = useCurrentItems()
    const {t, i18n} = useTranslation()
    const {data: RecipeState} = recipeAPI.useFetchAllRecipeStateQuery('')

    const [currentLanguage, setCurrentLanguage] = useState(
        localStorage.getItem('language') || 'ua'
    )

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    const userMenuRef = useRef<HTMLDivElement | null>(null)
    const timeRef = useRef(new Date())

    const location = useLocation()
    const navigate = useNavigate()
    const user = useGetUser()
    const [trigger, {data: currentUser}] = userAPI.useLazyGetUsersQuery()

    const refreshUser = async () => {
        const dataStr = localStorage.getItem('user');
        const response = await trigger(user?.user.id).unwrap();

        if (!dataStr) return;

        const data = JSON.parse(dataStr);
        const newData = {...data, user: response[0]}


        localStorage.setItem('user', JSON.stringify(newData));
    };



    let date = time.getDate()
    let month = time.getMonth() + 1
    let year = time.getFullYear()

    useEffect(() => {
        const interval = setInterval(() => {
            timeRef.current = new Date()
            setTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        i18n.changeLanguage(currentLanguage)
    }, [currentLanguage, i18n])

    // закрытие меню при клике вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setIsUserMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (name === 'routes.createEditOrder' && !location.state?.order) {
        name = 'routes.createOrder'
    }
    const linkClass = ({ isActive }: any) =>
        `hover:underline hover:decoration-white ${
            isActive ? "underline decoration-white" : ""
        }`;


    const canGoBack =
        window.history.state?.idx > 0 &&
        location.pathname !== "/"

    const onClickBackLocation = () => {
        setCurrentTtn(undefined)
        navigate(-1)
    }

    const changeLanguageHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value

        setCurrentLanguage(newLanguage)
        localStorage.setItem('language', newLanguage)
        i18n.changeLanguage(newLanguage)
    }

    const logoutHandler = () => {
        localStorage.removeItem("user")
        navigate("/login")
    }

    const onChange = (e: any) => {
        navigate(e.target.value);
        e.target.value = '';
    };


    return (
        <div className={'bg-gray-800 text-white py-2 border-b border-gray-200 fixed top-0 left-0 w-full z-20'}>

            <div className='border-b border-gray-200 pb-1'>
                <div className={'flex gap-4 w-[98%] mx-auto items-center'}>
                    {user?.user &&
                        <div
                            className={`${isOpenedSideBar ? 'hidden' : 'visible'}`}
                            onClick={() => setIsOpenedSideBar(true)}
                        >
                            <Burger/>
                        </div>
                    }
                    {user?.user &&
                        <>
                            <div className="flex items-center">
                                <NavLink to="/" className={linkClass}>
                                    <p className="mx-1 text-lg font-semibold">{tKey(t, 'general.sales')}</p>
                                </NavLink>
                            </div>



                            <div className="flex items-center ">
                                <NavLink to={`/${generalLinks.reports}`} className={linkClass}>
                                    <p className="mx-1 text-lg font-semibold">{tKey(t, 'general.reports')}</p>
                                </NavLink>
                            </div>


                                <div className="flex items-center ">


                                    <Select
                                        selectOptions={analysisProduction}
                                        getOptionLabel={(links: any) => links.label}
                                        getOptionValue={(links: any) => links.link}
                                        name={'analysisProduction'}
                                        additionalStyles={'!bg-gray-800 !text-white !border-none !font-semibold'}
                                        handleOnChange={onChange}
                                    />

                                </div>

                        </>
                    }



                    <div className="ml-auto flex gap-4 items-center justify-center">

                        {/* USER MENU */}
                        {user?.user && (
                            <div className="relative" ref={userMenuRef}>
                                {/* Trigger */}
                                <div
                                    onClick={() => setIsUserMenuOpen(prev => !prev)}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 px-3 py-1 rounded transition"
                                >
                                    <User />
                                    <CustomText weight={WEIGHT.bold}>
                                        {user?.user.name || tKey(t, 'Users.userFallback')}
                                    </CustomText>
                                </div>

                                {/* Dropdown */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 max-w-128 bg-white text-black rounded-xl shadow-lg border border-gray-200 p-4 z-50">

                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3">

                                            {/* User info */}
                                            <div className="flex items-center gap-3">

                                                <button
                                                    onClick={() => refreshUser()}
                                                    className="rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black transition"
                                                    title={tKey(t, 'Users.refresh')}
                                                >
                                                    <Reload />
                                                </button>
                                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <User />
                                                </div>

                                                <div>
                                                    <div className="font-semibold">
                                                        {user?.user.name || tKey(t, 'Users.userFallback')}
                                                    </div>

                                                    <div className="text-sm text-gray-500">
                                                        {user?.user.login || tKey(t, 'Users.userFallback')} | {user?.role || tKey(t, 'Users.roleFallback')}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">

                                                {/* Refresh */}


                                                {/* Settings */}
                                                {user?.user.role === Roles.ADMIN && (
                                                    <NavLink
                                                        to="/users-directory"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black transition"
                                                        title={tKey(t, 'Users.settings')}
                                                    >
                                                        <Settings />
                                                    </NavLink>
                                                )}
                                            </div>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t pt-3">
                                            <button
                                                className="w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 rounded transition"
                                                onClick={logoutHandler}
                                            >
                                                {tKey(t, 'Users.logout')}
                                            </button>
                                        </div>

                                    </div>
                                )}
                            </div>
                        )}


                        {/* LANGUAGE */}
                        <Select
                            name={'language'}
                            handleOnChange={changeLanguageHandler}
                            selectOptions={languageList}
                            getOptionLabel={(language: any) => language.label}
                            getOptionValue={(language: any) => language.value}
                            defaultValue={currentLanguage}
                            additionalStyles={'!text-white !bg-gray-800 !p-1'}
                        />

                        <Clock/>

                        <CustomText>
                            {tKey(t, 'general.date')}:
                            {" "}
                            {date < 10 ? `0${date}` : date}.
                            {month < 10 ? `0${month}` : month}.
                            {year}
                        </CustomText>

                        <div>
                            {tKey(t, 'general.time')}:
                            {" "}
                            {time.toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}
                        </div>

                    </div>
                </div>
            </div>

            <div className={'w-[98%] mx-auto pt-1 flex items-center gap-3'}>

                {name !== 'routes.ordersPage' &&
                    location.pathname !== '/' &&
                    canGoBack &&
                    <button onClick={onClickBackLocation}>
                        <ArrowBack className='mt-[2px]'/>
                    </button>
                }

                <CustomText size={SIZE.xl} weight={WEIGHT.bold}>
                    {tKey(t, name || '')}

                    {location.state?.order &&
                        `${tKey(t, 'order.numberPrefix')}${location.state.order.number}`
                    }
                </CustomText>
                {name === 'routes.recipeDirectory' && RecipeState && RecipeState?.length > 0 &&
                    <CustomSelect
                        items={RecipeState}
                    />
                }



            </div>



        </div>
    );
};

export default Header;