// @ts-nocheck
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { TreemapData } from "@src/app/types";
import { getRandomColor, shortenExpenses, formatAsCurrency } from "@src/app/utils";
import "./style.css";

interface Props {
  data: TreemapData[];
  getDetails?: (date: string, name: string) => void;
}

function MyJoyplot({ data, getDetails }: Props): JSX.Element {
  const ref = useRef<SVGSVGElement>(null);

  const init = () => {
    const margin = { top: 120, right: 50, bottom: 30, left: 40 };
    const svg = d3.select(ref.current);

    // Get the bounding client rectangle of the SVG element
    const rect = ref.current.getBoundingClientRect();

    // Get the width of the SVG element
    const width = rect.width;
    const height = rect.height - margin.top - margin.bottom;

    let hierarchy = {
      name: "Expenses",
      children: [],
    };

    data.forEach((expense) => {
      return hierarchy.children.push({
        name: expense[0],
        value: expense[1],
        count: expense[2],
      });
    });

    const root = d3.hierarchy(hierarchy)
      .sum(d => d.value);

    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
      .size([width, height])
      .padding(2)
      .round(true)
      (root)
  
    // use this information to add rectangles:
    svg
      .selectAll("rect")
      .data(root.leaves())
      .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("overflow", "hidden")
        .style("fill", getRandomColor)
        .style("opacity", "0.4")
        .style("opacity", "0.8")

                
      // and to add the text labels
    svg
      .selectAll("text.name")
      .data(root.leaves())
      .enter()
      .append("text")
        .attr("x", (d) => d.x0+5)    // +10 to adjust position (more right)
        .attr("y", (d) => d.y0+45)    // +20 to adjust position (lower)        
        .text((d) => formatAsCurrency(d.data.value))
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif")
        .style("stroke", "grey")
        .style("stroke-width", "1px")
        .attr("fill", "white")
        
  
    // and to add the text labels
    svg
      .selectAll("text.value")
      .data(root.leaves())
      .enter()
      .append("text")
        .attr("x", (d) => d.x0+5)    // +10 to adjust position (more right)
        .attr("y", (d) => d.y0+20)    // +20 to adjust position (lower)        
        .text((d) => shortenExpenses(d.data.name))
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif")

        .style("stroke", "grey")
        .style("stroke-width", "1px")
        .attr("fill", "white")

    const rects = d3.selectAll("rect")
    // Add a mouseover event to the rectangles
    rects.on("mouseover", function() {
      // Get the current rectangle element
      const rect = d3.select(this)
      // Change the fill color of the rectangle to indicate a hover
      rect.transition()
      .duration(200)
      .style("filter", "brightness(1.2)")
    })

    // Add a mouseout event to the rectangles
    rects.on("mouseout", function() {
      // Get the current rectangle element
      const rect = d3.select(this)
      // Reset the fill color of the rectangle
      rect.transition()
      .duration(200)
      .style("filter", "brightness(1)")
    })

    rects.on("click", function(d) {
      const name = d.target.__data__.data.name
      getDetails(name)
    })

  };

  useEffect(() => {
    handleResize();
  }, [data]);

  useEffect(() => {
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
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
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

export default MyJoyplot;
