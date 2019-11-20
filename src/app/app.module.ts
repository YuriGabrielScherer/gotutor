import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// Imports calendario
import { FullCalendarModule } from '@fullcalendar/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarioTodoComponent } from './view/calendario/calendario-todo/calendario-todo.component';
import { AppointmentDetailComponent } from './view/calendario/appointment-detail/appointment-detail.component';
import { CalendarioAulasComponent } from './view/calendario/calendario-aulas/calendario-aulas.component';

// Demais imports
import { ContatoComponent } from './view/contato/contato.component';
import { HomeComponent } from './view/home/home.component';
import { FooterComponent } from './view/footer/footer.component';
import { HeaderComponent } from './view/header/header.component';
import { LoginComponent } from './view/login/login.component';
import { InstitucionalComponent } from './view/institucional/institucional.component';
import { EscolherCadastroComponent } from './view/escolher-cadastro/escolher-cadastro.component';

//Services
import { AlunoModule } from './view/aluno/aluno.module';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './controller/servicos_login/auth.service';
// Masks
import { CursosModule } from './view/curso/cursos.module';
import { TextMaskModule } from 'angular2-text-mask';
import { ProfessorModule } from './view/professor/professor.module';

// Contato


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    InstitucionalComponent,
    EscolherCadastroComponent,
    CalendarioAulasComponent,
    AppointmentDetailComponent,
    CalendarioTodoComponent,
    ContatoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    TextMaskModule,
    CursosModule,
    AlunoModule,
    ProfessorModule
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
