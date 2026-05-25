import React, { useState } from 'react';
import ModalForm from "../../../../../ui/Components/Modal/ModalForm";
import { tKey } from "../../../../../Infrastructure/i18n/tKey";
import Select from "../../../../../ui/Components/Select/select";
import Button from "../../../../../ui/Components/Button/Button";
import SaveModal from "../../../../../ui/Components/Modal/SaveModal";
import { classRecipeAPI } from "../../../../../Infrastructure/services/RecipeServices/ClassRecipeService";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { useModal } from "../../../../../Infrastructure/hooks/useModal";
import axios from "axios";
import {queries} from "../../../../../Infrastructure/const/queries";

const ExcelRecipeModal = () => {

    const { data: classRecipe } = classRecipeAPI.useFetchAllClassRecipeQuery('');
    const { t } = useTranslation();
    const { openModal, closeModal } = useModal();

    // EXPORT FORM
    const { register, handleSubmit, watch } = useForm();
    const selectedClassRecipe = watch('classRecipe');

    // IMPORT FORM
    const {
        handleSubmit: handleSubmit2,
        control,
        formState: { errors: errors2 }
    } = useForm();

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else {
            setDragActive(false);
        }
    };

    // ===== EXPORT =====
    const exportData = async (data: any) => {
        try {
            const url = selectedClassRecipe
                ? `${queries.baseUrl}export/exportCsv.php?classRecipe=${data.classRecipe}`
                : `${queries.baseUrl}export/exportCsv.php`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Ошибка');

            const blob = await response.blob();

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = downloadUrl;
            link.download = selectedClassRecipe
                ? `recipes_${data.classRecipe}.xlsx`
                : `recipes_all.xlsx`;

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

        } catch (err) {
            console.error(err);
        }

        closeModal('confirmExport');
        closeModal('ExcelExportRecipeModal');
    };

    // ===== IMPORT =====
    const importData = async (data: any) => {

        const file = data.file?.[0];

        if (!file) {
            setError('Выберите файл');
            return;
        }

        if (!file.name.endsWith('.xlsx')) {
            setError('Можно загружать только xlsx файл');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setUploadProgress(0);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(
                `${queries.baseUrl}import/importCsv.php`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) /
                            (progressEvent.total || 1)
                        );
                        setUploadProgress(percent);
                    },
                }
            );

            setResult(response.data);

        } catch (err: any) {
            setError(err?.response?.data?.error || 'Ошибка загрузки');
        } finally {
            setUploading(false);
        }

        closeModal('confirmImport');
    };

    return (
        <>
            <ModalForm
                modalName={'ExcelExportRecipeModal'}
                title={'Експорт та Iмпорт даних в Excel'}
            >
                <div className="flex gap-6 items-stretch">

                    {/* ===== EXPORT ===== */}
                    <div className="flex flex-col w-1/2 justify-between border rounded-xl p-4">

                        <form
                            onSubmit={handleSubmit(exportData)}
                            className="flex flex-col gap-4 "
                        >
                            <h3 className="font-semibold text-center">
                                {tKey(t, 'recipe.export')}
                            </h3>
                            <label htmlFor="">Вид сумiшi</label>

                            <Select
                                selectOptions={classRecipe || []}
                                getOptionLabel={item => item.name}
                                getOptionValue={item => item.code}
                                register={register}
                                options={{ required: false }}
                                name="classRecipe"
                                additionalStyles="w-full"
                                additionalOptionLabel={tKey(t, 'recipeDescription.selectValue')}
                            />
                        </form>

                        <div className="flex justify-center mt-6">
                            <Button
                                type="button"
                                onClick={() => openModal('confirmExport')}
                            >
                                {tKey(t, 'recipe.export')}
                            </Button>
                        </div>
                    </div>

                    {/* ===== IMPORT ===== */}
                    <div className="flex flex-col w-1/2 justify-between border rounded-xl p-4">

                        <form
                            onSubmit={handleSubmit2(importData)}
                            className="flex flex-col gap-4 items-center"
                        >
                            <h3 className="font-semibold text-center">
                                {tKey(t, 'recipe.import')}
                            </h3>

                            {/* DRAG & DROP + RHF */}
                            <Controller
                                name="file"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange } }) => (
                                    <div
                                        className={`
                                            w-full
                                            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
                                            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                                            hover:border-blue-400 hover:bg-gray-50
                                        `}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            setDragActive(false);

                                            const files = e.dataTransfer.files;
                                            if (files && files.length > 0) {
                                                setFileName(files[0].name);
                                                onChange(files);
                                            }
                                        }}
                                        onClick={() =>
                                            document.getElementById('fileInput')?.click()
                                        }
                                    >
                                        <input
                                            id="fileInput"
                                            type="file"
                                            accept=".xlsx"
                                            className="hidden"
                                            onChange={(e) => {
                                                const files = e.target.files;
                                                if (files && files.length > 0) {
                                                    setFileName(files[0].name);
                                                    onChange(files);
                                                }
                                            }}
                                        />

                                        {!fileName ? (
                                            <>
                                                <p className="text-gray-600">
                                                    Перетягніть файл або клацніть
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Тільки .xlsx
                                                </p>
                                            </>
                                        ) : (
                                            <div className="text-green-600 font-medium">
                                                📄 {fileName}
                                            </div>
                                        )}
                                    </div>
                                )}
                            />

                            {errors2.file && (
                                <p className="text-red-600">
                                    {t('errors.required')}
                                </p>
                            )}

                            {uploading && (
                                <progress value={uploadProgress} max="100" />
                            )}

                            {result?.success && (
                                <div className="bg-green-100 p-2 rounded text-sm w-full">
                                    ✅ Импорт завершен<br />
                                    Обновлено: {result.stats?.updated_recipes}
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-100 p-2 rounded text-sm text-red-700 w-full">
                                    ❌ {error}
                                </div>
                            )}
                        </form>

                        <div className="flex justify-center mt-6">
                            <Button
                                type="button"
                                onClick={() => openModal('confirmImport')}
                                disabled={uploading}
                            >
                                {uploading
                                    ? `Загрузка ${uploadProgress}%`
                                    : tKey(t, 'recipe.import')}
                            </Button>
                        </div>
                    </div>

                </div>
            </ModalForm>

            <SaveModal
                nameModal="confirmExport"
                handleSubmit={handleSubmit(exportData)}
            />

            <SaveModal
                nameModal="confirmImport"
                handleSubmit={handleSubmit2(importData)}
            />
        </>
    );
};

export default ExcelRecipeModal;