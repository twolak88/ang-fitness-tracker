import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  availableExercises: Exercise[];
  exercisesChangedSub: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exercisesChangedSub = this.trainingService.exercisesChanged.subscribe(
      (exercises) => (this.availableExercises = exercises)
    );
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    this.exercisesChangedSub.unsubscribe();
  }

  onStartTraining(trnForm: NgForm): void {
    this.trainingService.startExercise(trnForm.value.exercise);
  }
}
