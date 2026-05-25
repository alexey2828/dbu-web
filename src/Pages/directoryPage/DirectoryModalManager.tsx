import React from 'react';
import CustomerPostForm from "../../Domain/ttn/customers/model/CustomerDirectoryPage/CustomerPostForm/CustomerPostForm";
import BsuPostModal from "../../Domain/plants/bsu/model/BsuDirectory/BsuPostModal/BsuPostModal";
import {directoryModals} from "../../Infrastructure/const/modalNames";
import CompPostModal from "../../Domain/recipe/comp/model/CompDirectoryPage/CompPostModal/CompPostModal";
import CarPostForm from "../../Domain/car/model/CarDirectory/CarPostForm/CarPostForm";
import DriverPostForm from "../../Domain/driver/model/DriverDirectory/DriverPostForm/DriverPostForm";
import PlantsPostForm from "../../Domain/plants/model/PlantsDirectory/PlantsPostForm/PlantsPostForm";
import ProductPostForm from "../../Domain/product/model/ProductDirectory/ProductPostForm/ProductPostForm";
import ReportCurrentLoopPostForm
    from "../../Domain/product/reportCurrentLoop/model/ReportCurrentLoopDirectory/ReportCurrentLoopPostForm/ReportCurrentLoopPostForm";
import ReportWeightManualPostForm
    from "../../Domain/product/reportWeightManual/model/reportWeightManualDirectory/reportWeightManualPostForm/reportWeightManualPostForm";
import MixturePostForm from "../../Domain/recipe/mixture/model/mixtureDirectory/MixturePostForm/MixturePostForm";
import RecipePostForm from "../../Domain/recipe/model/RecipeDirectory/RecipePostForm/RecipePostForm";
import RecCompPostForm from "../../Domain/recipe/recComp/model/recCompDirectory/recCompPostForm/recCompPostForm";
import RecFrostPostForm from "../../Domain/recipe/recFrost/model/recFrostDirectory/recFrostPostForm/recFrostPostForm";
import RecMobilityPostForm
    from "../../Domain/recipe/recMobility/model/recMobilityDirectory/recMobilityPostForm/recMobilityPostForm";
import RecStrengthPostForm
    from "../../Domain/recipe/recStrength/model/recStrengthDirectory/recStrengthPostForm/recStrengthPostForm";
import RecWatPostForm from "../../Domain/recipe/recWat/model/recWatDirectory/recWatPostForm/recWatPostForm";
import SilCemPostForm from "../../Domain/recipe/SilCem/model/SilCemDirectory/SilCemPostForm/SilCemPostForm";
import DispatcherPostForm
    from "../../Domain/dispathcer/model/DispatcherDirectory/DispatcherPostForm/DispatcherPostForm";
import MarkaPostForm from "../../Domain/recipe/marka/model/MarkaDirectory/MarkaPostForm/MarkaPostForm";
import RecCommentPostForm
    from "../../Domain/recipe/recComment/model/recCommentDirectory/recCommentPostForm/recCommentPostForm";
import {useModal} from "../../Infrastructure/hooks/useModal";
import CompTypePostModal from "../../Domain/recipe/compType/model/CompTypePostModal/CompTypePostModal";
import UserPostForm from "../../Domain/users/models/UsersDirectory/UserPostForm/UserPostForm";
import UserEditForm from "../../Domain/users/models/UsersDirectory/UserPostForm/UserEditForm";

type ModalKey = keyof typeof directoryModals;

const DirectoryModalManager = () => {
    const {modals} = useModal();

    const modalsToComponents: Record<any, JSX.Element> = {
        customer: <CustomerPostForm />,
        bsu: <BsuPostModal />,
        comp: <CompPostModal />,
        car: <CarPostForm/>,
        driver: <DriverPostForm />,
        plants: <PlantsPostForm />,
        product: <ProductPostForm />,
        dispatcher: <DispatcherPostForm/>,
        reportCurrentLoop: <ReportCurrentLoopPostForm />,
        reportWeightManual: <ReportWeightManualPostForm />,
        mixture: <MixturePostForm />,
        recipe: <RecipePostForm />,
        recComp: <RecCompPostForm />,
        recFrost: <RecFrostPostForm />,
        recMobility: <RecMobilityPostForm />,
        recStrength: <RecStrengthPostForm />,
        recWat: <RecWatPostForm />,
        silCem: <SilCemPostForm />,
        marka: <MarkaPostForm />,
        recComment: <RecCommentPostForm />,
        compType: <CompTypePostModal />,
        user: <UserPostForm/>,
/*
        userEdit: <UserEditForm/>
*/
    };

    return (
        <div>
            {modals.map((modal) => {
                const modalName = modal.name as ModalKey;
                return modalsToComponents[modalName];
            })}
        </div>
    );
};

export default DirectoryModalManager;
