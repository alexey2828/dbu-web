import React, {FC} from 'react';
import {ITtnState} from "../../const/ttnState";
import {useNavigate} from "react-router-dom";
import {ReactComponent as Report} from "../../../../../Public/Images/reports.svg";
import {generalLinks} from "../../../../../Infrastructure/const/links";
import {useCurrentItems} from "../../../../../Infrastructure/hooks/useCurrentItems";
import Loader from "../../../../../ui/Components/Loader/Loader";

interface ITtnStateTable {
    ttnState: ITtnState[] | undefined
    isLoadingTtnState: boolean
}

const TtnStateTable: FC<ITtnStateTable> = ({ttnState, isLoadingTtnState}) => {

    const {currentTtn} = useCurrentItems()

    const navigate = useNavigate();
    const onClickToReports = () => {
        navigate(`/${generalLinks.reports}`, {state: {currentTtn}})
    }

    return (
        <>
            {!isLoadingTtnState ?
                ttnState && ttnState.length > 0 && (
                    <div className="px-4 max-h-[40vh] overflow-y-auto max-w-sm relative flex flex-col">

                        {ttnState.map((item, index) => {
                            return (
                                <div key={index} className={`grid grid-cols-6 py-3 relative pl-8 text-sm `}>
                                    {/*<div className={`circle ${index === ttnState.length - 1 ? 'circle-last' : ''}`}> </div>*/}
                                    {['Создана', 'Отправлено в производство', 'Удалена', 'Корреция'].includes(item.state) ?
                                        <div className={`square`}></div> :
                                        <div className={`circle`}></div>
                                    }
                                    <div className="flex flex-col col-span-3">
                                        {item.date}
                                    </div>
                                    <span className={'text-left flex col-span-3 items-center'}>
                                        {item?.isPause ? '(На паузе)' : ''}
                                        {item.state}
                                        {item.state === 'Отчет сохранен' &&
                                            <button className={'mr-5'} onClick={() => onClickToReports()}>
                                                <Report/>
                                            </button>
                                        }
                                    </span>
                                    {index !== ttnState.length - 1 && (
                                        <div className="vertical-line"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                ) : <Loader/>
            }
        </>
    );
};


export default TtnStateTable;