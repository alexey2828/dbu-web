import React from 'react';
import LoginForm from "../../Domain/users/models/LoginForm/loginForm";
import {ReactComponent as Logo} from '../../Public/Images/ASA.svg';
import {ReactComponent as GrandBetonLogo} from '../../Public/Images/grand-beton-logo.svg';

const LoginPage = () => {
    return (
        <div className={'flex justify-center items-center h-[84vh] flex-col gap-4'}>
            <div className={'flex items-center justify-center flex-col'}>
                <GrandBetonLogo width={320}/>

            </div>
            <LoginForm />
        </div>

    );
};

export default LoginPage;