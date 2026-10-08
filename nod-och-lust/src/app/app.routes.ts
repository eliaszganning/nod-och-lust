import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { Quiz } from './quiz/quiz';
import { QuizService } from './quiz.service';
import { Result } from './result/result';
import { Start } from './start/start';

const resultGuard: CanActivateFn = () => {
  const quiz = inject(QuizService);
  const router = inject(Router);
  return quiz.hasFinishedQuiz() ? true : router.parseUrl('/');
};

export const routes: Routes = [
  { path: '', component: Start },
  { path: 'quiz', component: Quiz },
  { path: 'result', component: Result, canActivate: [resultGuard] },
  { path: '**', redirectTo: '' },
];
