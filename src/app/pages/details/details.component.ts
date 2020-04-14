import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ObjectRequest, CardData, TreatCard, Opportunity } from '../../models/models';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  mensajes: any[] = [];
  mensaje: CardData;
  location: any;
  username: any;
  displayCards: Array<TreatCard> = [];
  messages: Array<CardData> = [];
  router: any;

  // tslint:disable-next-line: variable-name
  // tslint:disable-next-line: max-line-length
  constructor(private dataService: DataService, private route: ActivatedRoute, private _shareService: SharedService,  private _router: Router, public toastController: ToastController) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Esto es el ID', id);
      // tslint:disable-next-line: align
      this.username = this._shareService.getSharedData();
    this.dataService.getData(this.username.username)
      .subscribe( (posts: any[]) => {
        this.mensajes = posts;
        // aqui es donde hacemos la seleccion que corresponda con el id
        console.log('ESTO SON MENSAJES', this.mensajes);
        this.mensaje = this.getCardById(id);
        console.log('ESTO ES EL MENSAJE', this.mensaje);
      });
    }

  getCardById(id: string): any {
   return this.mensajes.find(opp => opp.opportunity.Id === id);
  }

  opportunities() {
    if (this.mensajes.length > 0) {
      this.mensajes.forEach((element: CardData) => {
        const auxObj = {} as TreatCard;
        auxObj.cardData = element;
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

  // async acceptDetails() {
  //   const arrRequestObjects: Array < ObjectRequest > = [];
  //   const aux = {
  //     actionType : 'Approve',
  //     contextId : this.mensaje.approvalId,
  //     comments : 'this record was approved'
  //     };
  //   arrRequestObjects.push(aux);
  //   console.log(arrRequestObjects);


  //   const status = await this.dataService.postData(arrRequestObjects, this.username.username);
  //   if (status === 'OK') {
  //     const toast = await this.toastController.create({
  //       message: 'Your opportunity was accepted successfully',
  //       duration: 1500,
  //       color: 'success',
  //       cssClass: 'toastStyle'
  //     });
  //     toast.present();
  //     setTimeout(() => this.gotoCards(), 2000);
  //   } else {
  //     const toast = await this.toastController.create({
  //       message: 'Upps.. Something went wrong',
  //       duration: 1500,
  //       color: 'warning',
  //       cssClass: 'toastStyle'
  //     });
  //     toast.present();
  //   }
  // }

  acceptDetails() {
    const arrRequestObjects: Array < ObjectRequest > = [];
    const aux = {
      actionType : 'Approve',
      contextId : this.mensaje.approvalId,
      comments :  'this record was approved'
      };
    arrRequestObjects.push(aux);
    console.log(arrRequestObjects);

    this.dataService.postData(arrRequestObjects, this.username.username).subscribe( response => {
      if (response.statusSalesforce === 200) { 
        this.showToast('Your opportunity was accepted successfully', 'success');
        setTimeout(() => this.gotoCards(), 2000);
      } else {
        this.showToast('Upps.. Something went wrong', 'warning');
      }
    });
  }



  rejectDetails() {
    const arrRequestObjects: Array < ObjectRequest > = [];
    const aux = {
      actionType : 'Reject',
      contextId : this.mensaje.approvalId,
      comments : 'this record was rejected'
      };
    arrRequestObjects.push(aux);
    console.log(arrRequestObjects);

    this.dataService.postData(arrRequestObjects, this.username.username).subscribe( response => {
      if (response.statusSalesforce === 200) { 
        this.showToast('Your opportunity was rejected successfully', 'danger');
        setTimeout(() => this.gotoCards(), 2000);
      } else {
        this.showToast('Upps.. Something went wrong', 'warning');
      }
    });
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

  gotoCards() {
    this._router.navigateByUrl('/card');
  }
}



