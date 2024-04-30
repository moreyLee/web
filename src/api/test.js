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