import service from "@/utils/request";

export const getAppList = (data) => {
    return service({
        url: "/qingstor/dirList",
        method: "get",
        data,
    });
}