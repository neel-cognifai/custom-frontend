export interface IStatus {
    loading: "idle" | "pending" | "fulfilled" | "rejected";
  }
  
  export interface TenantData extends IStatus {
    tenant: [];
    getTenant : IGetTenant;
    TotalTenant: Number;
  }
  
  export interface ITenants {
    id?: string;
    name: string;
    description: string;
    is_active: boolean;
  }

  export interface IEditTenants {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
  }

  export interface IEditTenantDetail {
    id: string;
    description: string;
    is_active: boolean;
  }
  
  export interface IGetTenant {
      id: string,
      name: string,
      description: string,
      is_active: boolean,
      created_on: string,
      modified_on: string
  }
  
  
  export interface IAddTenant {
    name: string,
    description:string,
    tenant_id: string,
    team_type: string,
    task_assignment: string,
    is_active: boolean
  }

  export interface ICreateTenant {
    user_id: string,
    tenant_id?: string,
    is_active: boolean
  }
  
  export interface TenantPayload {
    id: string
  }