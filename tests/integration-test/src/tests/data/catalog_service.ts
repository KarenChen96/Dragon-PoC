export type ICatalogService = ODataService<keyNames.EntitySets, string[]>;

export type IProjectEEQuery = ODataService<keyNames.results, IProjectEE[]>;

const enum keyNames {
  EntitySets = 'EntitySets',
  results = 'results',
}

interface MapKeys<T> {
  [key: string]: T;
}

interface ODataService<K extends keyNames, V> {
  d: Pick<MapKeys<V>, K>;
}

export interface IProjectEE {
  __metadata: {
    id: string;
    uri: string;
    type: string;
  };
  ProjectUUID: string;
  ProjectInternalID: string;
  Project: string;
  ProjectDescription: string;
  EnterpriseProjectType: string;
  PriorityCode: string;
  ProjectStartDate: string;
  ProjectEndDate: string;
  ProcessingStatus: string;
  ResponsibleCostCenter: string;
  ProfitCenter: string;
  ProjectManagerUUID: string;
  ProjectProfileCode: string;
  FunctionalArea: string;
  CompanyCode: string;
  ControllingArea: string;
  Plant: string;
  Location: string;
  LastChangeDateTime: string;
  to_EnterpriseProjectElement: {
    __deferred: {
      uri: string;
    };
  };
}
