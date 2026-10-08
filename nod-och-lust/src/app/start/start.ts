import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.html',
  styleUrl: './start.scss',
})
export class Start {
  private readonly quiz = inject(QuizService);
  private readonly router = inject(Router);

  startQuiz(): void {
    this.quiz.start();
    void this.router.navigate(['/quiz']);
  }
}
