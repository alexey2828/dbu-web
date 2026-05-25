export interface ICalculate {
    code: number,
    factSum: number | string,
    name: string
    recipeSum: number | string,
    humidityKorrSum: number,
    errorKg: number | string,
    errorPercent: number | string,
}
export interface IProductReports {
    PlantName: string;
    id: number,
    dateStart: string,
    timeEnd: string,
    car: string,
    classRecipe: string,
    driver: string,
    idPlant: number,
    idTtn: number,
    nameRecipe: string,
    num_loop: number,
    recipe: string,
    vLoop: number,
    vProduct: number
    loopNumber: number
    timeStart: string
}

export interface IRecords {
    code: number,
    dispencer: number
    doisingError: number,
    doisingErrorPercent: number,
    doisingKorr: number,
    id: number,
    idProduct: number
    loopNumber: number,
    vLoop: string,
    weightFactLoop: string,
    weightFactM3: number,
    weightRecipeLoop: number,
    weiRecipeM3: number
}

export interface IReports {
    calculate: ICalculate[];
    product: IProductReports[];
    records: IRecords
    totalVProduct: number,
    totalVProductExpected: number

    reportCurrentLoopByLoop?: any;      // или нормальный тип
    reportCurrentLoopByLoopSum?: any;
}