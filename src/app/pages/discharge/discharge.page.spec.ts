import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DischargePage } from './discharge.page';

describe('DischargePage', () => {
  let component: DischargePage;
  let fixture: ComponentFixture<DischargePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DischargePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
