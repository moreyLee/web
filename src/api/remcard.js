import service from "@/utils/request";

export const getCardInfo = (data) => {
    return service({
        url: '/gamble/searchById',
        method: 'get',
        data
    })
}
export const getAllData = () => {
    return service({
        url: '/gamble/getAllData',
        method: 'get',
    })
}
//  庄赢 插入记录
export const insertRecord = (data) => {
    return service({
        url: '/sysRecord/houseWins',
        method: 'post',
        data
    })
}
// 显示小表数据
export const getSmallData = (data) => {
    return service({
        url: '/gamble/getSmallData',
        method: 'get',
    })
}