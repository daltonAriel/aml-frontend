import { Component } from "@angular/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { NgxEchartsDirective, provideEchartsCore } from "ngx-echarts";

echarts.use([
  LineChart,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  TitleComponent,
  GridComponent,
]);

@Component({
  standalone: true,
  selector: "admin-empresas-transacciones",
  templateUrl: "./admin-empresas-transacciones.html",
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
})
export class AdminEmpresasTransacciones {
  option = {
    useUTC: true,

    grid: {
      left: 50,
      right: 20,
      top: 40,
      bottom: 40,
    },

    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderColor: "#e2e8f0",
      textStyle: {
        color: "#0f172a",
      },
      axisPointer: {
        type: "line",
        lineStyle: {
          type: "dashed",
          color: "#94a3b8",
        },
      },
    },

    xAxis: {
      type: "time",
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: "#cbd5e1" },
      },
      axisLabel: {
        color: "#94a3b8",
      },
      splitLine: { show: false },
    },

    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisLabel: {
        color: "#94a3b8",
      },
      splitLine: {
        lineStyle: {
          color: "#e2e8f0",
        },
      },
    },

    series: [
      {
        name: "Transacciones",
        type: "line",
        smooth: false,
        symbol: "none",

        // 🔥 línea verde profesional
        lineStyle: {
          width: 2.5,
          color: "#10b981", // emerald-500 (Tailwind)
        },

        // 🔥 gradient elegante hacia abajo
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(16, 185, 129, 0.35)", // arriba (más fuerte)
              },
              {
                offset: 1,
                color: "rgba(16, 185, 129, 0.02)", // abajo (casi transparente)
              },
            ],
          },
        },

        data: [
          ["2024-04-01", 1672],
          ["2024-04-02", 1565],
          ["2024-04-03", 1458],
          ["2024-04-04", 1049],
          ["2024-04-05", 1255],
          ["2024-04-06", 1768],
          ["2024-04-07", 1182],
          ["2024-04-08", 1176],
          ["2024-04-09", 1289],
          ["2024-04-10", 1702],
          ["2024-04-11", 1395],
          ["2024-04-12", 1708],
          ["2024-04-13", 1720],
          ["2024-04-14", 1512],
          ["2024-04-15", 1335],
          ["2024-04-16", 1122],
          ["2024-04-17", 1230],
          ["2024-04-18", 1118],
          ["2024-04-19", 1005],
          ["2024-04-20", 1590],
          ["2024-04-21", 1782],
          ["2024-04-22", 1068],
          ["2024-04-23", 1275],
          ["2024-04-24", 1160],
          ["2024-04-25", 1648],
          ["2024-04-26", 1455],
          ["2024-04-27", 1738],
          ["2024-04-28", 1225],
          ["2024-04-29", 1632],
          ["2024-04-30", 1645],
        ],
      },
    ],
  };
}
