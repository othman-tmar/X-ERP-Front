import Api from "../axios/Api";
const MACHINE_API = "/machines"
export const fetchMachines = async () => {
    return await Api.get(MACHINE_API);
}
export const fetchMachineById = async (machineId) => {
    return await Api.get(MACHINE_API + '/' + machineId);
}
export const deleteMachine = async (machineId) => {
    return await Api.delete(MACHINE_API + '/' + machineId);
}
export const addMachine = async (machine) => {
    return await Api.post(MACHINE_API, machine);
}
export const editMachine = (machine) => {
    return Api.put(MACHINE_API + '/' + machine._id, machine);
}
export const fetchMachinePagServ = async (page, pageSize) => {
    //http://localhost:4000/api/machines/productspage?page=2&pagesize=2
    let url= MACHINE_API + `/productspage?page=${page}&pagesize=${pageSize}`
    return await Api.get(url);
}