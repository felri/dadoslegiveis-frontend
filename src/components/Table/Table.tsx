// @ts-nocheck
import { formatAsCurrency, formatDateBrazil } from "@src/app/utils";
import ExternalLink from "@src/components/ExternalLink";
import { useMemo } from "react";
import { useI18n } from "react-simple-i18n";
import { useTable } from "react-table";
import "./styles.scss";

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <table className="styled-table" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const Container = ({ data,  showName = false }): JSX.Element => {
  const { t } = useI18n();
  const formatDataToTable = (data) => {
    return data.map((expense) => {
      let data = {
        valor: formatAsCurrency(expense.vlrDocumento),
        descricao: expense.txtDescricao,
        empresa: expense.txtFornecedor,
        cnpj: expense.txtCNPJCPF,
        pdf: expense.urlDocumento && (
          <ExternalLink url={expense.urlDocumento}>Link</ExternalLink>
        ),
      };
      if (showName) {
        data["nome"] = expense.txNomeParlamentar;
      } else {
        data["data"] = formatDateBrazil(expense.datEmissao);
      }
      return data;
    });
  };

  const columns = () => {
    const data = [
      {
        Header: t("table.valor"),
        accessor: "valor",
      },
      {
        Header: t("table.descricao"),
        accessor: "descricao",
      },
      {
        Header: t("table.empresa"),
        accessor: "empresa",
      },
      {
        Header: t("table.cnpj"),
        accessor: "cnpj",
      },
      {
        Header: t("table.pdf"),
        accessor: "pdf",
      },
    ];
    if (showName) {
      data.unshift({
        Header: t("table.nome"),
        accessor: "nome",
      });
    } else {
      data.unshift({
        Header: t("table.data"),
        accessor: "data",
      });
    }
    return data;
  }

  const rows = useMemo(() => {
    if (data) return formatDataToTable(data);
  }, [data]);

  return rows.length ? (
    <div className="table-container">
      <Table columns={columns()} data={rows} />
    </div>
  ) : (
    <></>
  );
};

export default Container;
