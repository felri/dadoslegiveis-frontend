import { useCallback, useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { getRandomColor, compareDates, formatAsCurrency } from "@src/app/utils";
import type { JoyplotData } from "@src/app/types";
import "./style.css";

interface Props {
  data: JoyplotData;
  getDetails: (date: string, name: string) => void;
}

function JoyplotChart({ data, getDetails }: Props): JSX.Element {
  const ref = useRef<SVGSVGElement>(null);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const getOverlap = useCallback(() => {
    const length = data.series.length;
    if (length > 80) {
      return 8;
    }
    if (length > 60) {
      return 6;
    }
    if (length > 40) {
      return 4;
    }
    if (length > 7) {
      return 3;
    }
    return 2;
  }, [data.series.length]);

  const getHeigth = useCallback((): number => {
    return 50 * data.series.length + 150;
  }, [data.series.length]);

  const createScales = (
    data: JoyplotData,
    chartMargins: { top: number; right: number; bottom: number; left: number },
    chartWidth: number,
    chartHeight: number,
    overlap: number
  ) => {
    const xScale = d3
      .scaleTime()
      // @ts-ignore
      .domain(d3.extent(data.dates.map((d) => new Date(d))))
      .range([0, chartWidth - chartMargins.right])
      .nice();

    const yScale = d3
      .scalePoint()
      .domain(data.series.map((d) => d.name))
      .range([chartMargins.top, chartHeight - chartMargins.bottom]);

    const y2Scale = d3
      .scalePoint()
      .domain(
        data.series.map((d) =>
          formatAsCurrency(d.values.reduce((a, b) => a + b, 0))
        )
      )
      .range([chartMargins.top, chartHeight - chartMargins.bottom]);

    const zScale = d3
      .scaleLinear()
      // @ts-ignore
      .domain([0, d3.max(data.series, (d) => d3.max(d.values))])
      .range([0, -overlap * yScale.step()]);

    return { xScale, yScale, y2Scale, zScale };
  };

  const createAxes = (
    ref: React.RefObject<SVGSVGElement>,
    chartMargins: { top: number; right: number; bottom: number; left: number },
    chartWidth: number,
    xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScalePoint<string>,
    y2Scale: d3.ScalePoint<string>
  ) => {
    // @ts-ignore
    const xAxis = (g) =>
      g
        .attr("transform", `translate(0, 30)`)
        .attr("class", "x-axis")
        .call(
          d3
            .axisBottom(xScale)
            .ticks(chartWidth / 100)
            .tickSizeOuter(0)
        )
          // @ts-ignore
        .call((g) => g.select(".domain").remove());
    // @ts-ignore
    const yAxis = (g) =>
      g
        .attr("transform", `translate(${ chartWidth - chartMargins.right}, -15)`)
        .attr("class", "y-axis")
        .call(d3.axisRight(yScale).tickSizeOuter(0))
        // @ts-ignore
        .call((g) => g.select(".domain").remove());
    // @ts-ignore
    const yAxis2 = (g) =>
      g
        .attr("transform", `translate(${chartWidth - chartMargins.right},0)`)
        .attr("class", "y2-axis")
        .call(d3.axisRight(y2Scale).tickSizeOuter(0))
        // @ts-ignore
        .call((g) => g.select(".domain").remove());

    const svg = d3.select(ref.current);
    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    svg.append("g").call(yAxis2);

    return { xAxis, yAxis, yAxis2 };
  };

  const init = (data: JoyplotData) => {
    const chartHeight = getHeigth();
    const overlap = getOverlap();

    const chartMargins = { top: 120, right: 80, bottom: 30, left: 40 };
    const svg = d3.select(ref.current);
    const container = d3.select("#joyplot");

    // Get the bounding client rectangle of the SVG element
    const rect = ref?.current?.getBoundingClientRect();

    // Get the width of the SVG element
    const chartWidth = rect
      ? rect.width - chartMargins.left - chartMargins.right
      : 0;
    const domain = data.dates.map((d) => new Date(d));

    const scales = createScales(
      data,
      chartMargins,
      chartWidth,
      chartHeight,
      overlap
    );

    const xScale = scales.xScale;
    const yScale = scales.yScale;
    const y2Scale = scales.y2Scale;
    const zScale = scales.zScale;

    const axes = createAxes(
      ref,
      chartMargins,
      chartWidth,
      xScale,
      yScale,
      y2Scale
    );

    const xAxis = axes.xAxis;
    const yAxis = axes.yAxis;
    const yAxis2 = axes.yAxis2;

    const area = d3
      .area()
      .curve(d3.curveBasis)
      // @ts-ignore
      .defined((d) => !isNaN(d))
      .x((d, i) => xScale(domain[i]))
      .y0(0)
      // @ts-ignore
      .y1((d) => zScale(d));

    const line = area.lineY1();

    let tooltip = container.append("div").attr("class", "tooltip");


    let vertical = container
      .append("div")
      .attr("class", "vertical-line")
      .style("top", `${chartMargins.top + 514}px`)
      .style("height", `${chartHeight - chartMargins.top}px`);

    if(!isMobile) {
      svg
        .on("mouseover", function (event) {
          let position = d3.pointer(event, window);
          vertical
            .style("left", position[0] - 2 + "px")
            .style("visibility", "visible")
            .style("background", "#fff");
        })
        .on("mousemove", function (event) {
          let position = d3.pointer(event, window);
          vertical
            .style("left", position[0] - 2 + "px")
            .style("visibility", "visible")
            .style("background", "#fff");
        })
        .on("mouseout", function (event) {
          vertical
            .style("visibility", "invisible")
            .style("background", "transparent");
        })
        .on("click", function (event) {
          if (event.target.__data__ === undefined) return;

          let position = d3.pointer(event, window);
          let xInvert = xScale.invert(position[0]);
          let index = data.dates.findIndex((date) => compareDates(date, xInvert));

          if (index === -1) {
            index = data.dates.length - 1;
          }

          let name = event.target.__data__.name;
          let date = data.dates[index];

          getDetails(date, name);
        });
    } else {
      svg
      .on("click", function (event) {
        if (event.target.__data__ === undefined) return;

        let position = d3.pointer(event, window);
        let xInvert = xScale.invert(position[0]);
        let index = data.dates.findIndex((date) => compareDates(date, xInvert));

        if (index === -1) {
          index = data.dates.length - 1;
        }

        let name = event.target.__data__.name;
        let date = data.dates[index];

        getDetails(date, name);
      });
    }

    let group = svg
      .append("g")
      .selectAll("g")
      .data(data.series)
      .join("g")
      // @ts-ignore
      .attr("transform", (d) => `translate(0,${yScale(d.name)})`);

    group
      .append("path")
      .attr("fill", getRandomColor)
      .attr("opacity", 0.7)
      // @ts-ignore
      .attr("d", (d) => area(d.values))
      .on("mouseover", function (d) {
        // Show the tooltip
        tooltip.style("visibility", "visible");
      })
      .on("mousemove", function (d) {
        let position = d3.pointer(d, window);
        let xInvert = xScale.invert(position[0]);
        let i = data.dates.findIndex((date) => compareDates(date, xInvert));

        if (i === -1) {
          i = data.dates.length - 1;
        }

        let closestData = formatAsCurrency(d.target.__data__.values[i]);
        let date = data.dates[i];
        // sum the values of the array
        tooltip
          .style("left", position[0] + "px")
          .style("top", position[1] + "px").html(`
            <div>
              <p>${d.target.__data__.name}: ${closestData}</p>
              <p>${new Date(date).toLocaleDateString("pt-BR")}</p>
            </div>
          `);
      })
      .on("mouseout", function () {
        // Hide the tooltip
        tooltip.style("visibility", "hidden");
      });
    group
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#ddd")
      // @ts-ignore
      .attr("d", (d) => line(d.values));
  };

  useEffect(() => {
    d3.select(ref.current).selectAll("g, path").remove();
    d3.select("#joyplot").selectAll("div").remove();
    init(data);
  }, [data.series.length]);

  useEffect((): (() => void) => {
    d3.select(window).on("resize.updatesvg", handleResize);
    return () => d3.select(window).on("resize.updatesvg", null);
  }, [data.dates, data.series.length]);

  const handleResize = () => {
    d3.select(ref.current).selectAll("g, path").remove();
    d3.select("#joyplot").selectAll("div").remove();
    init(data);
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
      id="joyplot"
    >
      <svg
        ref={ref}
        style={{
          height: getHeigth(),
          minHeight: "100vh",
          width: "100%",
          marginRight: "0px",
          marginLeft: "0px",
        }}
      ></svg>
    </div>
  );
}

export default JoyplotChart;
