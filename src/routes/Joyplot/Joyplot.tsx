// @ts-nocheck
import { useEffect, useRef, useLayoutEffect } from "react";
import { RootState, AppDispatch } from "app/store";
import { useGetJoyplotDataQuery } from "@src/app/api";
import { useSelector, useDispatch } from "react-redux";
import JoyPlotChart from "../../components/JoyPlotChart";
import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Search from "@src/components/Search";
import Loading from "@src/components/Loading";

import "./styles.scss";

const JoyplotContainer = (): JSX.Element => {
  const firstUpdate = useRef(true);

  const calendar = useSelector((state: RootState) => state.calendar);
  const joyplot = useSelector((state: RootState) => state.joyplot);

  const { startDate, endDate } = calendar;
  const { byParty, search } = joyplot;

  const navigate = useNavigate();
  const { data, isLoading, isError, isSuccess, error, isFetching, refetch } =
    useGetJoyplotDataQuery(
      {
        startDate,
        endDate,
        byParty,
      },
      {
        refetchOnMountOrArgChange: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      }
    );

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    refetch();
  }, [startDate, endDate, byParty]);

  function searchArray(searchString, data) {
    if (!data) return [];
    return data.filter((item) => {
      return item["name"].toLowerCase().includes(searchString.toLowerCase());
    });
  }

  const filteredData = useMemo(() => {
    if (search.trim().length > 2 || (search.trim().length > 0 && byParty)) {
      const series = data?.series;
      const result = searchArray(search, series);
      return { ...data, series: result };
    }
    return data;
  }, [search, data]);

  const getDetails = (date: string, name: string) => {
    navigate("details/" + name + "/" + date + "/" + byParty);
  };

  let content;

  if (isLoading || isFetching) {
    content = <Loading />;
  } else if (isSuccess) {
    content = (
      <>
        <Search />
        <JoyPlotChart
          data={filteredData}
          getDetails={getDetails}
          byParty={byParty}
        />
      </>
    );
  } else if (isError) {
    content = <div>{error.toString()}</div>;
  }

  return (
    <div className="App container-joyplot">
      {content}
      <Outlet />
    </div>
  );
};

export default JoyplotContainer;
