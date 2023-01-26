import { useGetDetailsDataQuery } from "@src/app/api";
import { useEffect, useState } from "react";
import { formatDateBrazil, getSumAllJoyplot } from "@src/app/utils";
import ExternalLink from "@src/components/ExternalLink";
import { useParams } from "react-router-dom";
import Modal from "@src/components/Modal";
import Table from "@src/components/Table";
import Loading from "@src/components/Loading";

import "./styles.scss";

const Details = (): JSX.Element => {
  const [nameDeputy, setNameDeputy] = useState("");
  const [urlDeputy, setUrlDeputy] = useState("");
  const [party, setParty] = useState("");
  const [state, setState] = useState("");
  const [dateEmission, setDateEmission] = useState("");

  const params = useParams();
  const { date, name, byParty: byPartyString } = params;
  const byParty = byPartyString === "true";
  
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
    useGetDetailsDataQuery(
      {
        date,
        name,
        byParty,
      },
      {
        refetchOnMountOrArgChange: false,
        refetchOnReconnect: false,
      }
    );

  useEffect(() => {
    getStateFromFirstObject(data);
  }, [data]);

  const title = byParty ?
    <div>{party}</div> :
    <ExternalLink url={urlDeputy}>{nameDeputy}</ExternalLink>

  const getSubtitles = () => {
    if(!dateEmission) return []
    if (byParty) {
      return [formatDateBrazil(dateEmission)]
    } else {
      return [`${party} - ${state}`, formatDateBrazil(dateEmission)]
    }
  }

  let content = <div/> 
  if (isLoading || isFetching) {
    content = <Loading />
  } else if (isError) {
    content = <div>{error.toString()}</div>
  } else if (isSuccess) {
    content = (
      <div className="modal-content">
        <Table
          data={data}
          showName={byParty}
        />
      </div>
    )
  }


  return (
    <Modal
      titles={[title]}
      previousRoute="/joyplot"
      subtitles={getSubtitles()}
      footer={isSuccess ? `Total: ${getSumAllJoyplot(data)}` : ""}
    >
      {content}
    </Modal>
  );
};

export default Details;
