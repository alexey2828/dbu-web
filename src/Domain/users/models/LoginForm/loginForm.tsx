import React, {useState} from 'react';
import {userAPI} from "../../../../Infrastructure/services/UserService/UserService";
import Button from "../../../../ui/Components/Button/Button";
import {useForm} from "react-hook-form";
import Input from "../../../../ui/Components/Input/Input";
import {useTranslation} from "react-i18next";
import {CustomText} from "../../../../ui/Components/CustomText/CustomText";
import {useNavigate} from "react-router-dom";
import { tKey } from "../../../../Infrastructure/i18n/tKey";

const LoginForm = () => {

    const [login] = userAPI.useLoginUserMutation()
    const [getRole] = userAPI.useLazyGetUserRoleNameQuery()
    const {register, handleSubmit, formState: {errors, isDirty}, setValue} = useForm();
    const {t} = useTranslation();
    const [loginError, setLoginError] = useState<string | null>(null);
    const navigate = useNavigate();

    const loginUser = async (data: any) => {
        try {
            setLoginError(null);

            const action = await login(data).unwrap();

            // сохраняем временно
            sessionStorage.setItem('tempUser', JSON.stringify(action));

            navigate('/verify-code');

        } catch (error: any) {
            setLoginError(tKey(t, 'errors.invalidLoginOrPassword'));
        }
    };


    return (
        <form onSubmit={handleSubmit(loginUser)} className={'flex flex-col gap-3 items-center'}>
            <div>
                <label htmlFor="">{tKey(t, 'Users.login')}</label>
                <Input
                    name='login'
                    type='text'
                    additionalStyles={'w-80'}
                    placeholder={tKey(t, 'Users.loginPlaceholder')}
                    register={register}
                    options={{ required: tKey(t, 'errors.required')}}

                />
                <CustomText isError={true}>{errors.login?.message?.toString()}</CustomText>

            </div>
            <div>
                <label htmlFor="">{tKey(t, 'Users.password')}</label>

                <Input
                    name='password'
                    type='password'
                    additionalStyles={'w-80'}
                    placeholder={tKey(t, 'Users.passwordPlaceholder')}
                    register={register}
                    options={{
                        required: tKey(t, 'errors.required'),
                        onChange: () => setLoginError(null)
                    }}
                />
                <CustomText isError={true}>{errors.password?.message?.toString()}</CustomText>


            </div>

            <Button type = 'submit'>
                {tKey(t, 'Users.enter')}
            </Button>

            {loginError && (
                <div className="text-red-500 text-sm">
                    {loginError}
                </div>
            )}
        </form>
    );
};

export default LoginForm;