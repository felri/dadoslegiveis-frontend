import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { TreemapData } from "@src/features/treemap/slice";
import {
  getRandomColor,
  formatAsCurrency,
} from "@src/app/utils";

import "./style.css";

interface Props {
  data: TreemapData[];
  getDetails: (name: string) => void;
}

function BarplotChart({ data, getDetails }: Props): JSX.Element {
  const ref = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const init = () => {
    const margin = { top: 50, right: 100, bottom: 30, left: 150 };
    const svg = d3.select(ref.current);
    const container = d3.select("#joyplot");

    // Get the bounding client rectangle of the SVG element
    const rect = ref?.current?.getBoundingClientRect();

    // Get the width of the SVG element
    const width = rect ? rect.width - margin.left - margin.right : 0;
    const height = data.length * 30;

    const x = d3.scaleLinear().range([0, width]);

    const y: any = d3.scaleBand()
    .range([height, 0])
    .padding(0.1)

    const g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      

    x.domain([
      0,
      d3.max(data, function (d: any) {
        return d[1];
      }),
    ]);
    
    y.domain(
      data.map(function (d: any) {
        return d[0];
      })
    );

    // Start by creating the svg area
    let tooltip = container
      .append("div")
      .style("position", "absolute")
      .style("visibility", "invisible")
      .style("background-color", "#1a1a1a")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("top", "-100px")
      .style("z-index", "9999");


    g.append("g")
      .attr("class", "x axis")
      .style("font-size", "13px")
      .attr("transform", "translate(0, -20)")
      .call(d3.axisBottom(x).ticks(5));

    g.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y))
    .style("font-size", "12px")

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("opacity", 0.4)
      .attr("fill", function (d) {
        return getRandomColor();
      })
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("y", function (d: any) {
        return y(d[0]);
      })
      .attr("width", function (d: any) {
        return x(d[1]);
      })
      .on("mouseover", function () {
        // Show the tooltip
        tooltip.style("visibility", "visible");
      })
      .on("mousemove", function (d: any) {
        const total = formatAsCurrency(d.target.__data__[1]);
        const name = d.target.__data__[0];
        const rect = this.getBoundingClientRect();
        tooltip
          .style("left", d.screenX + 20 + "px")
          .style("top", rect.top + "px").html(`
            <div>
              <p>${name}</p>
              <p>${total}</p>
            </div>
          `);
      })
      .on("mouseout", function () {
        // Hide the tooltip
        tooltip.style("visibility", "hidden");
      })
      .on(("click"), function (d) {
        getDetails(d.target.__data__[0])
      })
  };

  useEffect(() => {
    handleResize();
  }, [data]);

  useEffect((): () => void => {
    d3.select(window).on("resize.updatesvg", handleResize);
    return () => d3.select(window).on("resize.updatesvg", null);
  }, [data]);

  const handleResize = () => {
    d3.select(ref.current).selectAll("text, rect").remove();
    init();
  };

  return (
    <div
      style={{
        height: data.length * 30,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      ref={containerRef}
      id="joyplot"
    >
      <svg
        ref={ref}
        style={{
          height: "100%",
          width: "100%",
          marginRight: "0px",
          marginLeft: "0px",
        }}
      ></svg>
    </div>
  );
}

export default BarplotChart;
