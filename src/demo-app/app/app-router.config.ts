import { Routes } from '@angular/router';
import { AllDemosComponent } from './all-demos.component';
import {
  SimpleSliderComponent,
  RangeSliderComponent,
  PushRangeSliderComponent,
  DraggableRangeSliderComponent
} from './snippets';

export let routerConfig: Routes = [
  { path: '', pathMatch: 'full', component: AllDemosComponent },
  { path: 'simple-slider', component: SimpleSliderComponent },
  { path: 'range-slider', component: RangeSliderComponent },
  { path: 'draggable-range-slider', component: DraggableRangeSliderComponent },
  { path: 'push-range-slider', component: PushRangeSliderComponent },
  { path: '**', pathMatch: 'full', redirectTo: ''}
];
