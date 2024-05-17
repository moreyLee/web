import service from "@/utils/request";

/**
 * 域名管理
 * */
export const testT = () => {
    return service({
        url: '/test/testT',
        method: 'post'
    })
}
export const DomainTest = () => {
    return service({
        url: '/domain/test',
        method: 'post'
    })
}
/**
 * CF平台 创建域名
 * */
export const domain = (data) => {
    return service({
        url: '/domain/create',
        method: 'post',
        data
    })
}

/**
 * 修改DNS 记录 114.114.114.114
 * */
export const DnsRecord = (zoneId,data) => {
    return service({
        url: `/domain/operaDns/${zoneId}`,
        method: 'post',
        data
    })
}
//   添加页面规则
export const pageRule = (zoneId,data) => {
    return service({
        url: `/domain/pageRule/${zoneId}`,
        method: 'post',
        data
    })
}