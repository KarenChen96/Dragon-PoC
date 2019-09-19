import Axios, { AxiosInstance } from 'axios';
import { CF } from './cf';
import { CFEnv } from './env';

let httpClient: AxiosInstance;
export async function createHttpClient(timeout: number, urlTransform: (url: string) => string) {
  if (httpClient == null) {
    const cf = new CF(CFEnv.CFEnvFactory('default-env.json'));
    const appRoute = await cf.getAppRoute(await cf.getAccessToken());
    httpClient = Axios.create({
      baseURL: urlTransform(appRoute),
      timeout,
    });
  }
  return httpClient;
}
