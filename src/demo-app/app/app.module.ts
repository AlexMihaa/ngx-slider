import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Ng5SliderModule } from '@local/ng5-slider';
import { AppComponent } from './app.component';
import {
  SimpleSliderComponent,
  RangeSliderComponent,
  StyledSliderComponent,
  LimitedSliderComponent,
  LimitedRangeSliderComponent,
  NoSwitchingRangeSliderComponent,
  PushRangeSliderComponent,
  SelectionBarSliderComponent,
  SelectionBarAtEndSliderComponent,
  SelectionBarFromValueSliderComponent,
  SelectionBarGradientSliderComponent,
  DynamicColorSelectionBarSliderComponent,
  DynamicPointerColorSliderComponent,
  SteppedSliderComponent,
  RightToLeftSliderComponent,
  FloatingPointSliderComponent,
  CustomDisplayFunctionSliderComponent,
  CustomCombineLabelsFunctionSliderComponent,
  CustomHtmlDisplayFunctionSliderComponent,
  AlphabetSliderComponent,
  DateSliderComponent,
  TicksSliderComponent,
  IntermediateTicksSliderComponent,
  CustomTicksSliderComponent,
  CustomTicksLegendSliderComponent,
  CustomLegendFunctionSliderComponent,
  TicksTooltipsSliderComponent,
  TicksCustomTooltipsSliderComponent,
  TicksValuesTooltipsSliderComponent,
  TicksValuesRangeSliderComponent,
  IntermediateTicksValuesRangeSliderComponent,
  DynamicTickColorSliderComponent,
  LogScaleSliderComponent,
  CustomScaleSliderComponent,
  DraggableRangeSliderComponent,
  DraggableRangeOnlySliderComponent,
  DisabledSliderComponent,
  ReadOnlySliderComponent,
  VerticalSlidersComponent,
  UserEventsSliderComponent
} from './snippets';
import { AllDemosComponent } from './all-demos.component';
import { routerConfig } from './app-router.config';

@NgModule({
  declarations: [
    AppComponent,
    SimpleSliderComponent,
    RangeSliderComponent,
    StyledSliderComponent,
    LimitedSliderComponent,
    LimitedRangeSliderComponent,
    NoSwitchingRangeSliderComponent,
    PushRangeSliderComponent,
    SelectionBarSliderComponent,
    SelectionBarAtEndSliderComponent,
    SelectionBarFromValueSliderComponent,
    SelectionBarGradientSliderComponent,
    DynamicColorSelectionBarSliderComponent,
    DynamicPointerColorSliderComponent,
    SteppedSliderComponent,
    RightToLeftSliderComponent,
    FloatingPointSliderComponent,
    CustomDisplayFunctionSliderComponent,
    CustomCombineLabelsFunctionSliderComponent,
    CustomHtmlDisplayFunctionSliderComponent,
    AlphabetSliderComponent,
    DateSliderComponent,
    TicksSliderComponent,
    IntermediateTicksSliderComponent,
    CustomTicksSliderComponent,
    CustomTicksLegendSliderComponent,
    CustomLegendFunctionSliderComponent,
    TicksTooltipsSliderComponent,
    TicksCustomTooltipsSliderComponent,
    TicksValuesTooltipsSliderComponent,
    TicksValuesRangeSliderComponent,
    IntermediateTicksValuesRangeSliderComponent,
    DynamicTickColorSliderComponent,
    LogScaleSliderComponent,
    CustomScaleSliderComponent,
    DraggableRangeSliderComponent,
    DraggableRangeOnlySliderComponent,
    DisabledSliderComponent,
    ReadOnlySliderComponent,
    VerticalSlidersComponent,
    UserEventsSliderComponent,
    AllDemosComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routerConfig),
    NgbModule.forRoot(),
    Ng5SliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
