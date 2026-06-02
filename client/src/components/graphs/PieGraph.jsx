import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Label, Pie, PieChart as RechartsPieChart } from "recharts";

const PieGraph = ({ pieConfig, pieData, totalUsers }) => {
  return (
    <ChartContainer
      config={pieConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <RechartsPieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={pieData}
          dataKey="count"
          nameKey="user"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalUsers}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Users
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  );
};

export default PieGraph;
