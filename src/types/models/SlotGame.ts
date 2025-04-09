/**
 * 水果机 抽奖按钮 前后端数据格式 接口
 * */
export interface SpinResponse {
    result: string[];
    win: boolean;
    reward: number;
}
// 接口数据格式
export interface ApiResponse<T> {
    code: number;
    msg: string;
    data: T;
}