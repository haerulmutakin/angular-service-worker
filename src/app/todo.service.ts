import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  apiUrl = 'https://todo.serveo.net/todo';
  // apiUrl = 'http://localhost:1323/todo';

  constructor(private httpCLient: HttpClient) { }

  getTodo() {
    return this.httpCLient.get(this.apiUrl);
  }

  createTodo(todo: any) {
    return this.httpCLient.post(this.apiUrl, todo);
  }

  updateTodo(todoId: any) {
    return this.httpCLient.put(this.apiUrl, todoId);
  }
}
