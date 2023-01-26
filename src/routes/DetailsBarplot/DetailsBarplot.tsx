import { useGetDetailsDataBarplotQuery } from "@src/app/api";
import { useEffect, useState } from "react";
import { formatDateBrazil, getSumAllJoyplot } from "@src/app/utils";
import ExternalLink from "@src/components/ExternalLink";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "@src/components/Modal";
import Table from "@src/components/Table";
import Loading from "@src/components/Loading";

import "./styles.scss";

const Details = (): JSX.Element => {
  const navigate = useNavigate();

  const [nameDeputy, setNameDeputy] = useState("");
  const [urlDeputy, setUrlDeputy] = useState("");
  const [party, setParty] = useState("");
  const [state, setState] = useState("");
  const [dateEmission, setDateEmission] = useState("");

  const params = useParams();
  const { startDate, name, endDate, description } = params;

  const getStateFromFirstObject = (data: undefined | any[]) => {
    if (data && data.length > 0) {
      setNameDeputy(data[0].nomeCivil);
      setUrlDeputy(data[0].uri);
      setParty(data[0].sgPartido);
      setState(data[0].ufNascimento);
      setDateEmission(data[0].datEmissao);
    }
  };

  const { data, isLoading, isError, isSuccess, error, isFetching } =
    useGetDetailsDataBarplotQuery(
      {
        startDate,
        name,
        endDate,
        description,
      },
      {
        refetchOnMountOrArgChange: false,
        refetchOnReconnect: false,
      }
    );

  useEffect(() => {
    getStateFromFirstObject(data);
  }, [data]);

  let content = <div />;
  if (isLoading || isFetching) {
    content = <Loading />;
  } else if (isError) {
    content = <div>{error.toString()}</div>;
  } else if (isSuccess) {
    content = (
      <div className="modal-content">
        <Table data={data} />
      </div>
    );
  }

  return (
    <Modal
      titles={[
        <div>{description}</div>,
        <ExternalLink url={urlDeputy}>{nameDeputy}</ExternalLink>,
      ]}
      previousRoute="/joyplot"
      subtitles={[`${party} - ${state}`]}
      overrideCloseFunction={() => navigate(-1)}
      footer={`Total: ${getSumAllJoyplot(data)}`}
      styles={{
        width: "100%",
        height: "100%",
        padding: "0",
      }}
    >
      {content}
    </Modal>
  );
};

export default Details;
