import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UmbralPage } from './umbral.page';

describe('UmbralPage', () => {
  let component: UmbralPage;
  let fixture: ComponentFixture<UmbralPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UmbralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
