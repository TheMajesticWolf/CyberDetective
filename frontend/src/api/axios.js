import axios from 'axios'


const axiosInstance = axios.create({
    baseURL: 'http://localhost:6969',
    withCredentials: true
})

export const axiosLoginInstance = axios.create({
    baseURL: 'http://localhost:6969',
    withCredentials: true
})

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error?.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshedResponse = await axiosInstance.post('/api/auth/refresh');
                if (refreshedResponse.status === 200) {
                    return axiosInstance(originalRequest);
                }
            } 
			
			catch (refreshError) {
                return refreshError?.response;
            }
        }

        return error?.response;
    }
);



export default axiosInstance