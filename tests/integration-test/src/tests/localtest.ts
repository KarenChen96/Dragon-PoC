import { suite, timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { AxiosInstance } from 'axios';
import { createHttpClient } from '../util';
import { ICatalogService, IProjectEEQuery } from './data/catalog_service';

const SERVICE = 'CatalogService';
const serviceURL = `/odata/v2/${SERVICE}`;
const TIMEOUT = 60 * 1000;

@suite(timeout(TIMEOUT))
export class MochaTrialTest {
  private httpClient!: AxiosInstance;

  @timeout(TIMEOUT)
  async before() {
    this.httpClient = await createHttpClient(TIMEOUT, appURI => `https://${appURI}/${serviceURL}/`);
  }

  @test
  async baseURLConnectivity() {
    const res = await this.httpClient.request<any>({ url: '/' });
    assert.equal(
      res.status,
      200,
      `/ reported ${res.status} (${res.statusText})`,
    );
  }

  @test('remote entities exposed by service')
  async baseServiceEntities() {
    const res = await this.httpClient.get<ICatalogService>('/');
    const entities = ['ProjectEE', 'ProjectElementEE'];
    assert.equal(
      res.status,
      200,
      `${SERVICE} reported ${res.status} (${res.statusText})`,
    );
    entities.forEach(v => {
      assert.include(
        res.data.d.EntitySets,
        v,
        `${SERVICE} reported entities: ${res.data.d.EntitySets}`,
      );
    });
  }

  @test('get Enterprise Project')
  async getProjectEE() {
    const res = await this.httpClient.get<IProjectEEQuery>('/ProjectEE');
    const props = ['ProjectUUID', 'to_EnterpriseProjectElement'];
    assert.isArray(res.data.d.results);
    assert.equal(25, res.data.d.results.length);
    assert.containsAllKeys(res.data.d.results[0], props);
  }
}
