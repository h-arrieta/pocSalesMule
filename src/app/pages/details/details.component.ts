import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
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
  mensaje: any;
  location: any;
  username: any;

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
  alterDescriptionText() {
     this.showShortDesciption = !this.showShortDesciption;
  }

  getCardById(id: string): any {
 return this.mensajes.find(opp => opp.opportunity.Id === id);
}




async presentToastReject() {
  const toast = await this.toastController.create({
    message: 'Your opportunity was rejected',
    duration: 1500,
    color: 'danger',
    cssClass: 'toastStyle'

  });
  toast.present();
  this._router.navigateByUrl('/card');
  }



  async presentToastAccept() {
    const toast = await this.toastController.create({
      message: 'Your opportunity was accepted',
      duration: 1500,
      color: 'success',
      cssClass: 'toastStyle'
    });
    toast.present();
    this._router.navigateByUrl('/card');
    }
}


