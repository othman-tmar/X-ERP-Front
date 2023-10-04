import Api from '../axios/Api';
const USER_API = "/employees"


export const signup = async (user) => {
    return await Api.post(USER_API + "/register", user);
}


export const signin = async (user) => {
    return await Api.post(USER_API + "/login", user);
}