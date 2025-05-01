import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterUserComponent } from "./footer-user/footer-user.component";
import { HeaderUserComponent } from "./header-user/header-user.component";

@Component({
  selector: 'app-user-template',
  imports: [HeaderUserComponent, FooterUserComponent, RouterOutlet],
  templateUrl: './user-template.component.html',
  styleUrl: './user-template.component.css'
})
export class UserTemplateComponent {

}
