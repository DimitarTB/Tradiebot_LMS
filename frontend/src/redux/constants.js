
// export const API_URL = "http://46.101.200.138:90/"
// export const FILES_URL = "http://46.101.200.138:90/"
// export const API_URL = "http://localhost:5000/"
// export const FILES_URL = "http://localhost:88/"
export const API_URL = "http://192.168.0.114:5000/"
export const FILES_URL = "http://192.168.0.114:88/"
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