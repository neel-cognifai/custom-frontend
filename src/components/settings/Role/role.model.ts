export interface IStatus {
    loading: "idle" | "pending" | "fulfilled" | "rejected";
  }
  
  export interface RoleData extends IStatus {
    role: [];
    getRole : IGetRole;
    TotalRole: Number;
  }


  export interface IGetRole {
    id: string,
    name: string,
    description: string,
    access_level: number,
    is_active: boolean,
    created_on: string,
    modified_on: string
}

export interface RolePayload {
    id: string
}

export interface AddRolePayload {
    name: string,
    description: string,
    access_level: number,
    is_active: boolean
}

export interface IEditRole {
    id: string;
    description: string;
    access_level: number
    is_active: boolean;
  }