import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  onGoingExercise = false;
  onGoingExerciseChangeSub: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.onGoingExerciseChangeSub = this.trainingService.onGoingExerciseChange.subscribe(
      onGoingTraning => this.onGoingExercise = onGoingTraning != null
    );
  }

  ngOnDestroy(): void {
    if (this.onGoingExerciseChangeSub) {
      this.onGoingExerciseChangeSub.unsubscribe();
    }
  }
}
