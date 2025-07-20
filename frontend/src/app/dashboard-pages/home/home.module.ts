import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ScheduleCardComponent } from './widgets/schedule-card/schedule-card.component';
import { CardComponent } from '@app/shared/components/card/card.component';

@NgModule({
  declarations: [
    HomeComponent,
    ScheduleCardComponent,
  ],
  imports: [
    HomeRoutingModule,
    CommonModule,
    CardComponent,
  ],
  providers: [
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
