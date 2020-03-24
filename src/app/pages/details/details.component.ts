import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  mensajes: any[] = [];


  constructor(private dataService: DataService) {}
  showShortDesciption = true;
  ngOnInit() {
      // tslint:disable-next-line: align
      this.dataService.getData()
      .subscribe( (posts: any[]) => {
        this.mensajes = posts;
      });
  
    }
  alterDescriptionText() {
     this.showShortDesciption = !this.showShortDesciption;
  }
}
