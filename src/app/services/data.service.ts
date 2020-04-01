import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ObjectRequest } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  getData(user:string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get('http://techedge-sys-sfdcoppapprovals-v1.ir-e1.cloudhub.io/opportunity/approvals?principal=' + user);
  }
  // hay que hacerlo de modo dinámico
  postData(reqArr: Array<ObjectRequest>) {
    // tslint:disable-next-line: max-line-length
    // return this.http
    // .post<any>('http://techedge-sys-sfdcoppapprovals-v1.ir-e1.cloudhub.io/opportunity/aprove?principal=luis.zarzo@techedgegroup.com.poc', {
    //   'requests': reqArr
    // }).subscribe(data => { console.log(data); });
    return "Hola";
  }

  // postData() {
  //       // tslint:disable-next-line: max-line-length
  //       return this.http.post('http://techedge-sys-sfdcoppapprovals-v1.ir-e1.cloudhub.io/opportunity/aprove?principal=luis.zarzo@techedgegroup.com.poc',
  //         {
  //           'requests': [
  //               {
  //                   'actionType': 'Approve',
  //                   'contextId': '04i3X00000CLsvkQAD',
  //                   'comments': 'this record is approved'
  //               }
  //           ]
  //       }
  //       ) .subscribe(data => { console.log(data); });


  // }
}


// this.http.post<any>('https://jsonplaceholder.typicode.com/posts', { title: 'Angular POST Request Example' }).subscribe(data => { this.postId = data.id; })
