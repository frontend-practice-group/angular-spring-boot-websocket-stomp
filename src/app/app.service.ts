import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client'
import * as Stomp from 'stompjs'
import { Subject } from "rxjs";
import { Message } from "./message";
import { Greeting } from './greeting';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // socket: SockJS
  stompClient: any
  topic: string = "/topic/greetings";
  responseSubject = new Subject<Greeting>()
  webSocketEndPoint: string = 'http://localhost:5555/ws';

  connect() {
    console.log("Initialize WebSocket Connection");
    let ws = SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe(_this.topic, function (greetingResponse: any) {
        _this.onMessageReceived(greetingResponse);
      });
    }, this.errorCallBack);
  };

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error: any) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  /**
   * Send message to sever via web socket
   * @param {*} message
   */
  send(message: Message) {
    console.log("calling logout api via web socket");
    this.stompClient.send("/app/greet", {}, JSON.stringify(message));
  }

  onMessageReceived(message: any) {
    console.log("Message Received from Server :: " + message.body);
    const obj = JSON.parse(message.body) as Greeting
    this.responseSubject.next(obj);
  }
  constructor() { }
}
