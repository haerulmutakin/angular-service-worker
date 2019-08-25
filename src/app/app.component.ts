import { Component, ApplicationRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, Subscription } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  availableSubs: Subscription;
  showLoader = false;
  dayData: Array<any> = [];
  typeValue = '';
  todoList = [];
  date: any = {};

  constructor(
    private appRef: ApplicationRef,
    private update: SwUpdate,
    private toastSvc: ToastrService,
    private todoSvc: TodoService
    ) {
    this.fetchTodo();
    this.notifyUpdates();
    this.getDateNow();
  }

  addTodo() {
    if (this.typeValue !== '') {
      this.showLoader = true;
      const body = {
        name: this.typeValue,
        completed: 0
      };
      this.todoSvc.createTodo(body).subscribe(res => {
        this.fetchTodo();
      });
    }
  }

  updateTodo(todoId) {
    const params = {
      id: todoId
    };
    this.todoSvc.updateTodo(params).subscribe(res => {
      this.fetchTodo();
    });
  }

  private fetchTodo() {
    this.todoSvc.getTodo().subscribe((res: any) => {
      this.todoList = res.data;
      this.showLoader = false;
      this.typeValue = '';
    });
  }

  private checkForAppUpdates() {
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(3 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() =>  {
      this.update.checkForUpdate();
      this.availableSubs = this.update.available.subscribe(event => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);
      });
      this.availableSubs.unsubscribe();
    });
  }

  private notifyUpdates() {
    this.update.available.subscribe((event: any) => {
      this.toastSvc.info('Tap to reload browser.', 'Version ' + event.available.appData.version + ' available')
      .onTap
      .pipe(take(1))
      .subscribe(() => {
        document.location.reload();
      });
    });
  }

  private getDateNow() {
    // tslint:disable-next-line:max-line-length
    const months = ['January', 'February', 'March', 'April', 'Mei', 'June', 'July', 'Augustus', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const current = new Date();
    this.date.date = current.getDate();
    this.date.month = months[current.getMonth()];
    this.date.year = current.getFullYear();
    this.date.day = days[current.getDay()];
  }
}
