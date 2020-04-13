import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ObjectRequest, CardData, TreatCard } from '../../models/models';



@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  mensajes: any[] = [];
  mensaje: any;
  location: any;
  username: any;
  displayCards: Array<TreatCard> = [];
  messages: Array<CardData> = [];
  router: any;
  
  // tslint:disable-next-line: variable-name
  // tslint:disable-next-line: max-line-length
  constructor(private dataService: DataService, private route: ActivatedRoute, private _shareService: SharedService,  private _router: Router, public toastController: ToastController) {}
  showShortDesciption = true;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Esto es el ID', id);
      // tslint:disable-next-line: align
      this.username = this._shareService.getSharedData();
    this.dataService.getData(this.username.username)
      .subscribe( (posts: any[]) => {
        this.mensajes = posts;
        // aqui es donde hacemos la seleccion que corresponda con el id
        console.log(this.mensajes);
        this.mensaje = this.getCardById(id);
        console.log(this.mensaje);
      });
    }

  getCardById(id: string): any {
   return this.mensajes.find(opp => opp.opportunity.Id === id);
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

  async acceptDetails(id: string) {
    let arrRequestObjects:Array < ObjectRequest > = [];
    this.mensajes.forEach((element:any) => {
      if (element.mensaje.Id === id) {
        let aux = {} as ObjectRequest; 
        aux.actionType = "Approve";
        aux.contextId = element.approvalId;
        aux.comments = "this record was approved";
        arrRequestObjects.push(aux);
      }
    });
    
    let status = await this.dataService.postData(arrRequestObjects, this.username.username);
    if (status === 'OK') {
      this.mensajes.forEach((element:any, index:number) => {
        if (element.mensaje.Id === id) {
          element.splice(index, 1);
        } 
      });
    }
    const toast = await this.toastController.create({
      message: 'Your opportunity was accepted',
      duration: 1500,
      color: 'success',
      cssClass: 'toastStyle'
    });
    toast.present();
    setTimeout(()=> this.getOpps(), 1500);
    this.gotoCards();
  }

  async rejectDetails(id: string) {
    let arrRequestObjects:Array < ObjectRequest > = [];
    this.mensajes.forEach((element:any) => {
      if (element.mensaje.Id === id) {
        let aux = {} as ObjectRequest; 
        aux.actionType = "Rejected";
        aux.contextId = element.approvalId;
        aux.comments = "this record was rejected";
        arrRequestObjects.push(aux);
      }
    });
    
    let status = await this.dataService.postData(arrRequestObjects, this.username.username);
    if (status === 'OK') {
      this.mensajes.forEach((element:any, index:number) => {
        if (element.mensaje.Id === id) {
          element.splice(index, 1);
        }
      });
    }
    const toast = await this.toastController.create({
      message: 'Your opportunity was rejected',
      duration: 1500,
      color: 'danger',
      cssClass: 'toastStyle'
    });
    toast.present();
    setTimeout(()=> this.getOpps(), 1500);
    this.gotoCards();
    
  }
  
  gotoCards() {
    this._router.navigateByUrl('/card');
  }
}



