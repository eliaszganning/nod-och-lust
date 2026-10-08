import { computed, Injectable, signal } from '@angular/core';
import questionsData from '../questions.json';

export type PersonKey = 's' | 'n';

export interface Question {
  question: string;
  alternatives: Record<PersonKey, string>;
}

export interface ShownAlternative {
  key: PersonKey;
  label: string;
}

const PERSON_NAMES: Record<PersonKey, string> = {
  s: 'Simon',
  n: 'Nora',
};

@Injectable({ providedIn: 'root' })
export class QuizService {
  readonly questions: Question[] = questionsData.questions as Question[];

  private readonly currentIndex = signal(0);
  private readonly locked = signal(false);
  private readonly answers = signal<Array<PersonKey | null>>(
    this.questions.map(() => null)
  );

  readonly index = this.currentIndex.asReadonly();
  readonly total = this.questions.length;
  readonly currentQuestion = computed(() => this.questions[this.currentIndex()]);
  readonly isComplete = computed(
    () => this.currentIndex() >= this.questions.length
  );
  readonly canGoBack = computed(
    () => this.currentIndex() > 0 && this.currentIndex() <= this.questions.length
  );

  readonly shownAlternatives = computed<ShownAlternative[]>(() => {
    const question = this.currentQuestion();
    if (!question) {
      return [];
    }

    return (Object.entries(question.alternatives) as [PersonKey, string][]).map(
      ([key, label]) => ({ key, label })
    );
  });

  readonly simonCount = computed(
    () => this.answers().filter((answer) => answer === 's').length
  );
  readonly noraCount = computed(
    () => this.answers().filter((answer) => answer === 'n').length
  );
  readonly simonPercent = computed(() =>
    this.toPercent(this.simonCount())
  );
  readonly noraPercent = computed(() => this.toPercent(this.noraCount()));
  readonly winnerName = computed(() => {
    const simon = this.simonCount();
    const nora = this.noraCount();
    if (simon === nora) {
      return 'Simon och Nora';
    }
    return simon > nora ? PERSON_NAMES.s : PERSON_NAMES.n;
  });
  readonly hasFinishedQuiz = computed(() =>
    this.answers().every((answer) => answer !== null)
  );

  start(): void {
    this.locked.set(false);
    this.currentIndex.set(0);
    this.answers.set(this.questions.map(() => null));
  }

  lock(): void {
    this.locked.set(true);
  }

  select(key: PersonKey): void {
    if (this.locked()) {
      return;
    }

    const index = this.currentIndex();
    if (index >= this.questions.length) {
      return;
    }

    this.answers.update((answers) => {
      const next = [...answers];
      next[index] = key;
      return next;
    });
    this.currentIndex.set(index + 1);
  }

  goBack(): void {
    if (this.locked()) {
      return;
    }

    const index = this.currentIndex();
    if (index <= 0) {
      return;
    }

    const previous = index - 1;
    this.answers.update((answers) => {
      const next = [...answers];
      next[previous] = null;
      return next;
    });
    this.currentIndex.set(previous);
  }

  private toPercent(count: number): number {
    if (this.total === 0) {
      return 0;
    }
    return Math.round((count / this.total) * 100);
  }
}
