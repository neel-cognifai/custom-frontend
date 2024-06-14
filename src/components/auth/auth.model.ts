export interface IStatus {
  status: "idle" | "loading" | "failed" | "fulfilled" | "pending" | "rejected";
}
export interface IUserInfo {
  _id: string;
  name: string;
  email: string;
  number: string;
  created_at: string;
}
export interface IAuthuser extends IStatus {
  isUserLoggedIn: boolean;
  userStatus: string;
  userInfo: IUserInfo;
}
export interface ILoginPayload {
  email: string;
  password: string;
}


export interface IEmailSenderPayload {
  email: string;
}

export interface IE2bR2Payload {
  patient: string;
  gender: string;
  age:string;
  Unit: string;
  Group: string;
}

export interface ISignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface ISetting {
  name: string;
  email: string;
  password:string;
  confirm_password:string;
  select_role: string;
  select_tenant: string,
}

export interface IEditUser {
  name: string;
  email: string;
  password:string;
  confirm_password:string;
  select_role: string;
  select_tenant: string,
}

export interface ITeam {
  team_name: string;
  description: string;
  select_tenant: string;
  selectedTeamType: string;
  teamStatus: boolean;
  selectedTeamAssignType: string;
}

export interface IUpdatePassword {
  id?: string,
  name?: string,
  email?: string,
  password?: string
}

export interface IResetPassword {
  token: string,
  password: string
}