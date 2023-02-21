// @ts-nocheck
import { RootState, AppDispatch } from "app/store";
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatDate, formatAsCurrency } from "@src/app/utils";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CircularPacking from "@src/components/CircularPackingChart";
import Loading from "@src/components/Loading";
import { useGetCircularPackingDataQuery } from "@src/app/api";
import "./styles.scss";

interface Props {
  total: string;
}

const Level = ({ bigBang }): JSX.Element => {
  return (
    <div className="level">
      <div className="level__item">
        Lvl {100 - bigBang}
      </div>
    </div>
  );
};

const RangeInput = ({ updateBigBang, value } : { updateBigBang: (value: number) => void }) => {
  return (
    <div className="range-input">
      <input
        type="range"
        min="10"
        max="100"
        step="1"
        defaultValue={value}
        onMouseLeave={(e) => updateBigBang(Number(e.target.value))}
        onTouchEnd={(e) => updateBigBang(Number(e.target.value))}
      />
    </div>
  )
}

const CircularPackingContainer = (): JSX.Element => {
  const navigate = useNavigate();
  const firstUpdate = useRef(true);
  const [bigBang, setBigBang] = useState(50);
  const calendar = useSelector((state: RootState) => state.calendar);

  const { startDate, endDate } = calendar;

  const { data, isLoading, isError, isSuccess, error, isFetching, refetch } =
    useGetCircularPackingDataQuery(
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

  const getDetails = (name: string) => {
    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);
    window.scrollTo(0, 0);
    navigate(
      "/circular_packing/" +
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
        <Level bigBang={bigBang} />
        <RangeInput updateBigBang={setBigBang} value={bigBang} />
        <CircularPacking data={data} getDetails={getDetails} bigBang={bigBang}/>
      </>
    );
  }

  return (
    <div className="App container">
      {content}
      <Outlet />
    </div>
  );
};

export default CircularPackingContainer;
