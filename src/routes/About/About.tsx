// basic react component
import ExternalLink from "@src/components/ExternalLink";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";
import joyplotVideo from "@src/assets/joyplot.webm";
import treemapVideo from "@src/assets/treemap.webm";
import { useI18n } from "react-simple-i18n";
import { Navbar } from "@src/routes/Home/Home";
import "./styles.scss";


const CODE_STRINGS = {
  joyplot: [
    `
    def get_pivoted_dataframe(result, selector):
    df = pd.DataFrame(result, columns=[selector, "datEmissao", "vlrDocumento"])
    pivoted_df = df.pivot_table(
        index=selector,
        columns="datEmissao",
        values="vlrDocumento",
        aggfunc="sum",
    )
    pivoted_df = pivoted_df.fillna(0)
    pivoted_df = pivoted_df[(pivoted_df.T != 0).any()]
    return pivoted_df
    `,
    `
  result = get_query_result_by_deputy(start_date, end_date)
  pivoted_df = get_pivoted_dataframe(result, selector)
  pivoted_df = get_total_expenses(pivoted_df)
  dates, series = get_dates_and_series(pivoted_df)
  data = {
      "dates": dates,
      "series": series,
      "total": len(series),
  return data
  `,
  ],
  treemap: [
    `
    query = """
    SELECT 
        txtDescricao, SUM(vlrLiquido) as expense, COUNT(txtDescricao) as count
    FROM
        expenses
    WHERE datEmissao::date BETWEEN %s AND %s
    GROUP BY
        txtDescricao
    ORDER BY SUM(vlrLiquido) DESC 
        LIMIT 7
    """
    results = execute_query(query, (start_date, end_date), return_result=True)
    return results
    `,
  ],
  circular: [
    `
    let node = svg
      .append("g")
      .selectAll("circle")
      .data(newData)
      .join("circle")
      .attr("r", function (d) {
        return size(d.total);
      })
      .attr("cx", getRandomPosition())
      .attr("cy", getRandomPosition())
      .style("fill", (d) => d.color)
      .attr("stroke", "black")
      .style("stroke-width", 2)
      .attr("class", "deputy-circle")
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut)
      .on("click", onMouseClick);
    `,
    `
    let simulation = d3
      .forceSimulation()
      .force(
        "center",
        d3
          .forceCenter()
          .x(width / 2)
          .y(height / 2)
      ) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(0.9)) // Nodes are attracted one each other of value is > 0
      .force(
        "collide",
        d3.forceCollide().strength(0.1).radius(bigBang).iterations(1)
      ); // Force that avoids circle overlapping
    `,
    `
    simulation.nodes(newData).on("tick", function (d) {
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
    `,
  ],
  cache: [
    `
    def cache_function(function, cache_key):
      """
      A generic function that caches the results of another function
      """
      r = get_redis_instance()
      # Check if the data is already in the cache
      cached_data = r.get(cache_key)
      if cached_data is not None:
          # If the data is in the cache, parse the JSON
          return json.loads(cached_data)

      # If the data is not in the cache, call the function and cache the result
      result = function()
      r.set(cache_key, json.dumps(result))
      r.expire(cache_key, EXPIRATION_TIME)
      return result
    `,
  ],
};

function About () {
  const {i18n} = useI18n();
  const isEnglish = i18n.getLang() === "enUS";
  return isEnglish ? AboutEnglish() : AboutPortuguese();
}

function AboutEnglish() {
  return (
    <div className="about">
      <Navbar />
      <div className="about-title">About</div>
      <p className="about-paragraph">
        In the{" "}
        <ExternalLink url="https://dadosabertos.camara.leg.br/swagger/api.html#staticfile">
          Dados Abertos Camara dos Deputados
        </ExternalLink>{" "}
        website, there is an API that allows us to access information about
        expenses, laws, and other data related to the actions of deputies.
        However, the API is often offline. As an alternative, they provide a
        poorly organized CSV file, which is supposed to be updated daily.
      </p>
      <p className="about-paragraph">
        Initially, I had intended to use the API to create graphs with d3, but
        due to the API's unreliability, I had to turn to the CSV file. To
        accomplish this, I built a FastAPI backend and created a Docker
        container with PostgreSQL. I added each annual expense CSV to the
        database using the COPY command from psql.
      </p>
      <p className="about-paragraph">
        The{" "}
        <ExternalLink url="https://dadoslegiveis.lol/joyplot">
          first graph
        </ExternalLink>{" "}
        I created was a joyplot chart. I transformed the data into a dataframe
        where the columns were the dates, the index was the deputy's name, and
        each row was the amount spent by that deputy on each day. I used React
        for the frontend and created a request with create-react-app to handle
        the API call.
      </p>
      {CODE_STRINGS["joyplot"].map((code, index) => {
        return (
          <SyntaxHighlighter language="python" style={monokai}>
            {code}
          </SyntaxHighlighter>
        );
      })}
      <p className="about-paragraph">
        To make the chart more interactive, I added the option to click anywhere
        on the chart and have a modal display the detailed expenses for that day
        and deputy.
      </p>
      <video autoPlay loop muted>
        <source src={joyplotVideo} type="video/webm" />
      </video>

      <p className="about-paragraph">
        The{" "}
        <ExternalLink url="https://dadoslegiveis.lol/treemap">
          second graph
        </ExternalLink>{" "}
        was a simple treemap that displays each expense as a block. I also added
        a limit to the number of expenses returned to the frontend, as
        displaying all the expenses created blocks of greatly differing sizes.
      </p>
      {CODE_STRINGS["treemap"].map((code, index) => {
        return (
          <SyntaxHighlighter language="python" style={monokai}>
            {code}
          </SyntaxHighlighter>
        );
      })}
      <p className="about-paragraph">
        To make the treemap more informative, I added the option to click on
        each block and get a more detailed view of how much each deputy is
        spending, as well as the ability to click on a barplot and view a table
        detailing all the expenses of that deputy in that category.
      </p>

      <video autoPlay loop muted>
        <source src={treemapVideo} type="video/webm" />
      </video>

      <p className="about-paragraph">
        The{" "}
        <ExternalLink url="https://dadoslegiveis.lol/circular_packing">
          third and most complex graph{" "}
        </ExternalLink>
        was a circular packing chart. My original idea was to create a network
        where each circle would represent a deputy and connect to the other
        deputies from the same party. However, this didn't fit well on the
        screen, so I changed the design to have each circle be the same color as
        the party. I added an animation that starts all the circles in the
        center of the container and spreads them out using a simulation until
        the alphaTarget value is acceptable. I also added the option to click on
        a circle to display details.
      </p>

      {CODE_STRINGS["circular"].map((code, index) => {
        return (
          <SyntaxHighlighter language="javascript" style={monokai}>
            {code}
          </SyntaxHighlighter>
        );
      })}

      <p className="about-paragraph">
        For fun, I added a game where the user can drive their mouse cursor
        across the chart without touching the circles.
      </p>

      <p className="about-paragraph">
        For the frontend, I used AWS Amplify for continuous deployment from a
        Github repository. For the database, I used a free-tier AWS RDS
        instance. For the backend, I created a Docker image, uploaded it to AWS
        ECR, created an ECS service with .25 vCPU and 500 MB.
      </p>

      <p className="about-paragraph">
        Although the performance was not great initially, as the database and
        backend were running on low-end VMs, I added Redis to handle some of the
        heavy queries and created an Elastic Cache instance to improve
        performance.
      </p>

      {CODE_STRINGS["cache"].map((code, index) => {
        return (
          <SyntaxHighlighter language="python" style={monokai}>
            {code}
          </SyntaxHighlighter>
        );
      })}

      <p className="about-paragraph">
        In conclusion, this project was a fun, month-long endeavor that involved
        a lot of focus. Although there are still some bugs and no tests, I am
        happy with the result.
      </p>
    </div>
  );
}


function AboutPortuguese () {
  return (
    <div className="about">
      <Navbar />
      <div className="about-title">Sobre</div>
      <p className="about-paragraph">
        No site{" "}
        <ExternalLink url="https://dadosabertos.camara.leg.br/swagger/api.html#staticfile">
          Dados Abertos Camara dos Deputados
        </ExternalLink>{" "}
        há uma API que nos permite acessar informações sobre despesas, leis e
        outros dados relacionados às ações dos deputados. No entanto, a API
        geralmente está offline. Como alternativa, eles fornecem um arquivo CSV
        mal organizado, que é suposto ser atualizado diariamente.
      </p>
      <p className="about-paragraph">
        Inicialmente, eu tinha a intenção de usar a API para criar gráficos com
        d3, mas devido à instabilidade da API, tive que recorrer ao arquivo CSV.
        Para fazer isso, eu construí um backend FastAPI e criei um contêiner
        Docker com PostgreSQL. Adicionei cada despesa anual CSV ao banco de dados
        usando o comando COPY do psql.
      </p>
      <p className="about-paragraph">
        O{" "}
        <ExternalLink url="https://dadoslegiveis.lol/joyplot">
          primeiro gráfico
        </ExternalLink>{" "}
        que eu criei foi um gráfico joyplot. Eu transformei os dados em um
        dataframe onde as colunas eram as datas, o índice era o nome do deputado
        e cada linha era a quantidade gasta por aquele deputado em cada dia. Eu
        usei React para o frontend e criei uma solicitação com createApi
        para lidar com a chamada da API.
      </p>
      {CODE_STRINGS["joyplot"].map((code, index) => {
        return (
          <SyntaxHighlighter language="javascript" style={monokai}>
            {code}
          </SyntaxHighlighter>
        );
      })}
      <p className="about-paragraph">
        Eu também adicionei a opção de clicar em um deputado para ver os
        detalhes das despesas.
      </p>

      <video autoPlay loop muted>
        <source src={joyplotVideo} type="video/webm" />
      </video>

      <p className="about-paragraph">
        O{" "}
        <ExternalLink url="https://dadoslegiveis.lol/treemap">
          segundo gráfico
        </ExternalLink>{" "}
        que eu criei foi um gráfico de mapa de árvore. Eu transformei os dados
        em um dataframe onde as colunas eram os nomes dos deputados, o índice era
        o nome da categoria e cada linha era a quantidade gasta por aquele
        deputado em cada categoria. Eu usei React para o frontend e criei uma
        solicitação com createApi para lidar com a chamada da API. Eu também
        adicionei a opção de clicar em um deputado para ver os detalhes das
        despesas.
      </p>

      {CODE_STRINGS["treemap"].map((code, index) => {
        return (
          <SyntaxHighlighter language="javascript" style={monokai}>
            {code}
          </SyntaxHighlighter>
        );
      })}
      <p className="about-paragraph">
        Eu também adicionei a opção de clicar em um deputado para ver os
        detalhes das despesas.
      </p>

      <video autoPlay loop muted>
        <source src={treemapVideo} type="video/webm" />
      </video>

      <p className="about-paragraph">
        Para o frontend, eu usei o AWS Amplify para implantação contínua a partir
        de um repositório Github. Para o banco de dados, eu usei uma instância
        AWS RDS de nível gratuito. Para o backend, criei uma imagem Docker,
        carreguei-a no AWS ECR, criei um serviço ECS com .25 vCPU e 500 MB.
      </p>

      <p className="about-paragraph">
        Embora o desempenho não tenha sido grande no início, pois o banco de
        dados e o backend estavam sendo executados em VMs de baixo custo, adicionei
        o Redis para lidar com algumas das consultas pesadas e criei uma instância
        Elastic Cache para melhorar o desempenho.
      </p>

      {CODE_STRINGS["cache"].map((code, index) => {
        return (
          <SyntaxHighlighter language="python" style={monokai}>
            {code}
          </SyntaxHighlighter>
        );
      })}

      <p className="about-paragraph">
        Em conclusão, este projeto foi uma divertida empreitada de um mês que
        envolveu muita concentração. Embora ainda haja alguns bugs e nenhum teste,
        estou satisfeito com o resultado.
      </p>
    </div>
  );
}

export default About;
