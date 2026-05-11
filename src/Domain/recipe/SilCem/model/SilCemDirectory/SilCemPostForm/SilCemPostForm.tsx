import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { silCemAPI } from "../../../../../../Infrastructure/services/PlantServices/SilCem";
import Input from "../../../../../../ui/Components/Input/Input";
import Button from "../../../../../../ui/Components/Button/Button";
import ModalForm from "../../../../../../ui/Components/Modal/ModalForm";
import SaveModal from "../../../../../../ui/Components/Modal/SaveModal";
import { bsuAPI } from "../../../../../../Infrastructure/services/PlantServices/BsuService";
import { confirmModals, directoryModals } from "../../../../../../Infrastructure/const/modalNames";
import Select from "../../../../../../ui/Components/Select/select";
import { useModal } from "../../../../../../Infrastructure/hooks/useModal";
import { useNotification } from "../../../../../../Infrastructure/hooks/useNotification";
import { CustomText } from "../../../../../../ui/Components/CustomText/CustomText";

const SilCemPostForm = () => {
    const { t } = useTranslation();
    const { notificationHandler } = useNotification();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [putData, { isError, isSuccess }] = silCemAPI.usePostSilCemMutation();
    const { data: silCemData } = silCemAPI.useFetchAllSilCemQuery('');
    const { data: bsu } = bsuAPI.useFetchAllBsuQuery('');
    const { openModal, closeModal } = useModal();

    const handlePut = async (data: any) => {
        const existingCode = silCemData?.some((item: any) => item.code === data.code);
        if (existingCode) {
            setError('code', {
                type: 'manual',
                message: t("errors.codeExists"),
            });
            return true;
        }

        await putData(data);
        closeModal(directoryModals.silCem);
    };

    useEffect(() => {
        if (isError) {
            notificationHandler({ type: 'error', message: t("errors.general") });
        } else if (isSuccess) {
            notificationHandler({ type: 'success', message: t("errors.success") });
        }
    }, [isError, isSuccess, t]);

    return (
        <>
            <ModalForm modalName={directoryModals.silCem} title={t("silCem.create")}>
                {bsu && (
                    <form onSubmit={handleSubmit(handlePut)}>
                        <div>
                            <label htmlFor="codeBSU">{t("silCem.idBSU")}</label>
                            <Select
                                selectOptions={bsu}
                                getOptionLabel={(bsu: any) => bsu.name}
                                getOptionValue={(bsu) => bsu.code}
                                register={register}
                                options={{ required: t("errors.required"), valueAsNumber: true }}
                                name="codeBSU"
                                additionalStyles={'w-full'}
                            />
                            <CustomText isError={true}>{errors.codeBSU?.message?.toString()}</CustomText>
                        </div>

                        <div>
                            <label htmlFor="code">{t("silCem.code")}</label>
                            <Input
                                name="code"
                                register={register}
                                options={{ required: t("errors.required"), valueAsNumber: true }}
                                type="search"
                                additionalStyles={'w-full'}
                                placeholder={t("placeholders.enterCode")}
                            />
                            <CustomText isError={true}>{errors.code?.message?.toString()}</CustomText>
                        </div>

                        <div>
                            <label htmlFor="batcher">{t("silCem.batcher")}</label>
                            <Input
                                name="batcher"
                                register={register}
                                options={{ required: t("errors.required"), valueAsNumber: true }}
                                type="search"
                                additionalStyles={'w-full'}
                                placeholder={t("placeholders.enterBatcher")}
                            />
                            <CustomText isError={true}>{errors.batcher?.message?.toString()}</CustomText>
                        </div>

                        <div>
                            <label htmlFor="capacity">{t("silCem.capacity")}</label>
                            <Input
                                name="capacity"
                                register={register}
                                options={{ required: false, valueAsNumber: true }}
                                type="number"
                                additionalStyles={'w-full'}
                                placeholder={t("placeholders.enterCapacity")}
                            />
                            <CustomText isError={true}>{errors.capacity?.message?.toString()}</CustomText>
                        </div>

                        <div className={'gap-3 flex justify-center items-center mt-5'}>
                            <Button onClick={() => openModal(confirmModals.silCemCreateConfirm)}>
                                {t("modals.save")}
                            </Button>
                            <Button onClick={() => closeModal(directoryModals.silCem)}>
                                {t("modals.close")}
                            </Button>
                        </div>
                    </form>
                )}
            </ModalForm>

            <SaveModal
                nameModal={confirmModals.silCemCreateConfirm}
                handleSubmit={handleSubmit((data) => handlePut(data))}
                error={errors}
            />
        </>
    );
};

export default SilCemPostForm;
