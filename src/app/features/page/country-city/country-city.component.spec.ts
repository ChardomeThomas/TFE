import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryCityComponent } from './country-city.component';

describe('CountryCityComponent', () => {
  let component: CountryCityComponent;
  let fixture: ComponentFixture<CountryCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryCityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CountryCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
