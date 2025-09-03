import { useAuthStore } from '@/modules/auth/store/authStore'
import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: false
})

export const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: false
})

axiosInstance.interceptors.request.use(
    (config) => {
        const authState = useAuthStore.getState()

        console.log(authState.accessToken, "authState.accessToken");
        
        if (authState?.accessToken) {
            config.headers.Authorization = `Bearer ${authState.accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

let isRefreshing = false
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = []

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })

    failedQueue = []
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Обработка 429 ошибки (Rate Limit)
        if (error.response?.status === 429) {
            return Promise.reject(error)
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token
                        return axiosInstance(originalRequest)
                    })
                    .catch(err => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const authState = useAuthStore.getState()
                if (!authState?.refreshToken) {
                    useAuthStore.getState().clearUser()
                    return Promise.reject(error)
                }

                const { data } = await axiosPublic.post('/auth/admin/refresh', {
                    refreshToken: authState.refreshToken
                })

                const { accessToken, refreshToken } = data
                useAuthStore.getState().setAccessToken(accessToken)
                useAuthStore.getState().setRefreshToken(refreshToken)

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

                processQueue(null, accessToken)
                return axiosInstance(originalRequest)
            } catch (refreshError: unknown) {
                processQueue(refreshError as Error, null)
                useAuthStore.getState().clearUser()
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)
