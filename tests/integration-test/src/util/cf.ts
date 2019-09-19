import Axios from 'axios';
import querystring from 'querystring';
import { CFEnv, CF_ENV_NAME } from './env';

// interface ITokenResponse {
//   access_token: string;
// }

interface IApp {
  entity: { name: string };
  metadata: {
    guid: string;
  };
}

interface IAppResponse {
  resources: IApp[];
}

interface IAppEnv {
  application_env_json?: {
    VCAP_APPLICATION?: {
      uris?: string[]
    },
    VCAP_SERVICES?: {
      xsuaa?: {
        credentials?: {
          url?: string
        }
      }[]
    }
  }
}

export class CF {
  private readonly landscape: string;

  private readonly appName: string;

  private readonly cfUser: string;

  private readonly cfPwd: string;

  private readonly spaceGUID: string;

  constructor(cfEnv: CFEnv) {
    this.landscape = cfEnv.getCFEnvVar(CF_ENV_NAME.LANDSCAPE);
    this.appName = cfEnv.getCFEnvVar(CF_ENV_NAME.APP_NAME);
    this.cfUser = cfEnv.getCFEnvVar(CF_ENV_NAME.CF_USER);
    this.cfPwd = cfEnv.getCFEnvVar(CF_ENV_NAME.CF_PASSWORD);
    this.spaceGUID = cfEnv.getCFEnvVar(CF_ENV_NAME.SPACE_GUID);
  }

  async getAccessToken() {
    const tokenRes = await Axios.request<{ access_token: string }>({
      method: 'POST',
      url: `https://login.cf.${this.landscape}.hana.ondemand.com/oauth/token`,
      headers: {
        Authorization: 'Basic Y2Y6',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: querystring.stringify({
        grant_type: 'password',
        username: this.cfUser,
        password: this.cfPwd,
      }),
    });
    return tokenRes.data.access_token;
  }

  async getApps(cfAccessToken: string) {
    const appRes = await Axios.request<IAppResponse>({
      method: 'GET',
      url: `https://api.cf.${this.landscape}.hana.ondemand.com/v2/apps?q=space_guid:${this.spaceGUID}`,
      headers: {
        Authorization: `Bearer ${cfAccessToken}`,
      },
    });
    return appRes.data.resources;
  }

  async getAppEnv(cfAccessToken: string, appGUID: string) {
    const envRes = await Axios.request<IAppEnv>({
      method: 'GET',
      url: `https://api.cf.${this.landscape}.hana.ondemand.com/v2/apps/${appGUID}/env`,
      headers: {
        Authorization: `Bearer ${cfAccessToken}`,
      },
    });

    return envRes.data;
  }

  async getAppRoute(cfAccessToken: string) {
    const apps = await this.getApps(cfAccessToken);
    const matchedApps = apps.filter(app => RegExp(String.raw`^${this.appName}(?:-green|-blue)?$`).test(app.entity.name));
    const guids = matchedApps.map(app => app.metadata.guid);
    const envPromise = guids.map(guid => this.getAppEnv(cfAccessToken, guid));
    for await (const env of envPromise) {
      try {
        const uriNonIdle = env.application_env_json!.VCAP_APPLICATION!.uris!.find(uri => !uri.includes('-idle'));
        if (uriNonIdle != null) return uriNonIdle;
      } catch (e) {
        console.error(e.stack);
      }
    }
    throw new URIError(`No active URI for ${this.appName}`);
  }
}
