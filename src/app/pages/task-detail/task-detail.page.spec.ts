import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailPage } from './task-detail.page';

describe('TaskDetailPage', () => {
  let component: TaskDetailPage;
  let fixture: ComponentFixture<TaskDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
