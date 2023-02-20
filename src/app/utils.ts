import * as d3 from "d3";

export const formatDate = (date: Date) => {
  // format obj date to YYYY-MM-DD
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

export const formatDateBrazil = (date: string | undefined): string => {
  // format obj date to DD/MM/YYYY
  if (!date) return "Data não informada";
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  return `${day}/${month}/${year}`;
};

export const getRandomColor = () => {
  // Get the array of colors from the schemeCategory10 set
  let colors = d3.schemeCategory10;
  // Generate a random index to select a color from the array
  let randomIndex = Math.floor(Math.random() * colors.length);
  // Get the random color from the array
  let randomColor = colors[randomIndex];
  return randomColor;
};

export const formatAsCurrency = (value: number) => {
  return "R$ " + value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
};

export const compareDates = (
  date1: string | number | Date,
  date2: string | number | Date
) => {
  const dateObj1 = new Date(date1);
  const dateObj2 = new Date(date2);

  const isEqual =
    dateObj1.getFullYear() === dateObj2.getFullYear() &&
    dateObj1.getMonth() === dateObj2.getMonth() &&
    dateObj1.getDate() === dateObj2.getDate();

  return isEqual;
};

export const shortenExpenses = (expense: string) => {
  let shortened = expense.replace(
    "DIVULGAÇÃO DA ATIVIDADE PARLAMENTAR",
    "DIVULGAÇÃO DA ATIVIDADE PARLAMENTAR"
  );
  shortened = shortened.replace("PASSAGEM AÉREA - SIGEPA", "PASSAGEM AÉREA");
  shortened = shortened.replace(
    "LOCAÇÃO OU FRETAMENTO DE VEÍCULOS AUTOMOTORES",
    "LOCAÇÃO DE VEÍCULOS"
  );
  shortened = shortened.replace(
    "MANUTENÇÃO DE ESCRITÓRIO DE APOIO À ATIVIDADE PARLAMENTAR",
    "MANUTENÇÃO DE ESCRITÓRIO"
  );
  shortened = shortened.replace(
    "CONSULTORIAS, PESQUISAS E TRABALHOS TÉCNICOS.",
    "CONSULTORIAS, PESQUISAS"
  );
  shortened = shortened.replace(
    "COMBUSTÍVEIS E LUBRIFICANTES.",
    "COMBUSTÍVEIS"
  );
  shortened = shortened.replace("PASSAGEM AÉREA - RPA", "PASSAGEM AÉREA");
  shortened = shortened.replace("TELEFONIA", "TELEFONIA.");
  return shortened;
};

export const colorsParties = {
  AVANTE: "#F74D12",
  CIDADANIA: "#24C0AB",
  DEMOCRATAS: "#95B558",
  MDB: "#F6D009",
  NOVO: "#F36B16",
  PATRIOTA: "#00A350",
  PCdoB: "#DA251C",
  PDT: "#1F3779",
  PL: "#FFFFFF",
  PODE: "#3285C7",
  PODEMOS: "#5398D0",
  PP: "#68C1EC",
  PROGRESSISTAS: "#68C1EC",
  PROS: "#F78F22",
  PSB: "#FF0E17",
  PSC: "#0D7A3A",
  PSD: "#70C846",
  PSDB: "#0181C5",
  PSL: "#FFF200",
  PSOL: "#F9D218",
  PT: "#E1162C",
  PTB: "#FEBA1B",
  PV: "#00A652",
  REDE: "#E45420",
  REPUBLICANOS: "#0EA2C5",
  SOLIDARIEDADE: "#E76A1E",
  UNIÃO: "#0045A9",
};

export const getSumAllJoyplot = (data: any[]) => {
  if (data && data.length > 0) {
    return formatAsCurrency(
      data.reduce((acc: number, curr: { vlrDocumento: string }) => {
        return acc + parseFloat(curr.vlrDocumento);
      }, 0)
    );
  }
  return "R$ 0,00";
};

export function debounce(func: any, delay: number) {
  let timeoutId: any;
  return (...args: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default {};
