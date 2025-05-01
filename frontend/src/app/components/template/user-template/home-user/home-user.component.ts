import { Component } from '@angular/core';
import { BannerPrincipalComponent } from "../banner-principal/banner-principal.component";
import { RoteadoresCardsComponent } from "../roteadores-cards/roteadores-cards.component";
import { TestemunhosComponent } from "../testemunhos/testemunhos.component";
import { FaqComponent } from "../faq/faq.component";

@Component({
  selector: 'app-home-user',
  imports: [BannerPrincipalComponent, RoteadoresCardsComponent, TestemunhosComponent, FaqComponent],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent {

}
