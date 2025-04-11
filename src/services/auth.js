import axios from 'axios'  

// 设置Axios的基础URL  
axios.defaults.baseURL = 'http://localhost:3000' // 将your_backend_url替换为你的后端地址  

// 设置请求拦截器，添加token  
axios.interceptors.request.use(  
  async (config) => {  
    const token = localStorage.getItem('token')  
    if (token) {  
      config.headers.Authorization = `Bearer ${token}`  
    }  
    return config  
  },  
  (error) => {  
    return Promise.reject(error)  
  }  
)  

// 设置响应拦截器，处理错误  
axios.interceptors.response.use(  
  (response) => {  
    return response.data  
  },  
  (error) => {  
    if (error.response) {  
      // 处理服务端返回的错误状态  
      const errorMessage = error.response.data.message || error.response.statusText  
      return Promise.reject(errorMessage)  
    } else if (error.request) {  
      // 处理无响应的错误  
      return Promise.reject('请求超时，请检查网络连接')  
    } else {  
      return Promise.reject(error.message)  
    }  
  }  
)  

export const login = async (credentials) => {  
  try {  
    const response = await axios.post('/auth/login', credentials)  
    // 将token存储到本地存储  
    if (response.token) {  
      localStorage.setItem('token', response.token)  
    }  
    return response  
  } catch (error) {  
    return Promise.reject(error)  
  }  
}  

export const register = async (userData) => {  
  try {  
    const response = await axios.post('/auth/register', userData)  
    // 将token存储到本地存储  
    if (response.token) {  
      localStorage.setItem('token', response.token)  
    }  
    return response  
  } catch (error) {  
    return Promise.reject(error)  
  }  
}  

export const logout = async () => {  
  try {  
    const token = localStorage.getItem('token')  
    if (token) {  
      await axios.post('/auth/logout', { token: token })  
      localStorage.removeItem('token')  
    }  
  } catch (error) {  
    return Promise.reject(error)  
  }  
}  