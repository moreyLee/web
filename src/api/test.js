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
export const domain = (data) => {
    return service({
        url: '/test/domain',
        method: 'post',
        data
    })
}
export const domainRecord = (path,data) => {
    return service({
        url: `https://api.cloudflare.com/client/v4/zones/${path}/dns_records`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Email': 'djpt36@163.com',
            'X-Auth-Key': '0237bd44ec3b541e622d6aa1b187aac9193f0'
        },
        data
    })
}