import service from "@/utils/request";
/**
 * 包网测试环境
 * */
export const bwTestEnv = () => {
    return service({
        url: '/test/bwTestEnv',  //  后端接口  提供的路由
        method: 'post'
    })
}