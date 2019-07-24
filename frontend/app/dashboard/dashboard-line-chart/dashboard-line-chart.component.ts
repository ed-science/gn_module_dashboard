import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
// Services
import { DataService } from "../services/data.services";

@Component({
  selector: "dashboard-line-chart",
  templateUrl: "dashboard-line-chart.component.html",
  styleUrls: ['./dashboard-line-chart.component.scss']
})

export class DashboardLineChartComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  public nbFrameworks: any;
  public adjustedData = [];
  public lineChartType = 'line';
  public lineChartLabels = [];
  public lineChartData = [];
  public lineChartColors = [
    {
      backgroundColor: "rgba(217,146,30, 0.7)",
      borderColor: "rgb(217,146,30)"
    },
    {
      backgroundColor: "rgba(119,163,53,0.7)",
      borderColor: "rgb(119,163,53)"
    },
    {
      backgroundColor: "rgba(43,132,183,0.7)",
      borderColor: "rgb(43,132,183)"
    },
    {
      backgroundColor: "rgba(205,60,60,0.7)",
      borderColor: "rgb(205,60,60)"
    },
    {
      backgroundColor: "rgba(134,83,183,0.7)",
      borderColor: "rgb(134,83,183)"
    },
    {
      backgroundColor: "rgba(235,188,32,0.7)",
      borderColor: "rgb(235,188,32)"
    },
    {
      backgroundColor: "rgba(59, 149, 149,0.7)",
      borderColor: "rgb(59, 149, 149)"
    },
    {
      backgroundColor: "rgba(161, 44, 86,0.7)",
      borderColor: "rgb(161, 44, 86)"
    },
    {
      backgroundColor: "rgba(46,86,150,0.7)",
      borderColor: "rgb(46,86,150)"
    },
    {
      backgroundColor: "rgba(212,126,198,0.7)",
      borderColor: "rgb(212,126,198)"
    },
    {
      backgroundColor: "rgba(129,86,53,0.7)",
      borderColor: "rgb(129,86,53)"
    },
    {
      backgroundColor: "rgba(61,127,60,0.7)",
      borderColor: "rgb(61,127,60)"
    },
    {
      backgroundColor: "rgba(204,98,44,0.7)",
      borderColor: "rgb(204,98,44)"
    },
    {
      backgroundColor: "rgba(132,132,132,0.7)",
      borderColor: "rgb(132,132,132)"
    },
    {
      backgroundColor: "rgba(190,195,77,0.7)",
      borderColor: "rgb(190,195,77)"
    },
    {
      backgroundColor: "rgba(97,187,223,0.7)",
      borderColor: "rgb(97,187,223)"
    },
    {
      backgroundColor: "rgba(224,186,140,0.7)",
      borderColor: "rgb(224,186,140)"
    },
    {
      backgroundColor: "rgba(169,45,152,0.7)",
      borderColor: "rgb(169,45,152)"
    },
    {
      backgroundColor: "rgba(94, 207, 178,0.7)",
      borderColor: "rgb(94, 207, 178)"
    },
    {
      backgroundColor: "rgba(66,81,126,0.7)",
      borderColor: "rgb(66,81,126)"
    },
    {
      backgroundColor: "rgba(101,33,33,0.7)",
      borderColor: "rgb(101,33,33)"
    },
    {
      backgroundColor: "rgba(117,112,56,0.7)",
      borderColor: "rgb(117,112,56)"
    },
    {
      backgroundColor: "rgba(191,158,46,0.7)",
      borderColor: "rgb(191,158,46)"
    },
    {
      backgroundColor: "rgba(147,75,75,0.7)",
      borderColor: "rgb(147,75,75)"
    },
    {
      backgroundColor: "rgba(64,64,64,0.7)",
      borderColor: "rgb(64,64,64)"
    },
    {
      backgroundColor: "rgba(169,130,211,0.7)",
      borderColor: "rgb(169,130,211)"
    },
    {
      backgroundColor: "rgba(51,102,82,0.7)",
      borderColor: "rgb(51,102,82)"
    },
    {
      backgroundColor: "rgba(245,133,120,0.7)",
      borderColor: "rgb(245,133,120)"
    },
    {
      backgroundColor: "rgba(167,110,33,0.7)",
      borderColor: "rgb(167,110,33)"
    },
    {
      backgroundColor: "rgba(229,226,222,0.7)",
      borderColor: "rgb(229,226,222)"
    }
  ];
  public lineChartOptions = {
    responsive: true,
    legend: {
      display: 'true',
      position: 'left',
      labels: {
        fontSize: 15
      }
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Années'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: "Nombre d'observations",
          fontSize: 16
        }
      }]
    }
  };
  public lineChartLegend = true;

  public spinner = false;

  constructor(public dataService: DataService, public fb: FormBuilder) { }

  ngOnInit() {
    this.spinner = true;
    // Accès aux années distinctes présentes dans la BDD GeoNature
    this.dataService.getYears({ type: "distinct" }).subscribe(
      (data) => {
        this.lineChartLabels.length = 0;
        // Remplissage de l'array des labels, paramètre du line chart
        data.forEach(
          (elt) => {
            this.lineChartLabels.push(elt[0]);
          }
        );
        // console.log(this.lineChartLabels);

        // Accès aux données de synthèse de la BDD GeoNature
        this.dataService.getDataFrameworks().subscribe(
          (data) => {
            // console.log(data);
            var dataLength = data.length;
            var firstElt = 0;
            // On parcourt l'array des données renvoyées par l'API pour les séparer selon leur cadre d'acquisition
            for (var i = 1; i < dataLength; i++) {
              if (data[i][0] != data[i - 1][0]) {
                var framework = data.slice(firstElt, i);
                this.adjustedData.push(framework);
                // console.log(framework);
                var firstElt = i;
              }
              if (i == dataLength - 1) {
                var framework = data.slice(firstElt, i + 1);
                this.adjustedData.push(framework);
                // console.log(framework);
              }
            }
            // console.log(this.adjustedData);
            this.nbFrameworks = this.adjustedData.length; // Nécessaire pour afficher le line chart (voir html)
            // Initialisation de l'array des données à afficher, paramètre du line chart
            var lineChartDataTemp = [];
            // Remplissage de l'array des données en fonction du cadre d'acquisition, en tenant compte du fait qu'il peut n'y avoir aucune observation pour certaines années
            this.adjustedData.forEach(
              (framework) => {
                // Initialisation du dictionnaire de données relatif à un cadre d'acquisition (à ajouter à l'array)
                var frameworkDataTemp = { data: [], label: framework[0][0], fill: false };
                var frameworkLength = framework.length;
                var start = 0;
                this.lineChartLabels.forEach(
                  (year) => {
                    var i = start;
                    var keepGoing = true;
                    while ((i < frameworkLength) && (keepGoing == true)) {
                      if (year == framework[i][1]) {
                        frameworkDataTemp.data.push(framework[i][2]);
                        keepGoing = false;
                        start = i + 1;
                      }
                      i += 1;
                    }
                    if (keepGoing == true) {
                      frameworkDataTemp.data.push(0);
                    }
                  }
                );
                // Ajout du jeu de données (dictionnaire relatif à un cadre d'acquisition) à l'array des données, paramètre du line chart
                lineChartDataTemp.push(frameworkDataTemp);
                // console.log(lineChartDataTemp);
              }
            )
            this.lineChartData = lineChartDataTemp;
            this.spinner = false;
          }
        );
      }
    );

  }

}
