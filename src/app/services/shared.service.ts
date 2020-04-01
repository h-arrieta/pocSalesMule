import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService{
    private data:any = undefined;
    constructor() { }

    setSharedData(data:any){
        this.data = data;
    }

    getSharedData():any{
        return this.data;
    }
}