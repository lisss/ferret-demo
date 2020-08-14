import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import './Chart.css';
import DatePicker from 'react-datepicker';
// @ts-ignore
import data from './data/SalesJan2009.csv';

import 'react-datepicker/dist/react-datepicker.css';
import { Header } from './Header';

interface Order {
  [key: string]: string;
}

interface Sales {
  paymentSystem: string;
  count: number;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const mapdata = (data: d3.DSVRowArray<string>): Order[] => {
  return (data as unknown) as Order[];
};

export const Chart = ({ width, height }: { width: number; height: number }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  const [salesDataRaw, setSalesDataRaw] = useState<Order[]>([]);
  const [salesDataGrouped, setSalesDataGrouped] = useState<Sales[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    d3.csv(data).then(mapdata).then(setSalesDataRaw);
  }, [dateRange, data]);

  useEffect(() => {
    const dataFiltered = salesDataRaw.filter((x) => {
      const date = new Date(x['Transaction_date']);
      return date >= dateRange.startDate! && date <= dateRange.endDate!;
    });

    const groupedData = dataFiltered.reduce<{ [key: string]: Order[] }>(
      (prev, curr) => {
        prev[curr['Payment_Type']] = (prev[curr['Payment_Type']] || []).concat(
          curr
        );
        return prev;
      },
      {}
    );
    const salesTransformed = Object.keys(groupedData).map((x) => ({
      paymentSystem: x,
      count: groupedData[x].length,
    }));

    setSalesDataGrouped(salesTransformed);
  }, [salesDataRaw, dateRange]);

  const selectStartDate = useCallback(
    (date: Date) => {
      setDateRange({
        ...dateRange,
        startDate: date,
      });
    },
    [dateRange]
  );

  const selectEndDate = useCallback(
    (date: Date) => {
      setDateRange({
        ...dateRange,
        endDate: date,
      });
    },
    [dateRange]
  );

  useEffect(() => {
    const salesDatesOrdered = salesDataRaw
      .map((x) => new Date(x['Transaction_date']))
      .sort();

    if (!dateRange.startDate && !dateRange.endDate) {
      setDateRange({
        startDate: salesDatesOrdered[0],
        endDate: salesDatesOrdered[salesDatesOrdered.length - 1],
      });
    }
  }, [salesDataRaw]);
  function responsivefy(svg: any) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style('width')),
      height = parseInt(svg.style('height')),
      aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize);

    // to register multiple listeners for same event type,
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on('resize.' + container.attr('id'), resize);

    // get width of container and resize svg to fit it
    function resize() {
      var targetWidth = parseInt(container.style('width'));
      svg.attr('width', targetWidth);
      svg.attr('height', Math.round(targetWidth / aspect));
    }
  }

  useEffect(() => {
    const data = salesDataGrouped;
    const radius = Math.min(width, height) / 2;

    const pie = d3.pie<Sales>().value((d) => {
      return d.count;
    });
    const margin = { top: 10, right: 25, bottom: 35, left: 25 };

    const slices = pie(data);
    const arc = d3.arc<any>().innerRadius(0).outerRadius(radius);
    const colors = ['#6baed6', '#fd8d3c', '#74c476', '#756bb1'];
    const color = d3.scaleOrdinal(colors);
    const svg = d3
      .select(ref.current)
      .attr('width', width - margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .call(responsivefy);
    const g = svg
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .attr('class', 'ssvg');

    const arcGraph = g.selectAll('path.slice').data(slices).enter();
    arcGraph
      .append('path')
      .attr('class', 'slice')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.paymentSystem));

    arcGraph
      .append('text')
      .attr('transform', (d) => 'translate(' + arc.centroid(d) + ')')
      .attr('dx', '-0.5em')
      .text((d) => d.data.count)
      .attr('fill', '#fff')
      .attr('font-size', '0.875rem');

    svg
      .append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(slices)
      .enter()
      .append('text')
      .text((d) => '• ' + d.data.paymentSystem)
      .attr('fill', (d) => color(d.data.paymentSystem))
      .attr('font-size', '1rem')
      .attr('margin-bottom', '1rem')
      .attr('y', (_, i) => 30 * (i + 1));
  }, [salesDataGrouped]);

  return (
    <>
      <Header />
      <div className="chartWrap">
        <svg ref={ref} />
      </div>
      <div className="datePickerWrap">
        <DatePicker
          selected={dateRange.startDate}
          onChange={selectStartDate}
          className="datePickerInput"
        />
        <DatePicker
          selected={dateRange.endDate}
          onChange={selectEndDate}
          className="datePickerInput"
        />
      </div>
    </>
  );
};
