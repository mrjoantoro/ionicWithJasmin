import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit {
  task: Task = { title: '', description: '', completed: false };

  constructor(private taskService: TaskService) { }

  ngOnInit() {}

  saveTask() {
    if (this.task.id) {
      this.taskService.updateTask(this.task).then(() => console.log('Tarea actualizada'));
    } else {
      this.taskService.addTask(this.task).then(() => console.log('Tarea creada'));
    }
  }
}
