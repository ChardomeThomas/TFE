import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityDayComponent } from './city-day.component';

describe('CityDayComponent', () => {
  let component: CityDayComponent;
  let fixture: ComponentFixture<CityDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityDayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CityDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
