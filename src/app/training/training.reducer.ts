import { TrainingActions, SET_AVAILABLE_TRAININGS, SET_HISTORICAL_TRAININGS, START_TRAINING, STOP_TRAINING } from './training.actions';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TrainingState {
  availableExercises: Exercise[];
  historicalExercises: Exercise[];
  runningExercise: Exercise;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  historicalExercises: [],
  runningExercise: null
};

export function trainingReducer(state: TrainingState = initialState, action: TrainingActions): TrainingState {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        availableExercises: action.payload
      };
    case SET_HISTORICAL_TRAININGS:
      return {
        ...state,
        historicalExercises: action.payload
      };
    case START_TRAINING:
      return {
        ...state,
        runningExercise: { ...state.availableExercises.find(ex => ex.id === action.payload) }
      };
    case STOP_TRAINING:
      return {
        ...state,
        runningExercise: null
      };
    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getHistoricalExercises = createSelector(getTrainingState, (state: TrainingState) => state.historicalExercises);
export const getRunningExercise = createSelector(getTrainingState, (state: TrainingState) => state.runningExercise);
export const getIsExercise = createSelector(getTrainingState, (state: TrainingState) => state.runningExercise != null);
