import { Component, OnInit } from '@angular/core';
import { ManualInputMessageService } from '../manual-input-message.service';

@Component({
  selector: 'app-manual-input-messages',
  templateUrl: './manual-input-messages.component.html',
  styleUrls: ['./manual-input-messages.component.css']
})
export class ManualInputMessagesComponent implements OnInit {

  constructor(public manualInputMessageService: ManualInputMessageService) { }

  ngOnInit() {
  }

}
