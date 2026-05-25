import {RouteProps} from "react-router-dom";
import PlantsDirectory from "../../Domain/plants/model/PlantsDirectory/PlantsDirectory";
import DriverDirectory from "../../Domain/driver/model/DriverDirectory/DriverDirectory";
import CustomerDirectory from "../../Domain/ttn/customers/model/CustomerDirectoryPage/CustomerDirectory";
import BsuDirectory from "../../Domain/plants/bsu/model/BsuDirectory/BsuDirectory";
import SilCemDirectory from "../../Domain/recipe/SilCem/model/SilCemDirectory/SilCemDirectory";
import ProductDirectory from "../../Domain/product/model/ProductDirectory/ProductDirectory";
import ReportCurrentLoopDirectory
    from "../../Domain/product/reportCurrentLoop/model/ReportCurrentLoopDirectory/ReportCurrentLoopDirectory";
import ReportWeightManualDirectory
    from "../../Domain/product/reportWeightManual/model/reportWeightManualDirectory/reportWeightManualDirectory";
import MixtureDirectory from "../../Domain/recipe/mixture/model/mixtureDirectory/mixtureDirectory";
import RecCompDirectory from "../../Domain/recipe/recComp/model/recCompDirectory/recCompDirectory";
import RecFrostDirectory from "../../Domain/recipe/recFrost/model/recFrostDirectory/recFrostDirectory";
import RecMobilityDirectory from "../../Domain/recipe/recMobility/model/recMobilityDirectory/recMobilityDirectory";
import RecStrengthDirectory from "../../Domain/recipe/recStrength/model/recStrengthDirectory/recStrengthDirectory";
import RecWatDirectory from "../../Domain/recipe/recWat/model/recWatDirectory/recWatDirectory";
import RecipeDirectory from "../../Domain/recipe/model/RecipeDirectory/RecipeDirectory";
import CompDirectory from "../../Domain/recipe/comp/model/CompDirectoryPage/CompDirectory";
import CarDirectory from "../../Domain/car/model/CarDirectory/CarDirectory";
import DispatcherDirectory from "../../Domain/dispathcer/model/DispatcherDirectory/DispatcherDirectory";
import MarkaDirectory from "../../Domain/recipe/marka/model/MarkaDirectory/MarkaDirectory";
import RecCommentDirectory from "../../Domain/recipe/recComment/model/recCommentDirectory/recCommentDirectory";
import ReportsPage from "../../Pages/reportsPage/reportsPage";
import CreateEditOrderPage from "../../Pages/createEditOrderPage/createEditOrderPage";
import OrdersPage from "../../Pages/ordersPage/ordersPage";
import WeighingReportsPage from "../../Pages/weighingReportsPage/weighingReportsPage";
import {AppRoutes} from "./const";
import {RoutePath} from "./RoutePath";
import LoginPage from "../../Pages/loginPage/loginPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import UsersDirectory from "../../Domain/users/models/UsersDirectory/usersDirectory";
import VerifyCodePage from "../../Domain/users/models/LoginForm/verifyCodePage";
import ProductionAnalysisPage from "../../Pages/productionAnalysisPage/productionAnalysisPage";
import {Roles} from "../../Infrastructure/const/roles";
import ComponentAnalysisPage from "../../Pages/componentAnalysisPage/componentAnalysisPage";
import DeliveryPage from "../../Pages/deliveryPage/deliveryPage";

export interface IAdditionalProps {
    name?: string,
    name2?: string
}

export const RouteConfig: Record<AppRoutes, RouteProps & IAdditionalProps> = {
    [AppRoutes.ORDERS_PAGE]: {
        path: RoutePath.ordersPage,
        element: (
            <ProtectedRoute element={<OrdersPage/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.ordersPage"
    },

    [AppRoutes.CREATE_EDIT_ORDER]: {
        path: RoutePath.createEditOrder,
        element: (
            <ProtectedRoute element={<CreateEditOrderPage/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.createEditOrder"
    },

    [AppRoutes.REPORTS_PAGE]: {
        path: RoutePath.reportsPage,
        element: (
            <ProtectedRoute element={<ReportsPage/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.reportsPage"
    },

    [AppRoutes.WEIGHING_REPORTS_PAGE]: {
        path: RoutePath.weighingReportsPage,
        element: (
            <ProtectedRoute element={<WeighingReportsPage/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.weighingReportsPage"
    },

    [AppRoutes.CAR_DIRECTORY]: {
        path: RoutePath.carDirectory,
        element: (
            <ProtectedRoute element={<CarDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.carDirectory"
    },

    [AppRoutes.DRIVER_DIRECTORY]: {
        path: RoutePath.driverDirectory,
        element: (
            <ProtectedRoute element={<DriverDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.driverDirectory"
    },

    [AppRoutes.PLANTS_DIRECTORY]: {
        path: RoutePath.plantsDirectory,
        element: (
            <ProtectedRoute element={<PlantsDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.plantsDirectory"
    },

    [AppRoutes.CUSTOMER_DIRECTORY]: {
        path: RoutePath.customerDirectory,
        element: (
            <ProtectedRoute element={<CustomerDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.customerDirectory"
    },

    [AppRoutes.BSU_DIRECTORY]: {
        path: RoutePath.bsuDirectory,
        element: (
            <ProtectedRoute element={<BsuDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.bsuDirectory"
    },

    [AppRoutes.SIL_CEM_DIRECTORY]: {
        path: RoutePath.silCemDirectory,
        element: (
            <ProtectedRoute element={<SilCemDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.silCemDirectory"
    },

    [AppRoutes.PRODUCT_DIRECTORY]: {
        path: RoutePath.productDirectory,
        element: (
            <ProtectedRoute element={<ProductDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.productDirectory"
    },

    [AppRoutes.REPORT_CURRENT_LOOP_DIRECTORY]: {
        path: RoutePath.reportCurrentLoopDirectory,
        element: (
            <ProtectedRoute element={<ReportCurrentLoopDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.reportCurrentLoopDirectory"
    },

    [AppRoutes.REPORT_WEIGHT_MANUAL_DIRECTORY]: {
        path: RoutePath.reportWeightManualDirectory,
        element: (
            <ProtectedRoute element={<ReportWeightManualDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.reportWeightManualDirectory"
    },

    [AppRoutes.MIXTURE_DIRECTORY]: {
        path: RoutePath.mixtureDirectory,
        element: (
            <ProtectedRoute element={<MixtureDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.mixtureDirectory"
    },

    [AppRoutes.REC_COMP_DIRECTORY]: {
        path: RoutePath.recCompDirectory,
        element: (
            <ProtectedRoute element={<RecCompDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.recCompDirectory"
    },

    [AppRoutes.REC_FROST_DIRECTORY]: {
        path: RoutePath.recFrostDirectory,
        element: (
            <ProtectedRoute element={<RecFrostDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.recFrostDirectory"
    },

    [AppRoutes.REC_MOBILITY_DIRECTORY]: {
        path: RoutePath.recMobilityDirectory,
        element: (
            <ProtectedRoute element={<RecMobilityDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.recMobilityDirectory"
    },

    [AppRoutes.REC_STRENGTH_DIRECTORY]: {
        path: RoutePath.recStrengthDirectory,
        element: (
            <ProtectedRoute element={<RecStrengthDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.recStrengthDirectory"
    },

    [AppRoutes.REC_WAT_DIRECTORY]: {
        path: RoutePath.recWatDirectory,
        element: (
            <ProtectedRoute element={<RecWatDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.recWatDirectory"
    },

    [AppRoutes.RECIPE_DIRECTORY]: {
        path: RoutePath.recipeDirectory,
        element: (
            <ProtectedRoute element={<RecipeDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: 'routes.recipeDirectory'
    },

    [AppRoutes.COMP_DIRECTORY]: {
        path: RoutePath.compDirectory,
        element: (
            <ProtectedRoute element={<CompDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.compDirectory"
    },

    [AppRoutes.DISPATCHER_DIRECTORY]: {
        path: RoutePath.dispatcherDirectory,
        element: (
            <ProtectedRoute element={<DispatcherDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.dispatcherDirectory"
    },

    [AppRoutes.MARKA_DIRECTORY]: {
        path: RoutePath.markaDirectory,
        element: (
            <ProtectedRoute element={<MarkaDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.markaDirectory"
    },

    [AppRoutes.REC_COMMENT_DIRECTORY]: {
        path: RoutePath.recCommentDirectory,
        element: (
            <ProtectedRoute element={<RecCommentDirectory/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "routes.recCommentDirectory"
    },

    [AppRoutes.PRODUCTION_ANALYSIS]: {
        path: RoutePath.productionAnalysis,
        element: (
            <ProtectedRoute element={<ProductionAnalysisPage/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "Обсяг виробництва"
    },

    [AppRoutes.COMPONENTS_ANALYSIS]: {
        path: RoutePath.componentsAnalysis,
        element: (
            <ProtectedRoute element={<ComponentAnalysisPage/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "Витрати матерiалiв"
    },

    /*[AppRoutes.DELIVERY_DIRECTORY]: {
        path: RoutePath.componentsAnalysis,
        element: (
            <ProtectedRoute element={<DeliveryPage/>}
                            roles={[Roles.SPEC_REALIZE_PRODUCT, Roles.ADMIN, Roles.SPEC, Roles.SPEC_PREPARE_PRODUCTION, Roles.CHIEF_TECHNOLOGIST, Roles.GUEST]}
            />
        ),
        name: "Постачання"
    },*/

    [AppRoutes.LOGIN_PAGE]: {
        path: RoutePath.loginPage,

        element: (<PublicRoute element={<LoginPage/>}/>),
        name: "Users.authorization"
    },

    [AppRoutes.VERIFY_CODE]: {
        path: RoutePath.verifyCode,

        element: (<PublicRoute element={<VerifyCodePage/>}/>),
        name: "Users.authorization"
    },
    [AppRoutes.USERS_DIRECTORY]: {
        path: RoutePath.usersDirectory,

        element: (
            <ProtectedRoute element={<UsersDirectory/>} roles={[Roles.ADMIN]}/>
        ),
        name: "Users.users"
    }


};