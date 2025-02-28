import axios, { CanceledError } from "axios";

export { CanceledError };


const apiClient = axios.create({
    baseURL: "http://localhost:3000"
});

apiClient.interceptors.request.use(
    (config) => {
      const accessToken = sessionStorage.getItem('accessToken'); 
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`; 
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const response = await axios.post(`/auth/refresh`, {refreshToken});
            const newAccessToken = response.data.accessToken;
            sessionStorage.setItem('accessToken', newAccessToken); 
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest); 
          } catch (error) {
            console.log(error)
          }
        }
      }
      return Promise.reject(error);
    }
  );

export default apiClient;