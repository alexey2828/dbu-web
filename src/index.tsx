import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {setupStore} from "./Redux/store";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {CurrentItemsProvider} from "./Infrastructure/provider/currentItemProvider";
import {ModalProvider} from "./Infrastructure/provider/modalProvider";
import {NotificationProvider} from "./Infrastructure/provider/NotificationProvider";
import './i18n';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
const store = setupStore()

root.render(
    <BrowserRouter>
        <CurrentItemsProvider>
            <NotificationProvider>
                <ModalProvider>
                    <Provider store={store}>
                        <App/>
                    </Provider>
                </ModalProvider>
            </NotificationProvider>
        </CurrentItemsProvider>
    </BrowserRouter>
);


reportWebVitals();
