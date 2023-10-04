import Api from "../axios/Api";
const DEPARTMENT_API = "/departments"
export const fetchDepartments = async () => {
    return await Api.get(DEPARTMENT_API);
}
export const fetchDepartmentById = async (departmentId) => {
    return await Api.get(DEPARTMENT_API + '/' + departmentId);
}
export const deleteDepartment = async (departmentId) => {
    return await Api.delete(DEPARTMENT_API + '/' + departmentId);
}
export const addDepartment = async (department) => {
    return await Api.post(DEPARTMENT_API, department);
}
export const editDepartment = (department) => {
    return Api.put(DEPARTMENT_API + '/' + department._id, department);
}
export const fetchDepartmentPagServ = async (page, pageSize) => {
    //http://localhost:4000/api/departments/productspage?page=2&pagesize=2
    let url= DEPARTMENT_API + `/productspage?page=${page}&pagesize=${pageSize}`
    return await Api.get(url);
}