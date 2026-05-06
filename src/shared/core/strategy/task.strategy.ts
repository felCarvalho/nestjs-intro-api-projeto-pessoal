import { type Rule } from '@felipe-lib/schema-local';
import { isRequired, maxLength, isInEnum } from '../validators';

export interface CreateTaskProps {
  titleTask: string;
  descriptionTask?: string;
  status?: string;
  titleAlreadyExists: boolean;
}

export const taskFieldRules: Rule<CreateTaskProps>[] = [
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

export const taskBusinessRules: Rule<CreateTaskProps>[] = [
  {
    key: 'titleTask',
    error: 'Ops! Titulo da sua rotina já existe',
    description: 'Verifica se o título da tarefa já existe para o usuário',
    runValidate: (data) => !data.titleAlreadyExists,
  },
];

export const taskRules: Rule<CreateTaskProps>[] = [
  ...taskFieldRules,
  ...taskBusinessRules,
];

export interface UpdateTaskProps {
  titleTask?: string;
  descriptionTask?: string;
  completed?: string;
}

export const updateTaskRules: Rule<UpdateTaskProps>[] = [
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
    key: 'completed',
    error: 'Status inválido para atualização',
    description: 'Valida se o status é Concluída ou Incompleta',
    runValidate: (data) =>
      isInEnum(data.completed, ['Concluída', 'Incompleta']),
  },
];

export interface DeleteTaskProps {
  idTask: string;
  idUser: string;
}

export interface FindTaskProps {
  idUser: string;
  idTasks: string;
}

export interface SearchTaskProps {
  idUser: string;
  search: string;
}

export const deleteTaskRules: Rule<DeleteTaskProps>[] = [
  {
    key: 'idTask',
    error: 'Ops! Não conseguimos deletar sua rotina',
    runValidate: (data) => isRequired(data.idTask),
  },
  {
    key: 'idUser',
    error: 'Ops! Não conseguimos deletar sua rotina',
    runValidate: (data) => isRequired(data.idUser),
  },
];

export const findTaskRules: Rule<FindTaskProps>[] = [
  {
    key: 'idUser',
    error: 'Ops! Id do usuário inválido',
    runValidate: (data) => isRequired(data.idUser),
  },
  {
    key: 'idTasks',
    error: 'Ops! Id da tarefa inválido',
    runValidate: (data) => isRequired(data.idTasks),
  },
];

export const searchTaskRules: Rule<SearchTaskProps>[] = [
  {
    key: 'idUser',
    error: 'Ops! usuário inválido',
    runValidate: (data) => isRequired(data.idUser),
  },
  {
    key: 'search',
    error: 'Ops! não encontramos nenhuma rotina',
    runValidate: (data) => isRequired(data.search),
  },
];
