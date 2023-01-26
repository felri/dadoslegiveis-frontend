// @ts-nocheck
import { RootState, AppDispatch } from "app/store";
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useRef } from "react";
import { formatDate, formatAsCurrency } from "@src/app/utils";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TreemapChart from "@src/components/TreemapChart";
import Loading from "@src/components/Loading";
import { useGetTreemapDataQuery } from "@src/app/api";
import "./styles.scss";

interface Props {
  total: string;
}

const Title = ({ total }: Props): JSX.Element => {
  return (
    <div className="title-treemap">
      <h3>Total: {total}</h3>
    </div>
  );
};

const TreemapContainer = (): JSX.Element => {
  const navigate = useNavigate();
  const firstUpdate = useRef(true);
  const calendar = useSelector((state: RootState) => state.calendar);

  const { startDate, endDate } = calendar;

  const { data, isLoading, isError, isSuccess, error, isFetching, refetch } =
    useGetTreemapDataQuery(
      {
        startDate,
        endDate,
      },
      {
        refetchOnMountOrArgChange: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      }
    );
      

  const total = useCallback(
    (data: number[][]) => {
      let total = 0;
      data.forEach((expense) => {
        total += expense[1];
      });
      console.log(total);
      return formatAsCurrency(total);
    },
    [data]
  );

  const getDetails = (name: string) => {
    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);
    window.scrollTo(0, 0);
    navigate(
      "/treemap/details/" +
        name +
        "/" +
        startDateFormatted +
        "/" +
        endDateFormatted
    );
  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    refetch();
  }, [startDate, endDate]);

  let content = null;

  if (isLoading || isFetching) {
    content = <Loading />;
  } else if (isError) {
    content = <p>Error: {error}</p>;
  } else if (isSuccess) {
    content = (
      <>
        <Title total={total(data)} />
        <TreemapChart data={data} getDetails={getDetails} />
      </> 
    );
  }

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100vw",
      }}
    >
      {content}
      <Outlet />
    </div>
  );
};

export default TreemapContainer;
