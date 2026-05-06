import { SchemaValidator, type Rule } from '@felipe-lib/schema-local';
import {
  categoryRules,
  categoryFieldRules,
  categoryBusinessRules,
  CreateCategoryProps,
  updateCategoryRules,
  UpdateCategoryProps,
} from './category.strategy';
import {
  taskRules,
  taskFieldRules,
  taskBusinessRules,
  CreateTaskProps,
  updateTaskRules,
  UpdateTaskProps,
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

export {
  categoryRules,
  categoryFieldRules,
  categoryBusinessRules,
  updateCategoryRules,
  taskRules,
  taskFieldRules,
  taskBusinessRules,
  updateTaskRules,
  userRules,
  loginRules,
  userNameRules,
  rotinaRules,
};

export type {
  CreateCategoryProps,
  UpdateCategoryProps,
  CreateTaskProps,
  UpdateTaskProps,
  CreateUserProps,
  LoginProps,
  UserNameProps,
  CreateRotinaProps,
};
