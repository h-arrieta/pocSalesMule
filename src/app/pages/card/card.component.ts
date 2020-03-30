import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ObjectRequest, CardData, TreatCard } from '../../models/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  constructor( 
    private dataService: DataService,
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

  ngOnInit() {
    // tslint:disable-next-line: align
    this.dataService.getData()
    .subscribe( (post: Array<CardData>) => {
      this.messages = post;
      this.opportunities();
      // this.z();
    });
  }

  opportunities() {
    this.messages.forEach((element: CardData) => {
      let auxObj = {} as TreatCard;
      auxObj.cardData = element;
      auxObj.isTreated = false;
      this.displayCards.push(auxObj);
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


accept() {
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
  this.dataService.postData(arrRequestObjects);
}

reject() {
  let arrRequestObjects:Array < ObjectRequest > = [];
  this.displayCards.forEach((element:TreatCard) => {
    if (element.isTreated === true) {
      let aux = {} as ObjectRequest; 
      aux.actionType = "Reject";
      aux.contextId = element.cardData.approvalId;
      aux.comments = "this record was rejected";
      arrRequestObjects.push(aux);
    }
  });
  this.dataService.postData(arrRequestObjects);

}

// goDetails(term:string) {
//   this.router.navigate(['search', {term: term}]);


// }
}
