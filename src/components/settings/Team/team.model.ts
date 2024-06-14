import { IUserTenantByID } from "../User/user.model";

export interface IStatus {
  loading: "idle" | "pending" | "fulfilled" | "rejected";
}

export interface ITenant {
  customer_name: string;
  description: string;
}

export interface ITeam extends IStatus {
  teamData: Team[];
  teamDataById: {
  };
  teamTotal: Number;
  getTenantByID: IUserTenantByID[]
}

export interface ITenants {
  id?: string;
  name: string;
  description: string;
  is_active: boolean;
}


export interface YourTeamType {
    team_name: string;
    description: string;
    teamStatus: boolean;
    select_tenant: string;
    selectedMembers: { email: string; percentage: number }[];
    selectedTeamAssignType: string;
    selectedTeamType: string;
}

export interface IAddTenant {
  name: string,
  description:string,
  tenant_id: string,
  team_type: string,
  task_assignment: string,
  is_active: boolean
}

export interface Team {
  id: string
  name: string,
  description:string,
  tenant_id: string,
  team_type: string,
  task_assignment: string,
  is_active: boolean
}

export interface IEditTeam {
  id: string
  name: string,
  description:string,
  tenant_id: string,
  team_type: string,
  task_assignment: string,
  is_active: boolean
}


export interface TeamById {
  id: string;
  name: string;
  description: string;
  tenant_id: string;
  team_type: string;
  task_assignment: string;
  is_active: boolean;
  created_on: string;
  modified_on: string;
}

export interface User {
  percentage_load?: number;
  user_id: string;
}

export interface TeamData {
  team_id: string;
  users: User[];
}

export interface TeamPayload {
  id: string
}