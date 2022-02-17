import { Injectable } from '@angular/core';
import { Observable,throwError,Subject } from 'rxjs';
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {CommoninfoBinding,MeasurementBinding } from './model/binding';

@Injectable({
  providedIn: 'root'
})
export class SparqlService {
  //apis
  commoninfoApi:string= "https://api.labs.kadaster.nl/queries/jiarong-li2/data-waarde-getCommonInfo/run";
  keywordsApi: string= "https://api.labs.kadaster.nl/queries/jiarong-li2/data-waarde-getKeywords/run";
  themesApi: string="https://api.labs.kadaster.nl/queries/jiarong-li2/data-waarde-getTheme/run";
  licensesApi: string="https://api.labs.kadaster.nl/queries/jiarong-li2/Query-7/run";
  provenanceApi: string="https://api.labs.kadaster.nl/queries/jiarong-li2/Query-8/run";
  measurementWmsApi: string="https://api.labs.kadaster.nl/queries/jiarong-li2/Query-6/run"+"?Service=wms";
  measurementWfsApi: string="https://api.labs.kadaster.nl/queries/jiarong-li2/Query-6/run"+"?Service=wfs";;
  apihhitsWmsApi: string="https://api.labs.kadaster.nl/queries/jiarong-li2/data-waarde-getApiHits/run"+"?Service=wms";
  apihhitsWfsApi: string="https://api.labs.kadaster.nl/queries/jiarong-li2/data-waarde-getApiHits/run"+"?Service=wfs";
  //subject objects
  commonInfo$ = new Subject<CommoninfoBinding>();
  keywords$=new Subject<any[]>();
  themes$=new Subject<any[]>();
  licenses$=new Subject<any[]>();
  provenance$=new Subject<any>();
  measurementWms$=new Subject<MeasurementBinding>(); 
  measurementWfs$=new Subject<MeasurementBinding>();
  apihitsWms$=new Subject<any>();
  apihitsWfs$=new Subject<any>();

  constructor(private http: HttpClient) { }
  
  // http request methods
  getSingleQueryResult(queryApi:string): Observable<any> {
    return this.http.get<any>(queryApi, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/sparql-results+json"
      }
    }).pipe(
      map(result => result.results.bindings[0]),
    )
  };

  getMultiQueryResult(queryApi:string): Observable<any[]> {
    return this.http.get<any>(queryApi, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/sparql-results+json"
      }
    }).pipe(
      map(result => result.results.bindings),
    )
  };
  getApiHitsQueryResult(queryApi:string): Observable<any[]> {
    return this.http.get<any>(queryApi, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/sparql-results+json"
      }
    }).pipe(
      map(result => this.ApihitsProcessing(result.results.bindings))
    )
  };

  ApihitsProcessing(apiBinding:any[]):any[]{
    let apiTimeValue=apiBinding.map(tvPair => {
      let nameValue={
        "name":tvPair.time.value,
        "value":tvPair.value.value
      };
      return nameValue
    })
    let res=[{
      "name":"api hits",
      "series":apiTimeValue

    }]
    return res;
  }
  
  //get data
  getCommoninfo(){
    this.getSingleQueryResult(this.commoninfoApi).subscribe(data=>this.commonInfo$.next(data));
  }

  getKeywords(){
    this.getMultiQueryResult(this.keywordsApi).subscribe(data=>this.keywords$.next(data));
  }
  
  getThemes() {
    this.getMultiQueryResult(this.themesApi).subscribe(data=>this.themes$.next(data));
  }

  getLicenses() {
    this.getMultiQueryResult(this.licensesApi).subscribe(data=>this.licenses$.next(data));
  }

  getProvenance(){
    this.getSingleQueryResult(this.provenanceApi).subscribe(data=>this.provenance$.next(data));
  }
  
  getMeasurement(){
    this.getSingleQueryResult(this.measurementWmsApi).subscribe(data=>this.measurementWms$.next(data));
    this.getSingleQueryResult(this.measurementWfsApi).subscribe(data=>this.measurementWfs$.next(data));
  }

  getApihits(){
    this.getApiHitsQueryResult(this.apihhitsWmsApi).subscribe(data=>this.apihitsWms$.next(data));
    this.getApiHitsQueryResult(this.apihhitsWfsApi).subscribe(data=>this.apihitsWfs$.next(data));
  }
}
