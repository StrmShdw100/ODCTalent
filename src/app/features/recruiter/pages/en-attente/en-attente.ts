import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-en-attente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './en-attente.html',
  styleUrls: ['./en-attente.css']
})
export class EnAttente {}