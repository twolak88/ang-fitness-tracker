import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  availableExercises: Exercise[];
  isLoading$: Observable<boolean>;
  private exercisesChangedSub: Subscription;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercisesChangedSub = this.trainingService.exercisesChanged.subscribe(
      (exercises) => {
        this.availableExercises = exercises;
        // this.isLoading = false;
      }
    );
    this.fetchExercises();
  }

  ngOnDestroy(): void {
    if (this.exercisesChangedSub) {
      this.exercisesChangedSub.unsubscribe();
    }
  }

  onStartTraining(trnForm: NgForm): void {
    this.trainingService.startExercise(trnForm.value.exercise);
  }

  fetchExercises(): void {
    this.trainingService.fetchAvailableExercises();
  }
}
