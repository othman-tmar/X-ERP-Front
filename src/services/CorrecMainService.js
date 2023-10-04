import Api from "../axios/Api";
const CORRECTIVE_API = "/correctives"
export const fetchCorrectives = async () => {
    return await Api.get(CORRECTIVE_API);
}
export const fetchCorrectiveById = async (correctiveId) => {
    return await Api.get(CORRECTIVE_API + '/' + correctiveId);
}
export const deleteCorrective = async (correctiveId) => {
    return await Api.delete(CORRECTIVE_API + '/' + correctiveId);
}
export const addCorrective = async (corrective) => {
    return await Api.post(CORRECTIVE_API, corrective);
}
export const editCorrective = (corrective) => {
    return Api.put(CORRECTIVE_API + '/' + corrective._id, corrective);
}
export const fetchCorrectivePagServ = async (page, pageSize) => {
    //http://localhost:4000/api/correctives/productspage?page=2&pagesize=2
    let url= CORRECTIVE_API + `/productspage?page=${page}&pagesize=${pageSize}`
    return await Api.get(url);
}