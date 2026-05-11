export interface IOrder {
    id: number,
    idCustomer: number,
    number: number,
    dispatcher: string,
    dateCreate: string,
    classRecipe: string,
    nameRecipe: string,
    vOrder: number,
    state: number,
    adress: string,
    dateFinish: string,
    dateStart: string,
    interval: number,
    fromObjrct: number,
    toObjrct: number,
    idPlant: number,
    ttnVProductSum: number
    ttnVProductSumCreated: number
}

export interface IOrderState {
    id: string,
    date: string,
    state: string,
}