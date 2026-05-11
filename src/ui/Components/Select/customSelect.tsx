import React, { FC, useState } from "react";

interface BsuItem {
    id: number;
    state: string;
    stateName: string;
    date: string;
    codeBsu: string;
}

interface CustomSelectProps {
    items: BsuItem[] ;
    placeholder?: string;
}

const CustomSelect: FC<CustomSelectProps> = ({
                                                 items,
                                                 placeholder = "Статуси рецептiв"
                                             }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-64">

            {/* BUTTON */}
            <div
                onClick={() => setIsOpen(prev => !prev)}
                className="bg-gray-200 text-black px-3  mt-1 rounded cursor-pointer border border-gray-800 select-none"
            >
                {placeholder}
            </div>

            {/* DROPDOWN */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white text-black rounded-xl shadow-lg border border-gray-200 z-[9999]">

                    {/* HEADER */}
                    <div className="flex justify-end px-3 py-2 border-b">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-red-500"
                        >
                            ✕
                        </button>
                    </div>

                    {/* LIST */}
                    <div className="max-h-60 overflow-y-auto">
                        {items && items.map(item => (
                            <div
                                key={item.id}
                                className="px-3 py-2 border-b last:border-b-0"
                            >
                                <div className="text-sm font-medium">
                                    {item.codeBsu || "—"}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {item.stateName}
                                </div>
                                <div className="text-[10px] text-gray-400">
                                    {item.date}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}

        </div>
    );
};

export default CustomSelect;