import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  availableExercises: Observable<Exercise[]>;

  constructor(private trainingService: TrainingService,
              private db: AngularFirestore) { }

  ngOnInit(): void {
    // this.availableExercises = this.trainingService.getAvailableExercises();
    this.availableExercises = this.db.collection('availableExercises').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data() as Exercise
          };
        });
      }));
  }

  onStartTraining(trnForm: NgForm): void {
    this.trainingService.startExercise(trnForm.value.exercise);
  }
}
