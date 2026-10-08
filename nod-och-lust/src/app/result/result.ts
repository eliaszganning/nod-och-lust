import { Component, inject } from '@angular/core';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.html',
  styleUrl: './result.scss',
})
export class Result {
  readonly quiz = inject(QuizService);
}
