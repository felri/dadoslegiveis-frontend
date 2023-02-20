import { useGetBarplotDataQuery, useGetDetailsDataQuery } from "@src/app/api";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "@src/components/Modal";
import BarplotChart from "@src/components/BarplotChart";
import { formatDateBrazil, getSumAllJoyplot } from "@src/app/utils";
import { Outlet } from "react-router-dom";

import Loading from "@src/components/Loading";

import "./styles.scss";

const DetailsTreemap = (): JSX.Element => {
  const params = useParams();
  const navigate = useNavigate();
  const { description, startDate, endDate } = params;

  const { data, isLoading, isError, isSuccess, error, isFetching } =
    useGetBarplotDataQuery(
      {
        description,
        startDate,
        endDate,
      },
      {
        refetchOnMountOrArgChange: false,
        refetchOnReconnect: false,
      }
    );

  const getDetails = (name: string) => {
    navigate(name);
  };


  let content = <div />;
  if (isLoading || isFetching) {
    content = <Loading />;
  } else if (isError) {
    content = <div>{error.toString()}</div>;
  } else if (isSuccess) {
    content = (
      <div className="modal-content">
        <BarplotChart data={data} getDetails={getDetails} />
        <Outlet />
      </div>
    );
  }

  return (
    <Modal
      titles={[<div>{description}</div>]}
      previousRoute="/square"
      subtitles={[
        `${formatDateBrazil(startDate)} - ${formatDateBrazil(endDate)}`,
      ]}
      footer={``}
      styles={{
        width: "100%",
        height: data ? data.length * 31 : "100%",
        padding: "0",
      }}
    >
      {content}
    </Modal>
  );
};

export default DetailsTreemap;
