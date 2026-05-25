import { useContext } from 'react';
import {NotificationContext} from "../../../Infrastructure/contexts/NotificationContext";

function Notification() {

    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error('NotificationContext must be used within NotificationProvider');
    }
    const { showNotification, type, message } = context;

    return (
        <>
            {showNotification && (
                <div className='fixed top-0 left-1/2 mt-5 z-50'>
                    {type === 'success' && <p className='py-2 px-10 bg-[#CFFFDF] rounded-xl text-black'>{message}</p>}
                    {type === 'error' && <p className='py-2 px-10 bg-[#FFCFCF] rounded-xl text-black'>{message}</p>}
                    {type === 'warning' && <p className='py-2 px-10 bg-[#FFE6B7] rounded-xl text-black'>{message}</p>}
                </div>
            )}
        </>
    );
}

export default Notification;