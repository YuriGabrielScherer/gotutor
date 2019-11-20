import { Component, OnInit } from '@angular/core';
import { ProfessorService } from 'src/app/controller/servicos_professor/professor.service';
import { Professor } from './../../../model/bean_professor/professor';

import { ValidacaoFormService } from 'src/app/controller/servicos_validacoes/validacao-form.service';
import { Router } from '@angular/router';
import { toast, Modal } from 'materialize-css';

@Component({
  selector: 'app-cadastro-professor',
  templateUrl: './cadastro-professor.component.html',
  styleUrls: ['./cadastro-professor.component.css']
})
export class CadastroProfessorComponent implements OnInit {

  constructor(
    private router: Router,
    private professorServico: ProfessorService,
    private validaForm: ValidacaoFormService
  ) { }

  private professor: Professor = new Professor();


  ngOnInit() {

    // Iniciando o Modal
    var elems = document.querySelectorAll('.modal');
    var instances = Modal.init(elems);

    if(this.professor_logado()){
      this.carregaDadosProfessor();
    }
  }

  carregaDadosProfessor(){
    var professor = sessionStorage.getItem("professor_logado") != null ? sessionStorage.getItem("professor_logado") : localStorage.getItem("professor_logado");
    this.professorServico.obterDadosProfessor(professor).subscribe((Professor: Professor) => {
      this.professor = Professor;
      this.imgURL = Professor.foto_professor;
    })
  }

  professor_logado() {
    var professor = sessionStorage.getItem("professor_logado") != null ? sessionStorage.getItem("professor_logado") : localStorage.getItem("professor_logado");
    if (professor != null) {
      return true;
    }
    return false;
  }

  cadastrarProfessor() {
    this.professor.foto_professor = this.imgURL;
    this.professorServico.cadastrarProfessor(this.professor).subscribe((msg: string) => {
      var mostrar = false;
      var registro_salvo = false;
      var retorno_msg = JSON.stringify(msg).substring(13).replace('"}', "");
      switch (retorno_msg) {
        case "Registro salvo com sucesso!":
          mostrar = true;
          registro_salvo = true;
          break;
        case "CPF já cadastrado!":
          mostrar = true;
          break;
        case "Email já cadastrado!":
          mostrar = true;
          break;
      }
      toast({ html: mostrar == true ? retorno_msg : "Ocorreu algum erro ao efetuar o cadastro!" });
      registro_salvo == true ? this.router.navigate(['/', 'login']) : null;
    })
  }

  alterarDadosProfessor(){
    this.professor.foto_professor = this.imgURL;
    this.professorServico.alterarProfessor(this.professor, this.professor.codigo).subscribe((msg: string) => {
      var mostrar = false;
      var registro_salvo = false;
      var retorno_msg = JSON.stringify(msg).substring(13).replace('"}', "");
      switch (retorno_msg) {
        case "Registro atualizado com sucesso!":
          mostrar = true;
          registro_salvo = true;
          break;
      }
      toast({ html: mostrar == true ? retorno_msg : "Ocorreu algum erro ao efetuar o cadastro!" });
      registro_salvo == true ? this.router.navigate(['/', 'administrativo']) : null;
    })
  }

  digitouSenhaAntiga = false;
  senhaAntiga: string;
  verificarSenhaAntiga() {
    var professor = sessionStorage.getItem("professor_logado") != null ? sessionStorage.getItem("professor_logado") : localStorage.getItem("professor_logado");
    this.professorServico.obterDadosProfessor(professor).subscribe((Professor: Professor) => {
      if (Professor.senha_professor == this.senhaAntiga) {
        this.digitouSenhaAntiga = true;
      } else {
        toast({ html: "Senha incorreta!" })
      }
    })
  }

  novaSenha: string;
  definirNovaSenha() {
    this.professor.senha_professor = this.novaSenha;
  }
  //
  //Validacao de CPF
  //
  confirma_senha: any = '';

  validaSenha() {
    var input = document.getElementById('senha_professor');
    var input2 = document.getElementById('conf_senha_professor');

    if (this.professor.senha_professor == this.confirma_senha  && this.professor.senha_professor.length >= 6) {
      //Alterando as classes do Input    
      input.classList.add('valid');
      input2.classList.add('valid');

      input.classList.remove('invalid');
      input2.classList.remove('invalid');
    } else {
      input.classList.remove('valid');
      input2.classList.remove('valid');

      input.classList.add('invalid');
      input2.classList.add('invalid');
    }

    if ((this.professor.senha_professor == '' || this.professor.senha_professor == null) && this.confirma_senha == '') {
      input.classList.remove('valid');
      input2.classList.remove('valid');

      input.classList.remove('invalid');
      input2.classList.remove('invalid');
    }
  }

  cancelar() {
    this.cpfValido = true;
    for (var i = 0; i < document.querySelectorAll("label").length; i++) {
      var componente = <HTMLElement>document.querySelectorAll("label")[i];
      componente.classList.remove('active');
    }
    for (var i = 0; i < document.querySelectorAll("i").length; i++) {
      var componente = <HTMLElement>document.querySelectorAll("i")[i];
      componente.classList.remove('active');
    }
    this.professor = new Professor();
    this.imgURL = this.urlAlternativo;
  }

  //
  // Metodos para Mascara de CPF
  //
  //Mascara
  public cpf_mask = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  //Validador CPF
  public cpfValido: boolean = true;

  // Método para validar o cpf
  public validarCpf() {
    //Get Valor
    var inputCpf = <HTMLInputElement>document.getElementById('cpf_professor');
    //Tirando Mascara
    var cpf = inputCpf.value.replace(".", "").replace(".", "").replace("-", "");
    //Se nao houver nada de errado, será true
    this.cpfValido = true;

    //Validacao de CPF
    this.cpfValido = this.validaForm.getValidacao(cpf);

    //Alterando as classes do Input
    var input = document.getElementById('cpf_professor');
    if (this.cpfValido == true) {
      input.classList.add('valid');
      input.classList.remove('invalid');
    } else {
      input.classList.remove('valid');
      input.classList.add('invalid');
    }
  }

  // 
  // Metodos para dar Upload na Imagem
  //

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