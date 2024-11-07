import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksCollection = this.firestore.collection<Task>('tasks');

  constructor(private firestore: AngularFirestore) { }

  addTask(task: Task): Promise<void> {
    const id = this.firestore.createId();
    return this.tasksCollection.doc(id).set({ ...task, id });
  }

  getTasks(): Observable<Task[]> {
    return this.tasksCollection.valueChanges();
  }

  updateTask(task: Task): Promise<void> {
    return this.tasksCollection.doc(task.id).update(task);
  }

  deleteTask(id: string): Promise<void> {
    return this.tasksCollection.doc(id).delete();
  }
}


