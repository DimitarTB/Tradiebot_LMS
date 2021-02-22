
// export const API_URL = "http://192.168.0.114:5000/"
export const API_URL = "http://127.0.0.1:5000/"
export const FILES_URL = "http://localhost:88/"
export const statuses = {
    pending: "pending",
    fulfilled: "fulfilled",
    rejected: "rejected",
    idle: "idle"
}
export const getFileName = function (url) {
    url = url.split('\\').pop().split('/').pop();
    url = url.split('_')
    if (url.length !== 1) url.shift()
    url = url.join()
    return url
}