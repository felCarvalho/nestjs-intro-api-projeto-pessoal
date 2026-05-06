import { SchemaValidator, type Rule } from '@felipe-lib/schema-local';
import {
  categoryRules,
  categoryFieldRules,
  categoryBusinessRules,
  CreateCategoryProps,
  updateCategoryRules,
  UpdateCategoryProps,
  deleteCategoryRules,
  DeleteCategoryProps,
} from './category.strategy';
import {
  taskRules,
  taskFieldRules,
  taskBusinessRules,
  CreateTaskProps,
  updateTaskRules,
  UpdateTaskProps,
  deleteTaskRules,
  findTaskRules,
  searchTaskRules,
  DeleteTaskProps,
  FindTaskProps,
  SearchTaskProps,
} from './task.strategy';
import {
  userRules,
  CreateUserProps,
  loginRules,
  LoginProps,
  userNameRules,
  UserNameProps,
} from './user.strategy';
import { rotinaRules, CreateRotinaProps } from './rotina.strategy';
import { NotificationContract } from '../contracts/contracts.notification';

export interface ResultSpec<T> {
  success: boolean;
  notifications: NotificationContract[];
  data: T;
}

export const mapFormNotification = (rule: {
  key: string | number | symbol;
  error: string;
}): NotificationContract => ({
  type: 'ERROR',
  key: String(rule.key),
  message: rule.error,
  code: 400,
});

const resultMappers = <T>(
  data: T,
  notifications: NotificationContract[],
): ResultSpec<T> => ({
  success: !notifications.length,
  notifications,
  data,
});

const makeValidator = <T extends object>(schema: Rule<T>[]) =>
  new SchemaValidator<T, NotificationContract, ResultSpec<T>>({
    schema,
    notificationMappers: mapFormNotification,
    resultMappers,
  });

export const categorySchemaValidator =
  makeValidator<CreateCategoryProps>(categoryRules);
export const updateCategorySchemaValidator =
  makeValidator<UpdateCategoryProps>(updateCategoryRules);
export const taskSchemaValidator = makeValidator<CreateTaskProps>(taskRules);
export const updateTaskSchemaValidator =
  makeValidator<UpdateTaskProps>(updateTaskRules);
export const userSchemaValidator = makeValidator<CreateUserProps>(userRules);
export const loginSchemaValidator = makeValidator<LoginProps>(loginRules);
export const userNameSchemaValidator =
  makeValidator<UserNameProps>(userNameRules);
export const rotinaSchemaValidator =
  makeValidator<CreateRotinaProps>(rotinaRules);
export const deleteCategorySchemaValidator =
  makeValidator<DeleteCategoryProps>(deleteCategoryRules);
export const deleteTaskSchemaValidator =
  makeValidator<DeleteTaskProps>(deleteTaskRules);
export const findTaskSchemaValidator =
  makeValidator<FindTaskProps>(findTaskRules);
export const searchTaskSchemaValidator =
  makeValidator<SearchTaskProps>(searchTaskRules);

export {
  categoryRules,
  categoryFieldRules,
  categoryBusinessRules,
  updateCategoryRules,
  deleteCategoryRules,
  taskRules,
  taskFieldRules,
  taskBusinessRules,
  updateTaskRules,
  deleteTaskRules,
  findTaskRules,
  searchTaskRules,
  userRules,
  loginRules,
  userNameRules,
  rotinaRules,
};

export type {
  CreateCategoryProps,
  UpdateCategoryProps,
  DeleteCategoryProps,
  CreateTaskProps,
  UpdateTaskProps,
  DeleteTaskProps,
  FindTaskProps,
  SearchTaskProps,
  CreateUserProps,
  LoginProps,
  UserNameProps,
  CreateRotinaProps,
};
