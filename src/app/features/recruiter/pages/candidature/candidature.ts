import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-candidatures',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl:'./candidature.html',
  styleUrl:'./candidature.css'
})
export class Candidatures {}