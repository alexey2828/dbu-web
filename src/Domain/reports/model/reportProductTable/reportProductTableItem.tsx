import React, {FC, useRef, useEffect, Dispatch, SetStateAction} from 'react';
import {useLocation} from "react-router-dom";
import {IProductReports, IReports} from "../../const/reports";

export interface ReportProductTableItem {
    item: IProductReports,
    setCurrentLoopData: Dispatch<SetStateAction<IReports | undefined>>
    reportData: any
    triggerCurrentLoopCalculate: any
    currentLoop: any
    isCleared: boolean,
    setIsCleared: any,
}

const ReportProductTableItem: FC<ReportProductTableItem> = (
    {item, setCurrentLoopData, reportData, triggerCurrentLoopCalculate, currentLoop, isCleared, setIsCleared},
) => {

    const location = useLocation();
    const rowRef = useRef<HTMLTableRowElement>(null);

    useEffect(() => {
        if (location.state && +location.state.currentTtn.id === +item.idTtn) {
            rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [location.state, item.idTtn, item]);

    function createMarkup(recipe: any) {
        return { __html: recipe };
    }

    function splitRecipe(recipe: any) {
        const parts = recipe.split('<br>');
        const firstPartEndIndex = Math.floor(parts.length / 3);
        const secondPartEndIndex = Math.ceil(parts.length / 3 * 2);

        return {
            firstPart: parts.slice(0, firstPartEndIndex).join('<br>'),
            secondPart: parts.slice(firstPartEndIndex, secondPartEndIndex - 1).join('<br>'),
            thirdPart: parts.slice(secondPartEndIndex - 1).join('<br>')
        };
    }

    const { firstPart, secondPart, thirdPart } = splitRecipe(item.recipe);

    const findLoopData = async (item: IProductReports) => {

        try {
            const data = await triggerCurrentLoopCalculate({timeStartExact: item.timeStart}).unwrap()
            // @ts-ignore
            setCurrentLoopData({...data,  product: reportData?.product})
            //setCurrentLoopData(data)
            setIsCleared(false)

        } catch (err){
            console.error(err)
        }
    }
    const isHighlighted = !isCleared &&
        currentLoop?.product?.some((p: any) => p.idTtn === item.idTtn && p.timeStart === item.timeStart);
    return (
        <tr ref={rowRef}
            className={`border-b ${isHighlighted ? 'bg-[#FEFFCF]' : ''}`}
            key={item.id}
            onClick = {() => findLoopData(item)}
        >
            <td>{item.timeStart}</td>
            <td>{item.timeEnd}</td>
            <td>{item.PlantName}</td>
            <td>{item.idTtn}</td>
            <td>{item.car}</td>
            <td>{item.driver}</td>
            <td>{item.classRecipe}</td>
            <td>{item.nameRecipe}</td>
            <td>{item.vProduct}</td>
            <td>{item.loopNumber}</td>
            <td>{item.vLoop}</td>

            {/*<td className="min-w-[650px]">
                <div className="flex w-full">
                    <div className="w-1/3" dangerouslySetInnerHTML={createMarkup(firstPart)}></div>
                    <div className="w-1/3" dangerouslySetInnerHTML={createMarkup(secondPart)}></div>
                    <div className="w-1/3" dangerouslySetInnerHTML={createMarkup(thirdPart)}></div>
                </div>
            </td>*/}
            {/*
            <td className="px-6 py-1">{item.timeStart}</td>
*/}
        </tr>
    );
};

export default ReportProductTableItem;
