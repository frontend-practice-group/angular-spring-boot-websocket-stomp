import { Component } from '@angular/core';
import { AppService } from './app.service';
import { Message } from './message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sockets-ui';
  response: object | undefined
  greeting: string = '';
  name: string = '';
  connectButtonDisabled = false;
  disconnectButtonDisabled = true;


  constructor(private appService: AppService) {
    this.appService.responseSubject.subscribe(data => {
      this.greeting = data.content
    });
  }

  connect() {
    if (this.name !== '') {
      console.log('::connect btn clicked', this.name);
      this.appService.connect();
      this.connectButtonDisabled = true
      this.disconnectButtonDisabled = false
    } else {
      console.log('::connect no name entered');
    }
  }

  disconnect() {
    this.appService.disconnect()
    this.connectButtonDisabled = false
    this.disconnectButtonDisabled = true
  }

  sendMessage() {
    this.appService.send(new Message(this.name))
  }

  // handleMessage() {
  //   this.greeting = this.response
  // }
}
