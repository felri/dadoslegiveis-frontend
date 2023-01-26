import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { formatDate } from "@src/app/utils";


export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://0.0.0.0:5001" }),
  endpoints: (builder) => ({
    getJoyplotData: builder.query({
      query: (args) => {
        let { startDate, endDate, byParty } = args;
        startDate = formatDate(startDate);
        endDate = formatDate(endDate);
        return `get_joyplot_data?start_date=${startDate}&end_date=${endDate}&by_party=${byParty}`;
      },
      keepUnusedDataFor: 5000,
    }),
    getDetailsData: builder.query({
      query: (args) =>
        `get_details_by_name_and_day?date=${args.date}&name=${args.name}&by_party=${args.byParty}`,
    }),
    getTreemapData: builder.query({
      query: (args) => {
        let { startDate, endDate } = args;
        startDate = formatDate(startDate);
        endDate = formatDate(endDate);
        return `get_treemap_data?start_date=${startDate}&end_date=${endDate}`;
      },
      keepUnusedDataFor: 5000,
    }),
    getBarplotData: builder.query({
      query: (args) =>
        `get_barplot_treemap_block_data?description=${args.description}&start_date=${args.startDate}&end_date=${args.endDate}`,
    }),
    getDetailsDataBarplot: builder.query({
      query: (args) =>
        `get_list_expenses_by_deputy?description=${args.description}&start_date=${args.startDate}&end_date=${args.endDate}&name=${args.name}`,
    }),
  }),
});

export const {
  useGetJoyplotDataQuery,
  useGetDetailsDataQuery,
  useGetTreemapDataQuery,
  useGetBarplotDataQuery,
  useGetDetailsDataBarplotQuery,
} = api;
