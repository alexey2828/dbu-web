export interface IReportCurrentLoop {
    id: string,
    vLoop: number,
    loopNumber: number,
    code: string,
    dispencer: string,
    doisingError: number,
    doisingErrorPercent: number,
    doisingKorr: number,
    humidity: number,
    weightFactLoop: number,
    weightFactM3: number,
    weightRecipeLoop: number,
    weightRecipeM3: number
}