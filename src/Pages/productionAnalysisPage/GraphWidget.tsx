    import React, {useEffect, useMemo, useState} from "react";
    import {useForm} from "react-hook-form";
    import {
        BarChart,
        Bar,
        XAxis,
        YAxis,
        Tooltip,
        ResponsiveContainer,
        CartesianGrid,
    } from "recharts";
    import {
        productionAnalysisAPI
    } from "../../Infrastructure/services/ProductionAnalysisServices/ProductionAnalysisService";
    import {bsuAPI} from "../../Infrastructure/services/PlantServices/BsuService";
    import Input from "../../ui/Components/Input/Input";
    import Select from "../../ui/Components/Select/select";
    import Button from "../../ui/Components/Button/Button";
    import PanelTool from "../../ui/Components/PanelTools/panelTool";

    type FormValues = {
        bsuCode?: string;
        timeStart?: string;
        timeEnd?: string;
        step?: 'day' | 'month' | 'hour' | null;
    };

    type ApiResponse = {
        dateRange: string[];
        totalVProduct: number[];
    };

    export default function GraphWidget({title}: { title: string }) {
        const STORAGE_KEY = `graph_widget_filters_${title}`;
        const [fetchGraph, {data, isLoading}] =
            productionAnalysisAPI.useLazyFetchGraphAnalysisQuery();

        const {data: bsu} = bsuAPI.useFetchAllBsuQuery('');

        const modes = [
            {label: 'Година', value: 'hour'},
            {label: 'День', value: 'day'},
            {label: 'Мiсяць', value: 'month'},
        ] as const;

        const {
            register,
            handleSubmit,
            setValue,
            setError,
            watch,
            reset,
        } = useForm<FormValues>({
            defaultValues: {
                step: null,
                bsuCode: '',
                timeStart: '',
                timeEnd: ''
            }
        });

        // 🔥 только для UI
        const step = watch('step');

        // 🔥 применённые значения
        const [appliedRange, setAppliedRange] = useState<{
            timeStart?: string;
            timeEnd?: string;
        } | null>(null);

        const [appliedStep, setAppliedStep] = useState<FormValues['step']>(null);
        const [appliedBsu, setAppliedBsu] = useState<string | null>(null);

        const onSubmit = (formData: FormValues) => {
            const {bsuCode, timeStart, timeEnd, step} = formData;

            if (!bsuCode && !timeStart && !timeEnd && !step) {
                setError('root', {message: 'Оберіть хоча б один параметр'});
                return;
            }

            if ((timeStart && !timeEnd) || (!timeStart && timeEnd)) {
                setError('timeStart', {message: 'Оберіть обидві дати'});
                setError('timeEnd', {message: 'Оберіть обидві дати'});
                return;
            }

            const params: any = {};

            if (bsuCode) params.bsuCode = bsuCode;
            if (timeStart && timeEnd) {
                params.timeStart = timeStart;
                params.timeEnd = timeEnd;
            }
            if (step) params.step = step;

            // 🔥 применяем только после кнопки
            setAppliedBsu(bsuCode || null);
            setAppliedStep(step);
            setAppliedRange({timeStart, timeEnd});

            fetchGraph(params);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        };



        useEffect(() => {
            if (!bsu?.length) return;

            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return;

            const parsed = JSON.parse(saved);

            reset({
                bsuCode: parsed.bsuCode || '',
                timeStart: parsed.timeStart || '',
                timeEnd: parsed.timeEnd || '',
                step: parsed.step || null,
            });

        }, [bsu, reset]);


        useEffect(() => {
            if (!bsu?.length) return;

            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return;

            const parsed: FormValues = JSON.parse(saved);

            reset({
                bsuCode: parsed.bsuCode || '',
                timeStart: parsed.timeStart || '',
                timeEnd: parsed.timeEnd || '',
                step: parsed.step || null,
            });

            const params: any = {};

            if (parsed.bsuCode) params.bsuCode = parsed.bsuCode;

            if (parsed.timeStart && parsed.timeEnd) {
                params.timeStart = parsed.timeStart;
                params.timeEnd = parsed.timeEnd;
            }

            if (parsed.step) params.step = parsed.step;

            if (!Object.keys(params).length) return;

            setAppliedBsu(parsed.bsuCode || null);
            setAppliedStep(parsed.step || null);
            setAppliedRange({
                timeStart: parsed.timeStart,
                timeEnd: parsed.timeEnd,
            });

            // 4. Делаем запрос
            fetchGraph(params);

        }, [bsu, reset]);


        const appliedBsuLabel = useMemo(() => {
            if (!bsu || !appliedBsu) return '';
            return bsu.find((i: any) => i.code === appliedBsu)?.name || '';
        }, [bsu, appliedBsu]);

        const CustomTooltip = ({active, payload, label}: any) => {
            if (!active || !payload?.length) return null;

            return (
                <div className="bg-white border shadow px-3 py-2 rounded-md">
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-sm font-semibold">
                        Обсяг у м³: {payload[0].value}
                    </p>
                </div>
            );
        };

        const chartData = useMemo(() => {
            if (!data) return [];

            const res = data as ApiResponse;

            const base = res.dateRange.map((d, i) => ({
                date: d,
                volume: res.totalVProduct[i]
            }));

            // Если выбран час - возвращаем почасовые данные
            if (appliedStep === 'hour') return base;

            // Для остальных случаев (day, month и т.д.) - группируем по дням
            const grouped: Record<string, number> = {};

            base.forEach(item => {
                const day = item.date.slice(0, 10);

                if (!grouped[day]) grouped[day] = 0;
                grouped[day] += item.volume;
            });

            return Object.entries(grouped).map(([date, volume]) => ({
                date,
                volume
            }));

        }, [data, appliedStep, appliedRange]);


        return (
            <div className="flex flex-col w-full">

                <PanelTool additionStyles="w-full">

                    <div className="w-full flex flex-col gap-2">

                        <h3 className="text-center font-semibold">
                            Аналiз по: {appliedBsuLabel}
                        </h3>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col items-center gap-4 pt-2"
                        >

                            <div className="flex flex-wrap justify-center items-center gap-2">

                                {/* DATE */}
                                <div className="relative flex items-center gap-2 border p-3 rounded-xl">
                                    <span className="absolute -top-3 left-2 bg-gray-300 px-1 text-gray-800 text-base">
                                        Дата
                                    </span>

                                    <Input type="datetime-local" name="timeStart" register={register}/>
                                    <Input type="datetime-local" name="timeEnd" register={register}/>
                                </div>

                                {/* BSU */}
                                <div className="relative border p-3 rounded-xl">
                                    <span className="absolute -top-3 left-2 bg-gray-300 px-1 text-gray-800 text-base">
                                        БЗВ
                                    </span>

                                    <Select
                                        selectOptions={bsu}
                                        getOptionLabel={(i: any) => i.name}
                                        getOptionValue={(i: any) => i.code}
                                        name="bsuCode"
                                        register={register}
                                        additionalOptionLabel={'Оберiть значення'}
                                    />
                                </div>

                                {/* STEP */}
                                <div className="relative border p-3 rounded-xl">
                                    <span className="absolute -top-3 left-2 bg-gray-300 px-1 text-gray-800 text-base">
                                        Перiод
                                    </span>

                                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                                        {modes.map(m => (
                                            <button
                                                key={m.value}
                                                type="button"
                                                onClick={() => setValue('step', m.value)}
                                                className={`px-3 py-1 rounded-lg text-sm
                                                    ${step === m.value ? 'bg-white shadow' : ''}`}
                                            >
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            <div className="flex justify-center gap-3 w-full">

                                <Button type="submit">
                                    Застосувати
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => {
                                        reset({
                                            bsuCode: '',
                                            timeStart: '',
                                            timeEnd: '',
                                            step: null
                                        });

                                        setAppliedBsu(null);
                                        setAppliedStep(null);
                                        setAppliedRange(null);

                                        fetchGraph('');
                                        localStorage.removeItem(STORAGE_KEY);
                                    }}
                                >
                                    Очистити
                                </Button>

                            </div>

                        </form>

                    </div>

                </PanelTool>

                <div className="h-[200px] w-full mt-3">

                    {isLoading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => {
                                        const d = new Date(value);

                                        if (appliedStep === 'hour' && appliedRange) {
                                            const diff =
                                                new Date(appliedRange.timeEnd || '').getTime() -
                                                new Date(appliedRange.timeStart || '').getTime();

                                            if (diff <= 24 * 60 * 60 * 1000) {
                                                return d.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                });
                                            }
                                        }

                                        return d.toLocaleDateString();
                                    }}
                                />
                                <YAxis/>
                                <Tooltip content={<CustomTooltip/>}/>
                                <Bar dataKey="volume" fill="#4f46e5"/>
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                </div>

            </div>
        );
    }