import { RootState, AppDispatch } from "app/store";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef, useMemo } from "react";
import { formatDate, formatAsCurrency, formatDateBrazil } from "@src/app/utils";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "@src/components/Loading";
import { useGetMapDataQuery } from "@src/app/api";
import MapChart from "@src/components/MapChart";
import { useLazyGetMapDetailsQuery } from "@src/app/api";
import "./styles.scss";
import { useI18n } from "react-simple-i18n";
import { FaMinus } from "react-icons/fa";

const Details = ({
  data,
  total,
  name,
  close,
}: {
  data: any;
  name: string;
  total: number;
  close: () => void;
}) => {
  const { t } = useI18n();
  const { startDate, endDate } = useSelector(
    (state: RootState) => state.calendar
  );

  return (
    <div className="details-content">
      <div className="details-header">
        <h2>{name}</h2>
        <h2>
          {formatDateBrazil(startDate)} - {formatDateBrazil(endDate)}
        </h2>
        <h2>Total {formatAsCurrency(total)}</h2>
        <div className="close-button-map" onClick={close}>
          x
        </div>
      </div>
      <div className="details-body">
        {
          data.map((item: any) => (
            <div className="map-details">
              <span className="map-details-item">{item[0]}</span>
              <span className="map-details-amount">{formatAsCurrency(item[1])}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
};

const Map = (): JSX.Element => {
  const firstUpdate = useRef(true);
  const calendar = useSelector((state: RootState) => state.calendar);
  const [selectedUf, setSelectedUf] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [trigger, result] = useLazyGetMapDetailsQuery();

  const { startDate, endDate } = calendar;
  const cleanData = (data: any) => {
    const cleanData = {};
    Object.keys(data).forEach((key) => {
      if (key !== "null") {
        // @ts-ignore
        cleanData[key] = data[key];
      }
    });
    return cleanData;
  };

  const { data, isLoading, isError, isSuccess, error, isFetching, refetch } =
    useGetMapDataQuery(
      {
        startDate,
        endDate,
      },
      {
        refetchOnMountOrArgChange: false,
        refetchOnReconnect: false,
        // @ts-ignore
        refetchOnWindowFocus: false,
      }
    );

  const getDetails = (name: string) => {
    setIsDetailsOpen(true);
    setSelectedUf(name);
    trigger({ uf: name, startDate, endDate });
  };

  useEffect(() => {
    if (result.data) {
      console.log(result.data);
    }
  }, [result.data]);

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
    // @ts-ignore
    content = <p>Error: {error}</p>;
  } else if (isSuccess) {
    content = (
      <div onClick={() => setIsDetailsOpen(false)}>
        <MapChart handleClick={getDetails} data={cleanData(data)} />
      </div>
    );
  }

  const detailsContent = useMemo(() => {
    if (result.isLoading || result.isFetching) {
      return (
        <div className="loading-details">
          <Loading />
        </div>
      );
    } else if (result.isError) {
      // @ts-ignore
      return <p>Error: {result.error}</p>;
    } else if (result.isSuccess && isDetailsOpen) {
      return (
        <Details
          data={result.data}
          // @ts-ignore
          name={selectedUf}
          // @ts-ignore
          total={data[selectedUf].expense}
          close={() => setIsDetailsOpen(false)}
        />
      );
    }
  }, [result, isDetailsOpen, selectedUf]);

  return (
    <div className="map-container">
      {content}
      {detailsContent}
      {/* <Outlet /> */}
    </div>
  );
};

export default Map;
