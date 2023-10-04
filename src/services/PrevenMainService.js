import Api from "../axios/Api";
const PREVENTIVE_API = "/preventives"
export const fetchPreventives = async () => {
    return await Api.get(PREVENTIVE_API);
}
export const fetchPreventivesByDate = async () => {
    return await Api.get(PREVENTIVE_API+'/filteredPreventiveByDate');
}
export const fetchPreventiveById = async (preventiveId) => {
    return await Api.get(PREVENTIVE_API + '/' + preventiveId);
}
export const deletePreventive = async (preventiveId) => {
    return await Api.delete(PREVENTIVE_API + '/' + preventiveId);
}
export const addPreventive = async (preventive) => {
    return await Api.post(PREVENTIVE_API, preventive);
}
export const editPreventive = (preventive) => {
    return Api.put(PREVENTIVE_API + '/' + preventive._id, preventive);
}
export const fetchPreventivePagServ = async (page, pageSize) => {
    //http://localhost:4000/api/preventives/productspage?page=2&pagesize=2
    let url= PREVENTIVE_API + `/productspage?page=${page}&pagesize=${pageSize}`
    return await Api.get(url);
}