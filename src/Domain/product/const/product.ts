export interface IProductForReports {
    id: number,
    dateStart: string,
    timeEnd: string,
    vProduct: number,
    loopNumber: number,
    vLoop: number,
    driver: string,
    car: string,
    classRecipe: string,
    nameRecipe: string,
    recipe: string,
    idTtn: number,
    timeStart: string
}

export interface IProduct {
    id: number,
    dateStart: string,
    timeEnd: string,
    vProduct: number,
    loopNumber: number,
    vLoop: number,
    driver: string,
    car: string,
    nameRecipe: string,
    recipe: string,
    idTtn: number,
    timeStart: string
}