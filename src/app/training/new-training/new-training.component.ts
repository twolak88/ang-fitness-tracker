import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UiService } from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  availableExercises: Exercise[];
  isLoading = false;
  private exercisesChangedSub: Subscription;
  private loadingSubscripion: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.loadingSubscripion = this.uiService.loadingStateChanged.subscribe(
      isLoading => this.isLoading = isLoading
    );
    this.exercisesChangedSub = this.trainingService.exercisesChanged.subscribe(
      (exercises) => {
        this.availableExercises = exercises;
        // this.isLoading = false;
      }
    );
    this.fetchExercises();
  }

  ngOnDestroy(): void {
    if (this.loadingSubscripion) {
      this.loadingSubscripion.unsubscribe();
    }
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
