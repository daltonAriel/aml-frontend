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
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "60%",
        data: [
          { value: 3, name: "Cajero" },
          { value: 4, name: "Administracion" },
          { value: 2, name: "Oficial de Cumplimiento" },
          { value: 1, name: "Coordinador" },
          { value: 5, name: "Servicio al Cliente" },
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
