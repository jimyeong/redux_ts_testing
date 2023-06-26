import axios, {
  CreateAxiosDefaults,
  Axios,
  AxiosStatic,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosInterceptorManager,
  AxiosResponse,
} from "axios";

const timeout = 5000;
const baseURL = "https://www.thecocktaildb.com/";
const maxTryCount = 3;
const retryCount = 0;

// to add these attributes that are in need for error-handling process, I re-defined some types.

type AxiosErrorHandlingProp = {
  maxTryCount: number;
  retryCount: number;
};
type CustomAxiosOption = AxiosErrorHandlingProp & CreateAxiosDefaults;

type CustomInternalAxiosRequestConfig =
  InternalAxiosRequestConfig<AxiosErrorHandlingProp>;

interface CustomAxios extends AxiosStatic {
  create(config: CustomAxiosOption): AxiosInstance;

  interceptors: {
    request: AxiosInterceptorManager<CustomInternalAxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
}

axios as CustomAxios;

const httpOption: CustomAxiosOption = {
  timeout,
  baseURL,
  maxTryCount,
  retryCount,
};

const instance = axios.create(httpOption);

export const sleep = (ms: number) => {
  return new Promise((res, rej) => {
    setTimeout(res, ms);
  });
};

instance.interceptors.request.use(async (config) => {
  return config;
}, null);

// error handling code
// if you failed fetching data with network issue or something, it will re request an api call up to 3times(declared up this file) with a 2seconds interval

instance.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config) return Promise.reject(error);
  await sleep(2000);

  // specify your error cases with If phrases

  if (error.code == "ECONNABORTED") {
    if (config.retryCount < config.maxTryCount) {
      config.retryCount++;
      await instance.request(config);
    } else {
      return Promise.reject(error);
    }
    // ...
  } else {
    return Promise.reject(error);
  }

  return error;
});

export { instance as axios };
export * from "axios";
