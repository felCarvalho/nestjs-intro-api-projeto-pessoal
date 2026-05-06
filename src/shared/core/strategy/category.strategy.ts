import { type Rule } from '@felipe-lib/schema-local';
import { isRequired, maxLength, isInEnum } from '../validators';

export interface CreateCategoryProps {
  titleCategory: string;
  descriptionCategory?: string;
  status?: string;
  titleAlreadyExists: boolean;
}

export const categoryFieldRules: Rule<CreateCategoryProps>[] = [
  {
    key: 'titleCategory',
    error: 'Título da categoria é obrigatório',
    description: 'Verifica se o título foi fornecido',
    runValidate: (data) => isRequired(data.titleCategory),
  },
  {
    key: 'titleCategory',
    error: 'Título da categoria não pode exceder 255 caracteres',
    description: 'Valida o tamanho máximo do título',
    runValidate: (data) => maxLength(data.titleCategory, 255),
  },
  {
    key: 'descriptionCategory',
    error: 'Descrição não pode exceder 255 caracteres',
    description: 'Valida o tamanho máximo da descrição',
    runValidate: (data) => maxLength(data.descriptionCategory, 255),
  },
  {
    key: 'status',
    error: 'Status inválido',
    description: 'Valida se o status é válido',
    runValidate: (data) => isInEnum(data.status, ['ativa', 'inativa']),
  },
];

export const categoryBusinessRules: Rule<CreateCategoryProps>[] = [
  {
    key: 'titleCategory',
    error: 'Ops! Titulo da sua categoria já existe',
    description: 'Verifica se o título da categoria já existe para o usuário',
    runValidate: (data) => !data.titleAlreadyExists,
  },
];

export const categoryRules: Rule<CreateCategoryProps>[] = [
  ...categoryFieldRules,
  ...categoryBusinessRules,
];

export interface UpdateCategoryProps {
  titleCategory?: string;
  descriptionCategory?: string;
  status?: string;
}

export const updateCategoryRules: Rule<UpdateCategoryProps>[] = [
  {
    key: 'titleCategory',
    error: 'Título da categoria não pode exceder 255 caracteres',
    description: 'Valida o tamanho máximo do título',
    runValidate: (data) => maxLength(data.titleCategory, 255),
  },
  {
    key: 'descriptionCategory',
    error: 'Descrição não pode exceder 255 caracteres',
    description: 'Valida o tamanho máximo da descrição',
    runValidate: (data) => maxLength(data.descriptionCategory, 255),
  },
  {
    key: 'status',
    error: 'Status inválido',
    description: 'Valida se o status é válido',
    runValidate: (data) => isInEnum(data.status, ['ativa', 'inativa']),
  },
];

export interface DeleteCategoryProps {
  id: string;
  idUser: string;
}

export const deleteCategoryRules: Rule<DeleteCategoryProps>[] = [
  {
    key: 'id',
    error: 'Ops, credenciais inválidas',
    runValidate: (data) => isRequired(data.id),
  },
  {
    key: 'idUser',
    error: 'Ops, seu usuário não foi encontrado',
    runValidate: (data) => isRequired(data.idUser),
  },
];
