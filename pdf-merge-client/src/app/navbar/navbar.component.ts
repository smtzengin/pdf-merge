import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>PDF Tools</h1>
      </div>
      <div class="navbar-menu">
        <a routerLink="/merge" routerLinkActive="active">
          <i class="fas fa-object-group"></i>
          PDF Merge
        </a>
        <a routerLink="/convert" routerLinkActive="active">
          <i class="fas fa-file-export"></i>
          DOCX to PDF
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(67, 97, 238, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'Fredoka', sans-serif;
    }

    .navbar-brand h1 {
      font-family: 'Righteous', cursive;
      color: #4361ee;
      margin: 0;
      font-size: 1.8rem;
    }

    .navbar-menu {
      display: flex;
      gap: 2rem;
    }

    .navbar-menu a {
      color: #7b8ab8;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
    }

    .navbar-menu a:hover {
      color: #4361ee;
      background: #f0f4ff;
    }

    .navbar-menu a.active {
      color: #4361ee;
      background: #f0f4ff;
      font-weight: 500;
    }

    .navbar-menu i {
      font-size: 1.2rem;
    }
  `]
})
export class NavbarComponent {} 