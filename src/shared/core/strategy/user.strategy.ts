import { type Rule } from '@felipe-lib/schema-local';
import { isRequired, maxLength, minLength, isEmail, matches } from '../validators';

export interface UserNameProps {
  name: string;
  nameAlreadyExists: boolean;
}

export const userNameRules: Rule<UserNameProps>[] = [
  {
    key: 'name',
    error: 'Nome é obrigatório',
    description: 'Verifica se o nome foi fornecido',
    runValidate: (data) => isRequired(data.name),
  },
  {
    key: 'name',
    error: 'Nome deve ter no mínimo 8 caracteres',
    description: 'Valida o tamanho mínimo do nome',
    runValidate: (data) => minLength(data.name, 8),
  },
  {
    key: 'name',
    error: 'Nome deve ter no máximo 150 caracteres',
    description: 'Valida o tamanho máximo do nome',
    runValidate: (data) => maxLength(data.name, 150),
  },
  {
    key: 'name',
    error: 'Ops! já existe um usuário com esse nome',
    description: 'Verifica se o nome já existe',
    runValidate: (data) => !data.nameAlreadyExists,
  },
];

export interface CreateUserProps {
  name: string;
  identifier: string;
  password: string;
  passwordConfirm: string;
}

export const userRules: Rule<CreateUserProps>[] = [
  {
    key: 'name',
    error: 'Nome é obrigatório',
    description: 'Verifica se o nome foi fornecido',
    runValidate: (data) => isRequired(data.name),
  },
  {
    key: 'name',
    error: 'Nome deve ter no mínimo 8 caracteres',
    description: 'Valida o tamanho mínimo do nome',
    runValidate: (data) => minLength(data.name, 8),
  },
  {
    key: 'name',
    error: 'Nome deve ter no máximo 150 caracteres',
    description: 'Valida o tamanho máximo do nome',
    runValidate: (data) => maxLength(data.name, 150),
  },
  {
    key: 'identifier',
    error: 'Email é obrigatório',
    description: 'Verifica se o email foi fornecido',
    runValidate: (data) => isRequired(data.identifier),
  },
  {
    key: 'identifier',
    error: 'Email inválido',
    description: 'Valida formato do email',
    runValidate: (data) => isEmail(data.identifier),
  },
  {
    key: 'identifier',
    error: 'Email deve ter no máximo 150 caracteres',
    description: 'Valida o tamanho máximo do email',
    runValidate: (data) => maxLength(data.identifier, 150),
  },
  {
    key: 'password',
    error: 'Senha é obrigatória',
    description: 'Verifica se a senha foi fornecida',
    runValidate: (data) => isRequired(data.password),
  },
  {
    key: 'password',
    error: 'Senha deve ter no mínimo 8 caracteres',
    description: 'Valida o tamanho mínimo da senha',
    runValidate: (data) => minLength(data.password, 8),
  },
  {
    key: 'password',
    error: 'Senha deve ter no máximo 150 caracteres',
    description: 'Valida o tamanho máximo da senha',
    runValidate: (data) => maxLength(data.password, 150),
  },
  {
    key: 'passwordConfirm',
    error: 'Confirmação de senha é obrigatória',
    description: 'Verifica se a confirmação de senha foi fornecida',
    runValidate: (data) => isRequired(data.passwordConfirm),
  },
  {
    key: 'passwordConfirm',
    error: 'Senhas não conferem',
    description: 'Confirmação de senha deve ser igual à senha',
    runValidate: (data) => matches(data.passwordConfirm, data.password),
  },
];

export interface LoginProps {
  identifier: string;
  password: string;
}

export const loginRules: Rule<LoginProps>[] = [
  {
    key: 'identifier',
    error: 'Email é obrigatório',
    description: 'Verifica se o email foi fornecido',
    runValidate: (data) => isRequired(data.identifier),
  },
  {
    key: 'identifier',
    error: 'Email inválido',
    description: 'Valida formato do email',
    runValidate: (data) => isEmail(data.identifier),
  },
  {
    key: 'password',
    error: 'Senha é obrigatória',
    description: 'Verifica se a senha foi fornecida',
    runValidate: (data) => isRequired(data.password),
  },
];
