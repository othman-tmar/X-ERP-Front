import Api from "../axios/Api";
const PREVENTIVEPLANIF_API = "/preventivesplanifications"
export const fetchPreventivePlanifs = async () => {
    return await Api.get(PREVENTIVEPLANIF_API);
}
export const fetchPreventivePlanifsByDate = async () => {
    return await Api.get(PREVENTIVEPLANIF_API+'/filteredPreventivePlanifiedByDate');
}
export const fetchPreventivePlanifById = async (preventiveId) => {
    return await Api.get(PREVENTIVEPLANIF_API + '/' + preventiveId);
}
export const deletePreventivePlanif = async (preventiveId) => {
    return await Api.delete(PREVENTIVEPLANIF_API + '/' + preventiveId);
}
export const addPreventivePlanif = async (preventive) => {
    return await Api.post(PREVENTIVEPLANIF_API, preventive);
}
export const editPreventivePlanif = (preventive) => {
    return Api.put(PREVENTIVEPLANIF_API + '/' + preventive._id, preventive);
}
/* export const fetchPreventiveplanifPagServ = async (page, pageSize) => {
    //http://localhost:4000/api/preventives/productspage?page=2&pagesize=2
    let url= PREVENTIVEPLANIF_API + `/productspage?page=${page}&pagesize=${pageSize}`
    return await Api.get(url);
} */