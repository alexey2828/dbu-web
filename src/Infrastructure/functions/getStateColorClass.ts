export const getOrderStateColor = (state: number | undefined) => {
    switch (state) {
        case 0:
            return 'bg-[#EBEBEB] text-black'; // горчичный - в очереди
        case 1:
            return 'bg-[#CFFFDF] text-black'; // светло-зеленый - в работе
        case 2:
            return 'bg-[#FEFFCF] text-black'; // светло-желтый - пауза
        case 3:
            return 'bg-[#FFE6B7] text-black'; // светло-серый - выполнен
        case 4:
            return 'bg-[#FFCFCF] text-black'; // светло-красный - удален
    }
};

export const getTtnStateColor = (state: number | undefined) => {
    switch (state) {
        case 0:
            return 'bg-green-200 #11ff2b text-black'; // зеленый - отправлено в производство
        case 1:
            return 'bg-[#CFFFDF] text-black'; // светло-зеленый - получено АРМ БСУ
        case 2:
            return 'bg-[#EBEBEB] text-black'; // светло-серый - в очереди
        case 3:
            return 'bg-[#FFE6B7] text-black'; // светло-оранжевый - выполнен
        case 4:
            return 'bg-[#F0B7FF] text-black'; // светло-фиолетовый - в производстве
        case 5:
            return 'bg-[#B7E1FF] text-black'; // светло-голубой - выполнена
        case 6:
            return 'bg-[#ebebeb] text-black'; // светло-серый - удалена
        case 8:
            return 'bg-[#FFEBB7] text-black'; // светло-желтый - коррекция
        case 14:
            return 'bg-[#ddeaee] text-black'; // светло-синий - выполнена, отчет отправлен
        case 15:
            return 'bg-[#E7CFFF] text-black'; // светло-фиолетовый - отчет сохранен
        case 21:
            return 'bg-white text-black'; // белый - создана
        case 22:
            return 'bg-[#D2FFCF] text-black'; // светло-зеленый - доставлена БС на объект
        case 23:
            return 'bg-[#CFF2FF] text-black'; // светло-голубой - выгружена БС на объекте

    }
}