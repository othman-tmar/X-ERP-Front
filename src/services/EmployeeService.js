import Api from "../axios/Api";
const EMPLOYEE_API = "/employees"
export const fetchEmployees = async () => {
    return await Api.get(EMPLOYEE_API);
}
export const fetchEmployeeById = async (employeeId) => {
    return await Api.get(EMPLOYEE_API + '/' + employeeId);
}
export const deleteEmployee = async (employeeId) => {
    return await Api.delete(EMPLOYEE_API + '/' + employeeId);
}
export const addEmployee = async (employee) => {
    return await Api.post(EMPLOYEE_API+'/register', employee);
}
export const editEmployee = (employee) => {
    return Api.put(EMPLOYEE_API + '/' + employee._id, employee);
}
export const fetchEmployeePagServ = async (page, pageSize) => {
    //http://localhost:4000/api/employees/productspage?page=2&pagesize=2
    let url= EMPLOYEE_API + `/productspage?page=${page}&pagesize=${pageSize}`
    return await Api.get(url);
}