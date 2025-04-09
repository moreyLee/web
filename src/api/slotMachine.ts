import service from "@/utils/request";

/**
 * 水果机 旋转接口
 * */
export const slotSpin = (bet:any):Promise<any> => {
    return service({
        url: '/slot/spin',  //  后端接口  提供的路由
        method: 'post',
        data: bet
    })
}