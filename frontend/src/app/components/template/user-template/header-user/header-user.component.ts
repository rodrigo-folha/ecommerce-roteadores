import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-user',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent {

  isMenuOpen = false
  isDarkMode = false
  isLoggedIn = false

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode
    if (this.isDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }

  login() {
    // Implementação futura de login
    this.isLoggedIn = true
  }

  logout() {
    // Implementação futura de login
    this.isLoggedIn = false
  }

  irParaLogin() {
    
  }

}
