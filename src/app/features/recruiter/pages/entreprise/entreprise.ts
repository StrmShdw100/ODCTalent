import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-entreprise',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './entreprise.html',
  styleUrls: ['./entreprise.css']
})
export class Entreprise {}