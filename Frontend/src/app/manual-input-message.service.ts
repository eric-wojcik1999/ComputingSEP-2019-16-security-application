import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManualInputMessageService {

  // array of messages
  messages: string[] = [];

  // add message to array
  add(message: string) {
    this.messages.push(message);
  }

  // clear the array of messages
  clear(){
    this.messages = [];
  }

  // this doesn't need a constructor
}
