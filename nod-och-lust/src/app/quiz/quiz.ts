import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PersonKey, QuizService } from '../quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  readonly quiz = inject(QuizService);
  private readonly router = inject(Router);

  goBack(): void {
    this.quiz.goBack();
  }

  select(key: PersonKey): void {
    this.quiz.select(key);
  }

  seeResult(): void {
    this.quiz.lock();
    void this.router.navigate(['/result']);
  }
}
