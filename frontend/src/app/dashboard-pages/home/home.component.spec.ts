import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import { HomeComponent } from './home.component';
import { ScheduleCardComponent } from './widgets/schedule-card/schedule-card.component';
import { CardComponent } from '@app/shared/components/card/card.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      root: {
        children: []
      }
    };

    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        ScheduleCardComponent
      ],
      imports: [
        HttpClientTestingModule,
        CardComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
