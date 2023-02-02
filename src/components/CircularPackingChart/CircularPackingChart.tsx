import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { CircularPackingData } from "@src/app/types";
import { colorsParties, formatAsCurrency } from "@src/app/utils";

import "./style.css";
import Confetti from "../Confetti/Confetti";

interface Props {
  data: CircularPackingData[];
  getDetails: (name: string) => void;
  bigBang: number;
}

function CircularPackingChart({
  data,
  getDetails,
  bigBang,
}: Props): JSX.Element {
  const ref = useRef<SVGSVGElement>(null);
  const [simulation, setSimulation] = useState(null);
  const [touchedOtherCircles, setTouched] = useState(false);
  const [touchedCenter, setTouchedCenter] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerCircleSvg, setCenterCircleSvg] = useState(null);

  const handleMouseOverCenterUniverse = () => {
    setTouchedCenter(true);
  };

  const init = () => {
    const newData = data.map((d) => {
      return {
        group: d.group,
        name: d.name,
        total: d.total,
        color: colorsParties[d.party],
        party: d.party,
      };
    });

    const margin = { top: 20, right: 10, bottom: 30, left: 10 };
    const svg = d3.select(ref.current);
    const container = d3.select("#circular-packing");
    let tooltip = container.append("div").attr("class", "tooltip");

    // Get the bounding client rectangle of the SVG element
    const rect = ref.current.getBoundingClientRect();

    // Get the width of the SVG element
    const width = rect.width;
    const height = rect.height - margin.top - margin.bottom;
    const max = d3.max(data, (d) => d.total);
    const min = d3.min(data, (d) => d.total);
    const size = d3.scaleLinear().domain([min, max]).range([1, 30]);

    // get random position but never the same and never too close to one another
    const getRandomPosition = () => {
      return Math.floor(Math.random() * 1000);
    };

    const xDomain = data.map((d) => d.group);
    const xRange = xDomain.map((d) => getRandomPosition());

    // A scale that gives a X target position for each group
    const x = d3.scaleOrdinal().domain(xDomain).range(xRange);

    let centerCircle = svg
      .append("g")
      .attr("class", "center-circle")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .append("circle")
      .attr("r", 100)
      .style("fill", "orange")
      .style("stroke", "black")
      .style("stroke-width", 2)
      .on("mouseover", handleMouseOverCenterUniverse);

    centerCircle
      .transition()
      .duration(4000)
      .ease(d3.easeSin)
      .attr("r", 90)
      .style("filter", "brightness(1.2)")
      .transition()
      .duration(1000)
      .ease(d3.easeSin)
      .attr("r", 100)
      .style("filter", "brightness(1)")
      .on("end", function repeat() {
        d3.select(this)
          .transition()
          .duration(4000)
          .ease(d3.easeSin)
          .attr("r", 80)
          .style("filter", "brightness(1.2)")
          .transition()
          .duration(2000)
          .ease(d3.easeSin)
          .attr("r", 100)
          .style("filter", "brightness(1)")
          .on("end", repeat);
      });

    setCenterCircleSvg(centerCircle);

    let node = svg
      .append("g")
      .selectAll("circle")
      .data(newData)
      .join("circle")
      .attr("r", function (d) {
        return size(d.total);
      })
      .attr("cx", getRandomPosition())
      .attr("cy", getRandomPosition())
      .style("fill", (d) => d.color)
      .attr("stroke", "black")
      .style("stroke-width", 2)
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut)
      .on("click", onMouseClick);
    // .call(
    //   d3
    //     .drag() // call specific function when circle is dragged
    //     .on("start", dragstarted)
    //     .on("drag", dragged)
    //     .on("end", dragended)
    // );

    // Features of the forces applied to the nodes:
    let simulation = d3
      .forceSimulation()
      // .force(
      //   "x",
      //   d3
      //     .forceX()
      //     .x((d) => x(d.group))
      // )
      // .force(
      //   "y",
      //   d3
      //     .forceY()
      //     .y(height / 2)
      // )
      .force(
        "center",
        d3
          .forceCenter()
          .x(width / 2)
          .y(height / 2)
      ) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(0.9)) // Nodes are attracted one each other of value is > 0
      .force(
        "collide",
        d3.forceCollide().strength(0.1).radius(bigBang).iterations(1)
      ); // Force that avoids circle overlapping
    setSimulation(simulation);
    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation.nodes(newData).on("tick", function (d) {
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    // What happens when a circle is dragged?
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0.03);
      d.fx = null;
      d.fy = null;
    }

    function onMouseOver(event, d) {
      setTouched(true);
      d3.select(this).style("fill", "black");
      tooltip.style("display", "block");
      tooltip.style("left", event.pageX + 10 + "px");
      tooltip.style("top", event.pageY + 10 + "px");
      tooltip.html(`
        <div class="tooltip-container">
          <div class="tooltip-circle" style="background-color: ${
            d.color
          }"></div>
          <p>${d.party}</p>
          <p>${d.name}</p>
          <p>${formatAsCurrency(d.total)}</p>
        </div>
      `);
    }

    function onMouseOut(event, d) {
      d3.select(this).style("fill", d.color);
      tooltip.style("display", "none");
    }

    function onMouseClick(event, d) {
      getDetails(d.name);
    }
  };

  const clean = () => {
    d3.select(ref.current).selectAll("text, rect, g, circle").remove();
    simulation && simulation.stop();
  };

  const gameOver = () => {
    centerCircleSvg
      .transition()
      .duration(400)
      .ease(d3.easeSin)
      .attr("r", 200)
      .transition()
      .duration(200)
      .ease(d3.easeSin)
      .attr("r", 0);
  };

  useEffect(() => {
    if (touchedOtherCircles && centerCircleSvg) {
      gameOver();
    } else if (touchedCenter && centerCircleSvg) {
      gameOver();
      setTimeout(() => {
        d3.select(ref.current).select(".center-circle").remove();
      }, 1000);
    }
  }, [touchedOtherCircles, touchedCenter, centerCircleSvg]);

  useEffect(() => {
    handleResize();
    setTouched(false);
    setTouchedCenter(false);
  }, [data, bigBang]);

  useEffect((): (() => void) => {
    d3.select(window).on("resize.updatesvg", handleResize);
    return () => {
      d3.select(window).on("resize.updatesvg", null);
      clean();
    };
  }, [data]);

  const handleResize = () => {
    clean();
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
      ref={containerRef}
      id="circular-packing"
    >
      {touchedCenter && <Confetti />}
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

export default CircularPackingChart;
