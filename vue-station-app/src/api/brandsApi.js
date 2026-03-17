import axios from 'axios'

const apiServer = import.meta.env.VITE_BRANDS_API_BASE_URL || 'http://localhost:38798'

if (!apiServer) {
  throw new Error('VITE_BRANDS_API_BASE_URL environment variable is not set')
}

const unsecuredClient = axios.create({
  baseURL: `${apiServer}/aivox`,
  withCredentials: false,
})

unsecuredClient.interceptors.request.use(
  (config) => {
    config.headers['x-client-id'] = 'mixpla-web'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default unsecuredClient
