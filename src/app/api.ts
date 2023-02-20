import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { formatDate } from "@src/app/utils";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
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
    getCircularPackingData: builder.query({
      query: (args) => {
        let { startDate, endDate } = args;
        startDate = formatDate(startDate);
        endDate = formatDate(endDate);
        return `get_circular_packing_data?start_date=${startDate}&end_date=${endDate}`;
      }
    }),
    getCircularPackingDetails: builder.query({
      query: (args) => {
        let { startDate, endDate, name } = args;
        return `get_circular_packing_details?name=${name}&start_date=${startDate}&end_date=${endDate}`;
      }
    }),
    getMapData: builder.query({
      query: (args) => {
        let { startDate, endDate } = args;
        startDate = formatDate(startDate);
        endDate = formatDate(endDate);
        return `get_map_data?start_date=${startDate}&end_date=${endDate}`;
      },
      keepUnusedDataFor: 5000,
    }),
    getMapDetails: builder.query({
      query: (args) => {
        let { startDate, endDate, uf } = args;
        startDate = formatDate(startDate);
        endDate = formatDate(endDate);
        return `get_map_details?start_date=${startDate}&end_date=${endDate}&uf=${uf}`;
      },
      keepUnusedDataFor: 5000,
    }),
  }),
});

export const {
  useGetJoyplotDataQuery,
  useGetDetailsDataQuery,
  useGetTreemapDataQuery,
  useGetBarplotDataQuery,
  useGetDetailsDataBarplotQuery,
  useGetCircularPackingDataQuery,
  useGetCircularPackingDetailsQuery,
  useGetMapDataQuery,
  useGetMapDetailsQuery,
  useLazyGetMapDetailsQuery,
} = api;
