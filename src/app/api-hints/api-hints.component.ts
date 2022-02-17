import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { scaleOrdinal } from 'd3';
import {SparqlService} from '../sparql.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-api-hints',
  templateUrl: './api-hints.component.html',
  styleUrls: ['./api-hints.component.css']
})
export class ApiHintsComponent implements OnInit {
  results$: Subject<any>;
  view: [number,number] = [330, 320];

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Time';
  yAxisLabel: string = 'Value';
  timeline: boolean = true;

  colorScheme:string|Color={
    name: "exampleName",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#b4520c','','#b547b1c','#ab2218']
  };

  constructor(public sparql: SparqlService) {
    this.results$ = this.sparql.apihitsWfs$
    
  }
  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  ngOnInit(): void {
    this.sparql.getApihits();
    this.sparql.apihitsWms$.subscribe(results => {
      console.log("api", results);
    })
    
  
  }

}
