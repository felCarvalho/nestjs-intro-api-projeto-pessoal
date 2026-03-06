/*export type ICredentials = {
  identifier: string;
  provide: string;
  user: IUser;
  deleterAt: string;
  updatedAt: string;
  createdAt: string;
};*/

export type IUser = {
  id: string;
  name: string;
  createAt: string;
  deleteAt: string | null;
  updateAt: string;
};

export type IPassHash = {
  id: string;
  hash: string;
  user: IUser;
  createAt: string;
  deleteAt: string | null;
  updateAt: string;
};

export type ICredentials = {
  id: string;
  identifier: string;
  provider: string;
  user: IUser;
  createAt: string;
  deleteAt: string | null;
  updateAt: string;
};

export type IRoles = {
  name: string;
  slug: string;
  createAt: string;
  deleteAt: string | null;
  updateAt: string;
};

export type IPermissions = {
  name: string;
  slug: string;
  createAt: string;
  deleteAt: string | null;
  updateAt: string;
};

export type IUserRoles = {
  user: IUser;
  role: IRoles;
  createAt: string;
  deleteAt: string | null;
  updateAt: string;
};

export type ICategory = {
  id: string;
  title: string;
  description: string;
  user: IUser;
  createAt: string;
  deleteAt: string | null;
  updateAt: string;
};
