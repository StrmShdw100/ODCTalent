import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash.html',
  styleUrls: ['./splash.css']
})
export class SplashComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();
  isFadingOut: boolean = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.isFadingOut = true;
      setTimeout(() => {
        this.finished.emit();
      }, 600); // Temps de fondu de sortie
    }, 2800);
  }
}