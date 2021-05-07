import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Exercise } from './exercise.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private dbSubscriptions: Subscription;

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromTraining.State>
  ) { }

  fetchAvailableExercises(): void {
    this.store.dispatch(new UI.StartLoading());
    this.dbSubscriptions.add(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return (docArray as any[]).map(doc => {
              return {
                id: doc.payload.doc.id,
                ...(doc.payload.doc.data() as Exercise),
              };
            });
          })
        ).subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetAvailableTrainings(exercises));
          this.store.dispatch(new UI.StopLoading());
        }, error => {
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackbarError('Fetching Exercises failed, please try again later', null, 5000);
          this.store.dispatch(new Training.SetAvailableTrainings(null));
        })
    );
  }

  startExercise(selectedId: string): void {
    // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise(): void {
    this.store.select(fromTraining.getRunningExercise).pipe(take(1)).subscribe(exercise => {
      this.pushExercisesToDatabase({
        ...exercise,
        date: new Date(),
        state: 'completed',
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number): void {
    this.store.select(fromTraining.getRunningExercise).pipe(take(1)).subscribe(exercise => {
      this.pushExercisesToDatabase({
        ...exercise,
        duration: (exercise.duration * progress) / 100,
        calories: (exercise.calories * progress) / 100,
        date: new Date(),
        state: 'cancelled',
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchHistoricalExercises(): void {
    this.dbSubscriptions.add(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetHistoricalTrainings(exercises));
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
