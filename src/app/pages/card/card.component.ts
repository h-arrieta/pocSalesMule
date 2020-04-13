import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ObjectRequest, CardData, TreatCard } from '../../models/models';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { ToastController } from '@ionic/angular';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed } from '@capacitor/core';

const { PushNotifications } = Plugins;

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],

})
export class CardComponent implements OnInit {

  constructor( 
    private dataService: DataService,
    private _shareService: SharedService,
    public toastController: ToastController,
    private route: ActivatedRoute) {
      // this.route.params.subscribe( params => this.goDetails(params['term'])); (1);
     }

  messages: Array<CardData> = [];
  myOpportunities: any[] = [];
  status = false;
  treatmentPending = false;
  selectedOnes: any[] = [];
  treatmentOnes: any[] = [];
  displayCards: Array<TreatCard> = [];
  isChecked = false;
  username:any;

  ngOnInit() {
    console.log(this.displayCards);
    // tslint:disable-next-line: align
    this.username = this._shareService.getSharedData();
    this.getOpps();

    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', 
      (token: PushNotificationToken) => {
        alert('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', 
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', 
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', 
      (notification: PushNotificationActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  opportunities() {
    if (this.messages.length > 0) {
      this.messages.forEach((element: CardData) => {
        let auxObj = {} as TreatCard;
        auxObj.cardData = element;
        auxObj.isTreated = false;
        this.displayCards.push(auxObj);
      });
    }
  }
  
 
  getOpps() {
    this.dataService.getData(this.username.username)
    .subscribe((post: Array<CardData>) => {
      this.messages = post;
      this.displayCards = [];
      this.opportunities();
    });
  }

  changeTreatStatus(id: string) {
    this.displayCards.forEach((element: TreatCard) => {
      if (element.cardData.opportunity.Id === id) {
        if(element.isTreated === false) {
          element.isTreated = true;
        } else {
          element.isTreated = false;
        }
      }
    // tslint:disable-next-line: align
    });
    this.isChecked = this.displayCards.some(element => element.isTreated === true);
    console.log(this.displayCards);
 }


async accept(user:string) {
  let arrRequestObjects:Array < ObjectRequest > = [];
  this.displayCards.forEach((element:TreatCard) => {
    if (element.isTreated === true) {
      let aux = {} as ObjectRequest; 
      aux.actionType = "Approve";
      aux.contextId = element.cardData.approvalId;
      aux.comments = "this record was approved";
      arrRequestObjects.push(aux);
    }
  });
  this.dataService.postData(arrRequestObjects, this.username.username);
  const toast =   await this.toastController.create({
    message: 'Your opportunity was accepted',
    duration: 1500,
    color: 'success',
    cssClass: 'toastStyle'
  });
  toast.present();
  setTimeout(()=> this.getOpps(), 1500);
}

async reject(user:string) {
  let arrRequestObjects:Array < ObjectRequest > = [];
  this.displayCards.forEach((element:TreatCard) => {
    if (element.isTreated === true) {
      let aux = {} as ObjectRequest; 
      aux.actionType = "Reject";
      aux.contextId = element.cardData.approvalId;
      aux.comments = "this record was rejected";
      arrRequestObjects.push(aux);
      console.log(aux);
    }
  });
  this.dataService.postData(arrRequestObjects, this.username.username);
  const toast =   await this.toastController.create({
    message: 'Your opportunity was rejected',
    duration: 1500,
    color: 'danger',
    cssClass: 'toastStyle'
  });
  toast.present();
  setTimeout(()=> this.getOpps(), 1500);
}
}
