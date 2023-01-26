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
  if(!date) return "Data não informada";
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

export const compareDates = (date1: string | number | Date, date2: string | number | Date) => {
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

export const getSumAllJoyplot = (data: any[]) => {
  if (data && data.length > 0) {
    return formatAsCurrency(
      data.reduce((acc: number, curr: { vlrDocumento: string; }) => {
        return acc + parseFloat(curr.vlrDocumento);
      }, 0)
    );
  }
  return "R$ 0,00";
};

export default {};
