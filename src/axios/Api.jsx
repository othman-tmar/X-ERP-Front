import axios from "axios";

axios.defaults.baseURL = 'https://erp-back.onrender.com';


export function getAxiosInstance() {
    if (axios === null) {
        axios = axios.create({
            baseURL: axios.defaults.baseURL,
        });
    }
}


axios.interceptors.request.use(

    config => {
        const token = localStorage.getItem("CC_Token");
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });

//Response interceptor
axios.interceptors.response.use((response) => {
    return response
},
    function (error) {
        const originalRequest = error.config;
        if (error.response.status === 403 && !originalRequest._retry) {

            originalRequest._retry = true;
            let refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken && refreshToken !== "") {
                return axios
                    .post(axios.defaults.baseURL+'/employees/refreshToken/', { refreshToken: refreshToken })
                    .then(res => {

                        if (res.status === 200) {
                            // 1) put tokens to LocalStorage
                            localStorage.setItem('CC_Token', res.data.token);
                            localStorage.setItem('refresh_token', res.data.refreshToken);
                            // 2) Change Authorization header
                            axios.defaults.headers.common['Authorization'] = 'Bearer ' +

                                localStorage.getItem('CC_Token');

                            // 3) return originalRequest object with Axios.
                            return axios(originalRequest);
                        }
                    })
            }
        }
    }
);
export default axios;
