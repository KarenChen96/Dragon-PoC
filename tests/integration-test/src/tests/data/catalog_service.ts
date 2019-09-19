export interface ICatalogService {
  d: {
    EntitySets: String[];
  };
}

export interface IProjectEEQuery {
  d: {
    results: IProjectEE[];
  }
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
