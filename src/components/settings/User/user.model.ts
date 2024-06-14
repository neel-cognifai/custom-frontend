export interface IStatus {
  loading: "idle" | "pending" | "fulfilled" | "rejected";
}

export interface User extends IStatus {
  UserMember: [];
  teamData: [],
  roleData: [],
  getUser: IUserList
  TotalUser: Number;
  teamUser: TeamUser[];
  getRoleByIdDetails: GetRoleByIdData[];
  getTenantByID: IUserTenantByID[]
}

export interface IAddUserData {
  name: string;
  email: string;
  password: string;
  is_active: boolean;
}

export interface IUserList {
  id: any;
  name: string;
  email: string;
  is_active: boolean;
  created_on: string;
  modified_on: string;
  team_name?: string;
}

export interface TeamUser {
  id: string;
  user_id: string;
  team_id: string;
  email: string;
  user_name: string;
  team_name: string;
  team_type: string;
  task_assignment: string;
  percentage_load: number;
  is_active: boolean;
  is_team_active: boolean;
  is_user_active: boolean;
  created_on: string;
  modified_on: string;
}

export interface IRoleList {
  id: string;
  name: string;
  description: string;
  access_level: Number;
  is_active: boolean;
  created_on: string;
  modified_on: string;
}

export interface ICreateRole {
  user_id: string;
  role_id?: string;
  is_active: boolean;
}

export interface ICreateTenant {
  user_id: string;
  tenant_id?: string;
  is_active: boolean;
}

export interface User {
  percentage_load: number;
  user_id: string;
}

export interface UserPayload {
  id: string
}

export interface GetRoleByIdData {
      id: string,
      user_id: string,
      role_id: string,
      role_name: string,
      user_name: string,
      email: string,
      is_active: boolean,
      is_role_active: boolean,
      is_user_active: boolean,
      access_level: 0
}

export interface IUserTenantByID {
  id: string;
  user_id: string;
  tenant_id: string;
  email: string;
  user_name: string;
  tenant_name: string;
  is_active: boolean;
  is_tenant_active: boolean;
  is_user_active: boolean;
  created_on: string;
  modified_on: string;
}