import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphsPage } from './graphs.page';

describe('GraphsPage', () => {
  let component: GraphsPage;
  let fixture: ComponentFixture<GraphsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
