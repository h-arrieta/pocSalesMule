import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  mensajes: any[] = [];
  mensaje: any;
  location: any;

  constructor(private dataService: DataService, private route: ActivatedRoute) {}
  showShortDesciption = true;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("Esto es el ID",id);
      // tslint:disable-next-line: align
      this.dataService.getData()
      .subscribe( (posts: any[]) => {
        this.mensajes = posts;
        //aqui es donde hacemos la seleccion que corresponda con el id
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

}
