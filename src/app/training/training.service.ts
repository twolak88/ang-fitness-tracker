import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Exercise } from './exercise.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  exercisesChanged = new Subject<Exercise[]>();
  onGoingExerciseChange = new Subject<Exercise>();
  historicalExercisesChanged = new Subject<Exercise[]>();

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises(): void {
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
      });
  }

  startExercise(selectedId: string): void {
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
    this.db.collection('finishedExercises')
      .valueChanges().subscribe((exercises: Exercise[]) => {
        this.historicalExercisesChanged.next(exercises);
      });
  }

  private pushExercisesToDatabase(exercise: Exercise): void {
    this.db.collection('finishedExercises').add(exercise);
  }
}
