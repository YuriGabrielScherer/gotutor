import 'moment/locale/pt-br';


export type Appointment = {

  id?: string;
  start?: any;
  end?: any;
  title?: string; //alunos
  allDay?: boolean; //nao ira ter aula
  curso?: string;
  solicitacao_aula?: boolean;
  rendering?: string; //background / tag
  dia?: string;
  local?: string;
  descricao?: string;
  backgroundColor?: string;
}
