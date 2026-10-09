import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recruiter-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recruiter-layout.html',
  styleUrls: ['./recruiter-layout.css']
})
export class RecruiterLayout {}