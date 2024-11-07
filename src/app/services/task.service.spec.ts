import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let firestoreMock: any;

  beforeEach(() => {
    // Configuración del mock de AngularFirestore
    firestoreMock = jasmine.createSpyObj('AngularFirestore', ['collection', 'createId']);

    // Mock de `createId` para generar un ID simulado
    firestoreMock.createId.and.returnValue('mockedId');

    // Mock de `collection` para manejar los métodos `doc` y `valueChanges`
    firestoreMock.collection.and.returnValue({
      doc: jasmine.createSpy().and.returnValue({
        set: jasmine.createSpy().and.returnValue(Promise.resolve()),
        update: jasmine.createSpy().and.returnValue(Promise.resolve()),
        delete: jasmine.createSpy().and.returnValue(Promise.resolve())
      }),
      valueChanges: jasmine.createSpy().and.returnValue(of([]))
    });

    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: AngularFirestore, useValue: firestoreMock },
        { provide: 'angularfire2.app.options', useValue: {} } // Mock básico para la configuración de Firebase
      ]
    });

    service = TestBed.inject(TaskService);
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería agregar una tarea', async () => {
    const task: Task = { title: 'Test Task', description: 'Test Description', completed: false };
    await service.addTask(task);

    // Verificamos que `createId` fue llamado
    expect(firestoreMock.createId).toHaveBeenCalled();

    // Verificamos que la colección y `set` se llamaron con los parámetros correctos
    expect(firestoreMock.collection).toHaveBeenCalledWith('tasks');
    expect(firestoreMock.collection().doc).toHaveBeenCalledWith('mockedId');
    expect(firestoreMock.collection().doc('mockedId').set).toHaveBeenCalledWith({
      ...task,
      id: 'mockedId'
    });
  });

  it('debería obtener todas las tareas', (done) => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', description: 'Description 1', completed: false },
      { id: '2', title: 'Task 2', description: 'Description 2', completed: true }
    ];
    firestoreMock.collection().valueChanges.and.returnValue(of(tasks));

    service.getTasks().subscribe((data) => {
      expect(data).toEqual(tasks);
      done();
    });
  });

  it('debería actualizar una tarea', async () => {
    const task: Task = { id: '1', title: 'Updated Task', description: 'Updated Description', completed: true };
    await service.updateTask(task);

    expect(firestoreMock.collection).toHaveBeenCalledWith('tasks');
    expect(firestoreMock.collection().doc).toHaveBeenCalledWith('1');
    expect(firestoreMock.collection().doc('1').update).toHaveBeenCalledWith(task);
  });

  it('debería eliminar una tarea', async () => {
    await service.deleteTask('1');

    expect(firestoreMock.collection).toHaveBeenCalledWith('tasks');
    expect(firestoreMock.collection().doc).toHaveBeenCalledWith('1');
    expect(firestoreMock.collection().doc('1').delete).toHaveBeenCalled();
  });
});
