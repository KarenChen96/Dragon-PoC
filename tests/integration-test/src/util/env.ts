import { existsSync, readFileSync } from 'fs';

export const enum CF_ENV_NAME {
  LANDSCAPE = 'API_INTEGRATION_TESTS_LANDSCAPE',
  SPACE_GUID = 'API_INTEGRATION_TESTS_SPACE_GUID',
  APP_NAME = 'API_INTEGRATION_TESTS_APP_NAME',
  CF_USER = 'API_INTEGRATION_TESTS_CF_USER',
  CF_PASSWORD = 'API_INTEGRATION_TESTS_CF_PASSWORD',
}

export class CFEnv {
  private readonly envVars!: NodeJS.ProcessEnv;

  private constructor(envVars: NodeJS.ProcessEnv) {
    this.envVars = envVars;
  }

  static CFEnvFactory(envFileName = 'default-env.json') {
    return new CFEnv(CFEnv.getEnvVariables(envFileName));
  }

  private static getEnvVariables(envFileName: string) {
    let envFileJson: NodeJS.ProcessEnv = {};
    if (existsSync(envFileName)) {
      envFileJson = JSON.parse(readFileSync(envFileName, 'utf-8'));
    }
    return Object.assign({}, envFileJson, process.env);
  }

  getCFEnvVar(varName: CF_ENV_NAME) {
    const res = this.envVars[varName];
    if (res == null) throw TypeError(`Environment variable ${varName} not defined.`);
    return res;
  }
}
