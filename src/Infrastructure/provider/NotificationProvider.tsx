import {FC, PropsWithChildren, useEffect, useState} from "react";
import {NotificationArgs, NotificationContext} from "../contexts/NotificationContext";
interface NotificationProviderProps extends PropsWithChildren<{}> { }

export const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {

    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [type, setType] = useState<'success' | 'error' | 'warning' | undefined>();
    const [message, setMessage] = useState<string | undefined>();

    useEffect(() => {
        if (showNotification) {
            const time = setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return () => clearTimeout(time);
        }
    }, [showNotification]);

    const notificationHandler = (args: NotificationArgs) => {
        setType(args.type);
        setMessage(args.message);
        setShowNotification(true);
    };

    return (
        <NotificationContext.Provider value={{ notificationHandler, showNotification, type, message }}>
            {children}
        </NotificationContext.Provider>
    );
};