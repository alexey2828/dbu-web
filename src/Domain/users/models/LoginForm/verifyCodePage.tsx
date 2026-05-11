import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {userAPI} from "../../../../Infrastructure/services/UserService/UserService";
import {ReactComponent as Logo} from '../../../../Public/Images/ASA.svg';
import {ReactComponent as GrandBetonLogo} from '../../../../Public/Images/grand-beton-logo.svg';
import {useTranslation} from "react-i18next";
import { tKey } from "../../../../Infrastructure/i18n/tKey";

const VerifyCodePage = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [getRole] = userAPI.useLazyGetUserRoleNameQuery();

    const handleVerify = async () => {
        const tempData = sessionStorage.getItem('tempUser');

        if (!tempData) {
            navigate('/login');
            return;
        }

        const parsed = JSON.parse(tempData);

        const correctCode = String(parsed.user.code);

        if (code !== correctCode) {
            setError(tKey(t, 'errors.invalidCode'));
            return;
        }

        // получаем роль
        const role = await getRole(parsed.user.role).unwrap();

        const user = {
            token: parsed.token,
            user: parsed.user,
            role: role[0].name
        };

        localStorage.setItem('user', JSON.stringify(user));

        sessionStorage.removeItem('tempUser');

        navigate('/');
    };

    return (
        <div className="flex items-center justify-center h-[84vh] bg-gray-50 flex-col">
           {/* <Logo  width={80}/>
            <p className={'text-3xl text-bold '}>ООО ГРАНД БЕТОН</p>*/}
            <GrandBetonLogo width={320}/>
            <div className="p-8 rounded-2xl w-full max-w-sm flex flex-col items-center gap-3">

                <h2 className="text-2xl font-semibold text-gray-800">
                    {tKey(t, 'Users.confirmation')}
                </h2>

                <p className="text-sm text-gray-500 text-center">
                    {tKey(t, 'Users.enterConfirmation')}
                </p>

                <input
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        setError(null);
                    }}
                    placeholder={tKey(t, 'Users.enterConfirmation')}
                    className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    p-3
                    text-center
                    text-lg
                    tracking-widest
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    transition
                "
                />

                <button
                    onClick={handleVerify}
                    className="
                    w-full
                    bg-gray-800
                    text-white
                    py-3
                    rounded-lg
                    font-medium
                    hover:bg-blue-700
                    transition
                    active:scale-[0.98]
                "
                >
                    {tKey(t, 'Users.accept')}
                </button>

                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

            </div>
        </div>
    );
};

export default VerifyCodePage;