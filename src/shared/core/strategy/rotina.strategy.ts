import { type Rule } from '@felipe-lib/schema-local';
import { isRequired, maxLength, isInEnum } from '../validators';

export interface CreateRotinaProps {
  titleTask: string;
  descriptionTask?: string;
  titleCategory: string;
  descriptionCategory?: string;
  status?: string;
}

export const rotinaRules: Rule<CreateRotinaProps>[] = [
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
    key: 'titleTask',
    error: 'Título da tarefa é obrigatório',
    description: 'Verifica se o título foi fornecido',
    runValidate: (data) => isRequired(data.titleTask),
  },
  {
    key: 'titleTask',
    error: 'Título da tarefa não pode exceder 255 caracteres',
    description: 'Valida o tamanho máximo do título',
    runValidate: (data) => maxLength(data.titleTask, 255),
  },
  {
    key: 'descriptionTask',
    error: 'Descrição não pode exceder 255 caracteres',
    description: 'Valida o tamanho máximo da descrição',
    runValidate: (data) => maxLength(data.descriptionTask, 255),
  },
  {
    key: 'status',
    error: 'Status inválido',
    description: 'Valida se o status é válido',
    runValidate: (data) => isInEnum(data.status, ['ativa', 'inativa']),
  },
];
