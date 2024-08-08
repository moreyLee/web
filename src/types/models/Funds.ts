//  定义小表数据接口类型  资金表数据接口
import Decimal from "decimal.js";

export interface Funds {
    stake: Decimal  // 本金
    net_capital: Decimal   // 净本金
}