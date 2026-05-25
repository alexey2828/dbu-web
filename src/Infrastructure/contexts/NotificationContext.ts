import {createContext} from 'react';

export interface NotificationArgs {
    type: 'success' | 'error' | 'warning';
    message: string;
}

interface NotificationContextValue {
    notificationHandler: (args: NotificationArgs) => void;
    showNotification: boolean;
    type?: 'success' | 'error' | 'warning';
    message?: string;
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);




