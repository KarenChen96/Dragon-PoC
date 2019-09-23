using my.bookshop from '../db/data-model';
using CPD_SC_EXTERNAL_SERVICES_SRV as cpr from '../srv/external/csn/CommercialProjectRead';
using CPD.SC_PROJ_ENGMT_CREATE_UPD_SRV as cp from '../srv/external/csn/CommercialProjectCreateUpdate';

service emcdemo{
  entity Books as projection on bookshop.Books;
  entity Authors as projection on bookshop.Authors;
  entity Orders as projection on bookshop.Orders;
  
  entity ProjectsRead as projection on cpr.Project;
  
}