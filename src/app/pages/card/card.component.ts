import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ObjectRequest, CardData, TreatCard } from '../../models/models';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { ToastController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core'

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
export class CardComponent {

  constructor( 
    private changeRef: ChangeDetectorRef,
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


  ionViewWillEnter() {
    console.log(this.displayCards);
    // tslint:disable-next-line: align
    this.username = this._shareService.getSharedData();
    this.getOpps(); 
    
  }
   

  opportunities() {
    if (this.messages.length > 0) {
      this.messages.forEach((element: CardData) => {
        let auxObj = {} as TreatCard;
        auxObj.cardData = element;
        auxObj.isTreated = false;
        this.displayCards.push(auxObj);
      });
      setTimeout(()=>{
        this.changeRef.detectChanges();
      }, 0);
    }
  }
  
 
  getOpps() {
    this.dataService.getData(this.username.username)
    .subscribe((post: Array<CardData>) => {
      this.messages = post;
      this.displayCards = [];
      console.log("GET OPPORTUNITIES FROM SALESFORCE");
      this.opportunities();
      console.log("SUBSCRBING PUSH NOTIFICATIONS API FIREBASE");
      this.subscribePushNotifications();
      
    });
  }

  subscribeTokenToTopic(token, topic) {
    fetch('https://iid.googleapis.com/iid/v1/'+token+'/rel/topics/'+topic, {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'key=AAAAsO1y_NE:APA91bEdF3obX987LA6vc1msUhzGcrnBLisbwvNrvnsAqZmqaSH2apXxcKSdB8fp3tFH0vyLu7w4eF55PVeUVBPRpK9FgH-X3YxY6cHcQZiAbGy1Gp_v0d-04ZkQ8tnsywrTcd83bx85'
      })
    }).then(response => {
      if (response.status < 200 || response.status >= 400) {
        throw 'Error subscribing to topic: '+response.status + ' - ' + response.text();
      }
      console.log('Subscribed to "'+topic+'"');
    }).catch(error => {
      console.error(error);
    })
  }

  subscribePushNotifications(){
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
        console.log('Push registration success, token: ' + token.value);
        this.subscribeTokenToTopic(token.value,'sfdcmulepoc');
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', 
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', 
      (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', 
      (notification: PushNotificationActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
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


  accept(id: string) {
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
    
    this.dataService.postData(arrRequestObjects, this.username.username).subscribe( response => {
      if (response.statusSalesforce === 200) { 
        this.showToast('Your opportunity was accepted successfully', 'success');
      } else {
        this.showToast('Upps.. Something went wrong', 'warning');
      }
    });
    setTimeout(()=> this.getOpps(), 1500);
  }
  
  async reject(id: string) {
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
    this.dataService.postData(arrRequestObjects, this.username.username).subscribe( response => {
      if (response.statusSalesforce === 200) { 
        this.showToast('Your opportunity was rejected successfully', 'danger');
      } else {
        this.showToast('Upps.. Something went wrong', 'warning');
      }
    });
    setTimeout(() => this.getOpps(), 1500); // TODO: 
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      color,
      cssClass: 'toastStyle'
    });
    toast.present();
  }
}
