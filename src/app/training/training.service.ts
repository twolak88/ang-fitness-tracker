import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Exercise } from './exercise.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  exercisesChanged = new Subject<Exercise[]>();
  onGoingExerciseChange = new Subject<Exercise>();
  historicalExercisesChanged = new Subject<Exercise[]>();
  private dbSubscriptions: Subscription;

  constructor(
    private db: AngularFirestore,
    private uiService: UiService
  ) { }

  fetchAvailableExercises(): void {
    this.uiService.loadingStateChanged.next(true);
    this.dbSubscriptions.add(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) => {
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc.id,
                ...(doc.payload.doc.data() as Exercise),
              };
            });
          })
        )
        .subscribe((exercises: Exercise[]) => {
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
          this.uiService.loadingStateChanged.next(false);
        })
    );
  }

  startExercise(selectedId: string): void {
    // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
    this.runningExercise = this.availableExercises.find(
      (exercise) => exercise.id === selectedId
    );
    this.onGoingExerciseChange.next({ ...this.runningExercise });
  }

  completeExercise(): void {
    this.pushExercisesToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.onGoingExerciseChange.next(null);
  }

  cancelExercise(progress: number): void {
    this.pushExercisesToDatabase({
      ...this.runningExercise,
      duration: (this.runningExercise.duration * progress) / 100,
      calories: (this.runningExercise.calories * progress) / 100,
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.onGoingExerciseChange.next(null);
  }

  getRunningExercise(): Exercise {
    return { ...this.runningExercise };
  }

  fetchHistoricalExercises(): void {
    this.dbSubscriptions.add(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.historicalExercisesChanged.next(exercises);
        })
    );
  }

  initSubscriptions(): void {
    this.dbSubscriptions = new Subscription();
  }

  cancelSubscriptions(): void {
    if (this.dbSubscriptions) {
      this.dbSubscriptions.unsubscribe();
    }
  }

  private pushExercisesToDatabase(exercise: Exercise): void {
    this.db.collection('finishedExercises').add(exercise);
  }
}
