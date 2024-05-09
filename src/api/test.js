import service from "@/utils/request";

/**
 * 测试页面
 * */
export const testT = () => {
    return service({
        url: '/test/testT',
        method: 'post'
    })
}
export const domain = (data) => {
    return service({
        url: '/test/domain',
        method: 'post',
        data
    })
}