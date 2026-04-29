import { Component } from "@angular/core";
import { PieChart } from "echarts/charts";
import { LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { NgxEchartsDirective, provideEchartsCore } from "ngx-echarts";

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

@Component({
  standalone: true,
  selector: "admin-grafica-usuarios-areas",
  templateUrl: "./admin-grafica-usuarios-areas.html",
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
})
export class AdminGraficaUsuariosArea {
  option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "horizontal",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "60%",
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
}
