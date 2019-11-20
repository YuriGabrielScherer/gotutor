import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';

// Imports
import { AlunoService } from './../../../controller/servicos_aluno/aluno.service';
import { Aluno } from './../../../model/bean_aluno/aluno';
import { Modal, toast, Collapsible, Autocomplete } from 'materialize-css';
import { AlunoProfessorService } from './../../../controller/servicos_aluno_professor/aluno-professor.service';
import { AlunoProfessor } from './../../../model/bean_aluno_professor/aluno-professor';
import { ProfessorService } from 'src/app/controller/servicos_professor/professor.service';
import { EmailService } from './../../../controller/servicos_email/email.service';
import { Professor } from './../../../model/bean_professor/professor';

@Component({
  selector: 'app-listar-alunos',
  templateUrl: './listar-alunos.component.html',
  styleUrls: ['./listar-alunos.component.css']
})
export class ListarAlunosComponent implements OnInit {

  // Vetor de alunos para a tabela
  private alunos: Aluno[];
  // Aluno de cada linha na tabela
  private aluno_tabela: Aluno = new Aluno();
  // Aluno selecionado na tabela
  private alterar_aluno: Aluno = new Aluno();
  // Aluno a adicionar
  private adicionar_aluno: Aluno = new Aluno();

  private AlunoProfessor: AlunoProfessor = new AlunoProfessor();

  private modal: any;

  //Construtor
  constructor(
    private router: Router,
    private AlunoProfessorService: AlunoProfessorService,
    private AlunoService: AlunoService,
    private ProfessorService: ProfessorService,
    private EmailService: EmailService
  ) { }



  ngOnInit() {
    // Populando a lista de alunos
    this.listarAluno();


    var elems = document.querySelectorAll('.autocomplete');
    var instances = Autocomplete.init(elems);

    this.AlunoService.listarAlunos().subscribe((Alunos: Aluno[]) => {
      var alunos_completar = [];
      Alunos.forEach(Aluno => {
        alunos_completar[Aluno.codigo] = null;
      });
      var elem = $('.autocomplete');
      var instance = Autocomplete.getInstance(elem);
      instance.updateData(alunos_completar);
    })

    var elems = document.querySelectorAll('.collapsible');
    var instances = Collapsible.init(elems);

    // Iniciando o Modal
    var elems2 = document.querySelectorAll('.modal');
    var instances2 = Modal.init(elems2);

    // Atribuindo variavel
    this.modal = $('.modal');

  }

  listarAluno() {
    var professor_logado = localStorage.getItem("professor_logado") == null ? sessionStorage.getItem("professor_logado") : localStorage.getItem("professor_logado");
    if (professor_logado == null) {
      return;
    }
    this.AlunoProfessorService.listarAlunoProfessor(professor_logado).subscribe((Alunos: Aluno[]) => {
      this.alunos = Alunos;
    })
  }

  alterarAluno() {
    // if (confirm("Salvar informações?") == true) {
      var professor_logado = localStorage.getItem("professor_logado") == null ? sessionStorage.getItem("professor_logado") : localStorage.getItem("professor_logado");
      this.AlunoProfessorService.alterarAlunoProfessor(this.alterar_aluno, professor_logado).subscribe((msg: string) => {
        var retorno_msg = JSON.stringify(msg).substring(13).replace('"}', "");
        if (retorno_msg != "Registro atualizado com sucesso!") {
          retorno_msg = "Ocorreu algum erro ao atualizar o cadastro!";
        }
        toast({ html: retorno_msg });
        // Fechando o modal
        var botao = <HTMLButtonElement> document.getElementById('fecharModal');
        botao.click();

        this.listarAluno();
      })
    // }
  }

  deletarAluno(email_aluno: string) {
    if (confirm("Deseja excluir") == true) {
      var professor_logado = localStorage.getItem("professor_logado") == null ? sessionStorage.getItem("professor_logado") : localStorage.getItem("professor_logado");
      this.AlunoProfessorService.excluirAlunoProfessor(email_aluno, professor_logado).subscribe((msg: string) => {
        var retorno_msg = JSON.stringify(msg).substring(13).replace('"}', "");
        if (retorno_msg != "Registro excluido com sucesso!") {
          retorno_msg = "Ocorreu algum erro ao deletar o cadastro!";
        }
        toast({ html: retorno_msg });
        this.listarAluno();
      })
    }
  }

  retornarAluno(aluno: Aluno) {
    this.alterar_aluno.codigo = aluno.codigo;
    this.alterar_aluno.cpf_aluno = aluno.cpf_aluno;
    this.alterar_aluno.descricao_aluno = aluno.descricao_aluno;
    this.alterar_aluno.foto_aluno = aluno.foto_aluno;
    this.alterar_aluno.nome_aluno = aluno.nome_aluno;
    this.alterar_aluno.senha_aluno = aluno.senha_aluno;
    this.alterar_aluno.situacao_aluno = aluno.situacao_aluno;
  }




  // Metodo para cadastrar o Aluno
  cadastrarAluno() {

    // Verificando o registro do aluno
    if (this.adicionar_aluno.codigo == null || this.adicionar_aluno.nome_aluno == null) {
      return;
    }
    this.AlunoService.obterDadosAluno(this.adicionar_aluno.codigo).subscribe((Aluno: Aluno) => {
      if (Aluno == null) {
        this.enviarEmail();
        var nome_aluno = <HTMLElement>document.getElementsByClassName("nome_aluno")[0];
        nome_aluno.style.display = "inline-block";
      } else {
        var professor_logado = localStorage.getItem("professor_logado") == null ? sessionStorage.getItem("professor_logado") : localStorage.getItem("professor_logado");
        this.AlunoProfessor = new AlunoProfessor();
        this.AlunoProfessor.email_aluno = Aluno.codigo;
        this.AlunoProfessor.email_professor = professor_logado;
        this.AlunoProfessor.situacao_aluno = false;
        this.AlunoProfessorService.cadastrarAlunoProfessor(this.AlunoProfessor).subscribe((msg: string) => {
          var retorno_msg = JSON.stringify(msg).substring(13).replace('"}', "");
          if (retorno_msg != "Registro salvo com sucesso!" && retorno_msg != "Registro já existe na sua lista!") {
            retorno_msg = "Ocorreu algum erro ao salvar o cadastro!";
          }
          toast({ html: retorno_msg });
          this.listarAluno();
        })
      }
    })
    var elem = document.getElementById("modalAddAluno");
    var instance = Modal.getInstance(elem);
    instance.close();
  }

  enviarEmail() {
    var codigo_professor = localStorage.getItem("usuario_logado") != null ? localStorage.getItem("usuario_logado") : sessionStorage.getItem("usuario_logado");

    this.ProfessorService.obterDadosProfessor(codigo_professor).subscribe((professor: Professor) => {
      this.EmailService.enviarEmail(this.adicionar_aluno.codigo, this.adicionar_aluno.nome_aluno, professor.nome_professor).subscribe((msg: string) => {

        var mensagem = JSON.stringify(msg).substring(13).replace('"}', "");
        if (mensagem == "Ocorreu algum erro ao enviar o email, por favor tente novamente!") {
          toast({ html: '<span>' + mensagem + '</span><button (click)="enviarEmail()" type="button" class="btn-flat toast-action">Tentar novamente</button>' });
        }
      })
    })
  }

  // Metodo navegar para o Financeiro
  private navFinanceiro() {
    this.router.navigate['/financeiro'];
  }

  //
  //Método para inserir a Imagem
  //

  // Variaveis para salvar a imagem, a URL, mensagem e Erro
  public imagePath;
  urlAlternativo: any = 'data:image/png;base64,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';
  imgURL: any = this.urlAlternativo;
  imagem: any = '';
  public message: string;

  //Método para Visualizar a prévia
  preview(files) {
    if (files.length === 0)
      return;

    //Verificando se é imagem
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    //Carregando a prévia
    var reader = new FileReader();
    this.imagePath = files;

    this.imagem = files[0].name;

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }
}
