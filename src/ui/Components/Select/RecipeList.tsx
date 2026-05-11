import React, { FC } from "react";

interface ApiOption {
    id: number;
    codeBsu: string;
    date: string;
    state: string;
    stateName: string;
}

interface Props {
    options: any;
}

const RecipeList: FC<Props> = ({ options }) => {
    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm">
            {options && options.map(({item}:any) => (
                <div
                    key={item?.id}
                    className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50"
                >
                    <div className="font-medium text-black">
                        {item?.stateName}
                    </div>

                    <div className="text-xs text-gray-500 flex gap-2">
                        <span>{item?.codeBsu}</span>
                        <span>•</span>
                        <span>{item?.date}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecipeList;