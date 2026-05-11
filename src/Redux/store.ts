import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {ttnAPI} from "../Infrastructure/services/TtnServices/TtnService";
import {ttnStateAPI} from "../Infrastructure/services/TtnServices/TtnStateService";
import {orderAPI} from "../Infrastructure/services/OrderServices/OrderService";
import {customerAPI} from "../Infrastructure/services/OrderServices/CustomerService";
import {plantAPI} from "../Infrastructure/services/PlantServices/PlantService";
import {driverAPI} from "../Infrastructure/services/DriverServices/DriverService";
import {carAPI} from "../Infrastructure/services/CarServices/CarService";
import {bsuAPI} from "../Infrastructure/services/PlantServices/BsuService";
import {silCemAPI} from "../Infrastructure/services/PlantServices/SilCem";
import {productAPI} from "../Infrastructure/services/ProductServices/ProductService";
import {reportCurrentLoopAPI} from "../Infrastructure/services/ProductServices/ReportCurrentLoopService";
import {reportWeightManualAPI} from "../Infrastructure/services/ProductServices/ReportWeightManualService";
import {mixtureAPI} from "../Infrastructure/services/RecipeServices/MixtureService";
import {recWatAPI} from "../Infrastructure/services/RecipeServices/RecWatService";
import {recStrengthAPI} from "../Infrastructure/services/RecipeServices/RecStrengthService";
import {recMobilityAPI} from "../Infrastructure/services/RecipeServices/recMobilityService";
import {recFrostAPI} from "../Infrastructure/services/RecipeServices/RecFrostService";
import {recCompAPI} from "../Infrastructure/services/RecipeServices/RecCompService";
import {recipeAPI} from "../Infrastructure/services/RecipeServices/RecipeService";
import {markaAPI} from "../Infrastructure/services/RecipeServices/MarkaService";
import {compAPI} from "../Infrastructure/services/RecipeServices/CompService";
import {dispatcherAPI} from "../Infrastructure/services/DispatcherServices/DispatcherService";
import {recCommentAPI} from "../Infrastructure/services/RecipeServices/recCommentService";
import {reportsAPI} from "../Infrastructure/services/ReportsServices/ReportsService";
import {classRecipeAPI} from "../Infrastructure/services/RecipeServices/ClassRecipeService";
import {compTypeAPI} from "../Infrastructure/services/RecipeServices/CompTypeService";
import {userAPI} from "../Infrastructure/services/UserService/UserService";
import {productionAnalysisAPI} from "../Infrastructure/services/ProductionAnalysisServices/ProductionAnalysisService";

const rootReducer = combineReducers({
    [ttnAPI.reducerPath]: ttnAPI.reducer,
    [ttnStateAPI.reducerPath]: ttnStateAPI.reducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    [customerAPI.reducerPath]: customerAPI.reducer,
    [plantAPI.reducerPath]: plantAPI.reducer,
    [driverAPI.reducerPath]: driverAPI.reducer,
    [carAPI.reducerPath]: carAPI.reducer,
    [bsuAPI.reducerPath]: bsuAPI.reducer,
    [silCemAPI.reducerPath]: silCemAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [reportCurrentLoopAPI.reducerPath]: reportCurrentLoopAPI.reducer,
    [reportWeightManualAPI.reducerPath]: reportWeightManualAPI.reducer,
    [mixtureAPI.reducerPath]: mixtureAPI.reducer,
    [recWatAPI.reducerPath]: recWatAPI.reducer,
    [recStrengthAPI.reducerPath]: recStrengthAPI.reducer,
    [recMobilityAPI.reducerPath]: recMobilityAPI.reducer,
    [recFrostAPI.reducerPath]: recFrostAPI.reducer,
    [recCompAPI.reducerPath]: recCompAPI.reducer,
    [recipeAPI.reducerPath]: recipeAPI.reducer,
    [markaAPI.reducerPath]: markaAPI.reducer,
    [compAPI.reducerPath]: compAPI.reducer,
    [dispatcherAPI.reducerPath]: dispatcherAPI.reducer,
    [recCommentAPI.reducerPath]: recCommentAPI.reducer,
    [reportsAPI.reducerPath]: reportsAPI.reducer,
    [classRecipeAPI.reducerPath]: classRecipeAPI.reducer,
    [compTypeAPI.reducerPath]: compTypeAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [productionAnalysisAPI.reducerPath]: productionAnalysisAPI.reducer,


})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                ttnAPI.middleware,
                ttnStateAPI.middleware,
                orderAPI.middleware,
                customerAPI.middleware,
                plantAPI.middleware,
                driverAPI.middleware,
                carAPI.middleware,
                bsuAPI.middleware,
                silCemAPI.middleware,
                productAPI.middleware,
                reportCurrentLoopAPI.middleware,
                reportWeightManualAPI.middleware,
                mixtureAPI.middleware,
                recWatAPI.middleware,
                recStrengthAPI.middleware,
                recMobilityAPI.middleware,
                recCompAPI.middleware,
                recFrostAPI.middleware,
                recipeAPI.middleware,
                markaAPI.middleware,
                compAPI.middleware,
                dispatcherAPI.middleware,
                recCommentAPI.middleware,
                reportsAPI.middleware,
                classRecipeAPI.middleware,
                compTypeAPI.middleware,
                userAPI.middleware,
                productionAnalysisAPI.middleware,
            )
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']