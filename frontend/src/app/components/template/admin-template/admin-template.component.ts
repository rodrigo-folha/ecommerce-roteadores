import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderAdminComponent } from "./header-admin/header-admin.component";

@Component({
  selector: 'app-admin-template',
  imports: [SidebarComponent, FooterComponent, HeaderAdminComponent],
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent {

}
