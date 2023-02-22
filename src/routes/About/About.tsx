// @ts-nocheck
import ExternalLink from "@src/components/ExternalLink";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";
import joyplotVideo from "@src/assets/joyplot.webm";
import treemapVideo from "@src/assets/treemap.webm";
import { useI18n } from "react-simple-i18n";
import { Navbar } from "@src/routes/Home/Home";
import joyplotPic from "@src/assets/about/joyplot.jpg";
import treemapPic from "@src/assets/about/treemap.jpg";
import circularPic from "@src/assets/about/circular.jpg";
import mapPic from "@src/assets/about/map.jpg";

import "./styles.scss";

const CODE_STRINGS = {
  backend: {
    helloWorld: `
@app.get("/")
def read_root():
    return {"Hello": "World"}
    `,
  },
  frontend: {
    api: `
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
      getJoyplotData: builder.query({
          query: (args) => {
              let { startDate, endDate, byParty } = args;
              startDate = formatDate(startDate);
              endDate = formatDate(endDate);
              return get_joyplot_data?start_date={startDate}&end_date={endDate}&by_party={byParty};
          },
          keepUnusedDataFor: 5000,
      }),
  }),
});

const {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
    isFetching,
    refetch,
} = useGetJoyplotDataQuery({
    startDate,
    endDate,
    byParty,
});
    `,
  },
  line: {
    query: `SELECT
    txNomeParlamentar,
    datEmissao,
    sum(vlrDocumento) as vlrDocumento
FROM expenses
WHERE datEmissao BETWEEN %s AND %s
GROUP BY txNomeParlamentar, datEmissao
ORDER BY datEmissao ASC`,
    pivoted: `def get_pivoted_dataframe(result, selector):
    df = pd.DataFrame(result, columns=[selector, "datEmissao", "vlrDocumento"])
    pivoted_df = df.pivot_table(
        index=selector,
        columns="datEmissao",
        values="vlrDocumento",
        aggfunc="sum",
    )
    pivoted_df = pivoted_df.fillna(0)
    pivoted_df = pivoted_df[(pivoted_df.T != 0).any()]
    return pivoted_df`,
  },
  circle: {
    query: `SELECT sgPartido, txNomeParlamentar, SUM(vlrDocumento) as total
FROM expenses
WHERE datEmissao BETWEEN %s AND %s
GROUP BY sgPartido, txNomeParlamentar;`,
    df: `df = pd.DataFrame(result, columns=["sgPartido", "txNomeParlamentar", "total"])
    df.columns = ["party", "name", "total"]
    unique_parties = list(set(df["party"].tolist()))
    df["group"] = df["party"].apply(lambda x: unique_parties.index(x))
    df = df.to_dict("records")`,
    node: `let node = svg
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
    .on("click", onMouseClick);`,
    simulation: `let simulation = d3
    .forceSimulation()
    .force(
      "center",
      d3
        .forceCenter()
        .x(width / 2)
        .y(height / 2)
    )
    .force("charge", d3.forceManyBody().strength(0.9))
    .force(
      "collide",
      d3.forceCollide().strength(0.1).radius(bigBang).iterations(1)
    );`,
    addSimulation: `simulation.nodes(newData).on("tick", function (d) {
  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
});`,
  },
  square: {
    query: `SELECT
    txtDescricao, SUM(vlrLiquido) as expense, COUNT(txtDescricao) as count
FROM
    expenses
WHERE datEmissao::date BETWEEN %s AND %s
GROUP BY
    txtDescricao
ORDER BY SUM(vlrLiquido) DESC
LIMIT 7`,
    data: `let hierarchy = {
      name: "Expenses",
      children: [],
  };
  
data.forEach((expense) => {
    return hierarchy.children.push({
        name: expense[0],
        value: expense[1],
        count: expense[2],
    });
});
  
const root = d3.hierarchy(hierarchy).sum(d => d.value);`,
    treemap: `d3.treemap()
  .size([width, height])
  .padding(2)
  .round(true)
  (root)`,
    add: `svg.selectAll("rect")
  .data(root.leaves())
  .join("rect")
  .attr('x', function (d) { return d.x0; })
  .attr('y', function (d) { return d.y0; })
  .attr('width', function (d) { return d.x1 - d.x0; })
  .attr('height', function (d) { return d.y1 - d.y0; })
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("overflow", "hidden")
  .style("fill", getRandomColor)
  .style("opacity", "0.4")`,
  },
  cache: `def cache_function(function, cache_key):
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
  return result`,
  map: {
    query: `SELECT sgUF, SUM(vlrLiquido) as total_expense
    FROM expenses
    WHERE datEmissao::date BETWEEN %s AND %s
    GROUP BY sgUF
    ORDER BY SUM(vlrLiquido) DESC`,
    data: `const spring = useSpring({
  from: {
    scale: [1, 1, 1],
    color: "green",
    position: position,
  },
  to: {
    scale: [1, scaleNormalized, 1],
    position: getTextIncreasedPosition(),
    color: getExpenseColor(data.normalized_expense),
  },
  config: {
    duration: 2000,
  },
});

<a.mesh
  scale={spring.scale}
>
  <a.meshStandardMaterial
    emissive={emissive}
    emissiveIntensity={.5}
    color={spring.color}
  />
</a.mesh>`,
  },
  updates: {
    update_latest_entries_in_csv: `@app.on_event("startup")
@repeat_every(seconds=86400)  # 24 hours
def update_latest_entries_in_csv() -> None:
    if os.environ.get("DONT_RUN_SCRIPTS") != "dev":
        downloader.download_expenses_current_year()
        downloader.format_csv_data_to_db()

        latest_date = updater.get_latest_date()
        current_date = pd.to_datetime('today').date()
        if latest_date > current_date:
            latest_date = current_date    
        
        df = updater.get_df_from_csv('./datasets/expenses/')
        # Convert string dates to datetime.date objects
        df['datEmissao'] = pd.to_datetime(df['datEmissao'], format='%Y-%m-%dT%H:%M:%S').dt.date
        # Filter the rows with datEmissao after the latest date
        df = df[df['datEmissao'] > latest_date]
        # Update the database
        updater.save_to_db(df)
        print(f"Updated {len(df)} entries.")`,
    format_csv_data_to_db: `def format_csv_data_to_db():
    for csv in os.listdir(DIRECTORY):
        if csv.endswith(".csv"):
            df = clean_csv(f"{DIRECTORY}/{csv}")
            save_csv(df, csv)
    return`,
    download_expenses_current_year: `def download_expenses_current_year():
    remove_all_files() #remove old csvs
    current_year = datetime.datetime.now().year
    download_expenses([current_year])`,
    clean_csv: `def clean_csv(csv):
    df = pd.read_csv(csv, sep=";", encoding="utf-8")
    df[INTEGER_FIELDS] = df[INTEGER_FIELDS].fillna(0)
    df[FLOAT_FIELDS] = df[FLOAT_FIELDS].fillna(0.0)
    df["sgPartido"] = df.apply(
        lambda row: PARTIES_FOR_LEADERS[row["txNomeParlamentar"]]
        if row["txNomeParlamentar"] in PARTY_LEADERS
        else row["sgPartido"],
        axis=1,
    )
    df["txNomeParlamentar"] = df["txNomeParlamentar"].apply(unidecode)
    df = df.iloc[1:]
    df[INTEGER_FIELDS] = df[INTEGER_FIELDS].astype(int)
    df[FLOAT_FIELDS] = df[FLOAT_FIELDS].astype(float)
    df = remove_duplicates(df)
    return df
`,
  },
};

function About() {
  const { i18n } = useI18n();
  const isEnglish = i18n.getLang() === "enUS";
  return isEnglish ? AboutEnglish() : AboutPortuguese();
}

function AboutEnglish() {
  return (
    <div className="about">
      <Navbar />
      <div className="about-title">About</div>

      <div className="about-subtitle">Idea</div>
      <p className="about-paragraph">
        The{" "}
        <ExternalLink url="https://dadosabertos.camara.leg.br/swagger/api.html#staticfile">
          Brazilian government's open data program
        </ExternalLink>{" "}
        provides information on the expenses of deputies, but it's not easy to
        visualize. To simplify the process, I created a website that uses an API
        to access the data, but the API is often down. So, I took the CSV route.
      </p>

      <div className="about-subtitle">Dataset</div>
      <p className="about-paragraph">
        After loading the CSV into a data frame, I explored it and chose the
        most relevant columns. I have the deputy's name, state, party, expenses
        description, seller ID, date, and link to the bills PDF. I stored
        everything in a PostgreSQL database. Backend: As a frontend developer, I
        went with a great framework called FastAPI to be my server. Please bear
        with me as I am not an expert in Python.
      </p>

      <div className="about-subtitle">Backend</div>
      <p className="about-paragraph">
        As a frontend developer, I went with a great framework called FastAPI to
        be my server. Please bear with me as I am not an expert in Python.
      </p>

      <SyntaxHighlighter language="python" style={monokai}>
        {CODE_STRINGS.backend.helloWorld}
      </SyntaxHighlighter>

      <div className="about-subtitle">Frontend</div>
      <p className="about-paragraph">
        For the frontend, I used React, TypeScript, Redux Toolkit, React Three
        Fiber, D3.js, and a little bit of Blender. I'm using createApi from the
        toolkit, which allows me to use all the great features from sagas, but
        everything is happening in my dependencies, so I don't have to write
        code that is prone to bugs.
      </p>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {CODE_STRINGS.frontend.api}
      </SyntaxHighlighter>

      <div className="about-subtitle">Deployment</div>
      <p className="about-paragraph">
        I used AWS Amplify for continuous deployment from a GitHub repository
        for the frontend. For the database, I used a free-tier AWS RDS instance.
        For the backend, I created a Docker image, uploaded it to AWS ECR, and
        created an ECS service with 0.25 vCPU and 500 MB.
      </p>

      <div className="about-subtitle">Line Chart</div>
      <p className="about-paragraph">
        The line chart is not a simple chart. In fact, it's a joyplot
        chart, where each deputy's line or density chart is stacked on top of
        one another.
      </p>

      <div className="image-container">
        <img src={joyplotPic} alt="joyplot" />
      </div>

      <p className="about-paragraph">
        To create this chart, I need a list of each unique deputy, by day, with
        the sum of all their expenses in a date range. I used the following
        query to get the required data from the table:
      </p>

      <SyntaxHighlighter language="sql" style={monokai}>
        {CODE_STRINGS.line.query}
      </SyntaxHighlighter>

      <p className="about-paragraph">
        The result of this query is a list of lists containing the deputy name,
        date, and the total amount spent on that day. I then pivoted this list
        into a more readable format for the frontend using the following
        get_pivoted_dataframe() function:
      </p>

      <SyntaxHighlighter language="python" style={monokai}>
        {CODE_STRINGS.line.pivoted}
      </SyntaxHighlighter>

      <p className="about-paragraph">
        The frontend for this chart was not an easy feat, and the code is quite
        lengthy and can be improved a lot. However, it's working, and I was able
        to move on to creating the other three charts. You can find the code for
        the Joyplot chart{" "}
        <ExternalLink url="https://github.com/felri/dadoslegiveis-frontend/blob/master/src/components/JoyPlotChart/JoyPlotChart.tsx">
          here
        </ExternalLink>
        .
      </p>

      <div className="about-subtitle">Circle Chart</div>
      <div className="image-container">
        <img src={circularPic} alt="Circle Chart" />
      </div>
      <p className="about-paragraph">
        First, a query is created to select the parties for the circle's colors,
        the deputies for the circles, and the total sum of expenses for the size
        of the circles.
      </p>

      <SyntaxHighlighter language="sql" style={monokai}>
        {CODE_STRINGS.circle.query}
      </SyntaxHighlighter>

      <p className="about-paragraph">
        The resulting long list is transformed into a Pandas DataFrame to have a
        more manageable format.
      </p>

      <SyntaxHighlighter language="python" style={monokai}>
        {CODE_STRINGS.circle.df}
      </SyntaxHighlighter>

      <p className="about-paragraph">
        The data is sent to the frontend as a simple list of objects.
      </p>
      <p className="about-paragraph">
        In the frontend, d3 is used to create the nodes and circles.
      </p>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {CODE_STRINGS.circle.node}
      </SyntaxHighlighter>
      <p className="about-paragraph">
        A simulation is created to apply forces to the nodes. The simulation has
        three forces: the first is the center force pushing everything out, the
        second is the collide force so the circles do not overlap, and the last
        is the charge force to maintain the deputies of the same party close.
      </p>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {CODE_STRINGS.circle.simulation}
      </SyntaxHighlighter>
      <p className="about-paragraph">
        The simulation is applied to the nodes at each tick.
      </p>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {CODE_STRINGS.circle.addSimulation}
      </SyntaxHighlighter>

      <div className="about-subtitle">Square Chart</div>
      <div className="image-container">
        <img src={treemapPic} alt="Square Chart" />
      </div>
      <p className="about-paragraph">
        The query selects the top 7 expenses with the highest sum of expenses
        and groups them by type:
      </p>

      <SyntaxHighlighter language="sql" style={monokai}>
        {CODE_STRINGS.square.query}
      </SyntaxHighlighter>

      <p className="about-paragraph">
        This query limits the result to only 7 types of expenses to prevent
        smaller expenses from making the treemap chart too small to be visible
        and relevant.
      </p>
      <p className="about-paragraph">
        After receiving the response from the backend, the data is transformed
        into an object that will be used to create the treemap chart:
      </p>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {CODE_STRINGS.square.data}
      </SyntaxHighlighter>

      <p className="about-paragraph">
        The hierarchy object is created with a root node named "Expenses" and an
        empty "children" array. Each expense is added to this array as a child
        node with its name, value, and count attributes.
      </p>

      <p className="about-paragraph">
        The hierarchy object is then passed into d3.hierarchy() to create a
        hierarchy of nodes for the treemap chart, and the sum() method is used
        to compute the total value for each node in the hierarchy.
      </p>

      <p className="about-paragraph">
        The d3.treemap() function is used to compute the layout of the treemap
        chart based on the hierarchy:
      </p>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {CODE_STRINGS.square.treemap}
      </SyntaxHighlighter>

      <p className="about-paragraph">
        The root.leaves() method returns an array of leaf nodes in the
        hierarchy, and each leaf node is bound to a rectangle element in the
        SVG.
      </p>

      <p className="about-paragraph">
        The x0, y0, x1, and y1 attributes of the rectangle are set based on the
        position and size of the node computed by the d3.treemap() function.
      </p>

      <p className="about-paragraph">
        The getRandomColor() function is called to randomly generate a color for
        each rectangle, and the opacity style is set to make the rectangles
        semi-transparent.
      </p>

      <div className="about-subtitle">Map Chart</div>
      <div className="image-container">
        <img src={mapPic} alt="Map Chart" />
      </div>
      <p className="about-paragraph">
        The last graph in my project is a map. The backend is pretty
        straightforward, but instead of selecting the names or parties, I opted
        to select the states.
      </p>

      <SyntaxHighlighter language="sql" style={monokai}>
        {CODE_STRINGS.map.query}
      </SyntaxHighlighter>

      <p className="about-paragraph">
        For the frontend, I used three.js instead of d3 as I wanted a 3D chart.
        I looked up a SVG of Brazil and its states on Google, loaded it onto
        Blender, extruded the SVG a little bit, and saved it as a GLB file. I
        then imported it into the project using three.js and used React Spring
        to handle the Y scale of the states.
      </p>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {CODE_STRINGS.map.data}
      </SyntaxHighlighter>

      <div className="about-subtitle">Perfomance</div>
      <p className="about-paragraph">
        Initially, performance was not great because the database and backend
        were running on low-end VMs. To handle some of the heavy queries, I
        added Redis, and created an Elastic Cache instance to boost performance.
      </p>

      <div className="about-subtitle">Updates</div>
      <p className="about-paragraph">
        The last thing to do is to create some sort of cron job or task to
        update my table every day with new csv entries. The following functions
        are used to achieve this:
      </p>

      <p className="about-paragraph">
        update_latest_entries_in_csv(): This function is called as a scheduled
        task using FastAPI's repeat_every decorator. It runs daily and downloads
        the latest CSV files for the current year, formats the data, and updates
        the database with the new entries.
      </p>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {CODE_STRINGS.updates.update_latest_entries_in_csv}
      </SyntaxHighlighter>
      <p className="about-paragraph">
        format_csv_data_to_db(): This function is called by
        update_latest_entries_in_csv() to format the CSV data to match the
        database schema and store it in the database.
      </p>
      <SyntaxHighlighter language="python" style={monokai}>
        {CODE_STRINGS.updates.format_csv_data_to_db}
      </SyntaxHighlighter>
      <p className="about-paragraph">
        download_expenses_current_year(): This function is called by
        update_latest_entries_in_csv() to download the CSV files containing the
        expenses for the current year.
      </p>
      <SyntaxHighlighter language="python" style={monokai}>
        {CODE_STRINGS.updates.download_expenses_current_year}
      </SyntaxHighlighter>
      <p className="about-paragraph">
        clean_csv(csv): This function is called by format_csv_data_to_db() to
        clean the CSV data and convert it to a Pandas DataFrame. It removes null
        values, converts integer and float fields to the correct type, and
        removes duplicate entries.
      </p>
      <SyntaxHighlighter language="python" style={monokai}>
        {CODE_STRINGS.updates.clean_csv}
      </SyntaxHighlighter>
      <p className="about-paragraph">
        Overall, these functions work together to ensure that the database stays
        up-to-date with the latest expenses data.
      </p>
      <div className="about-subtitle">Conclusion</div>
      <p className="about-paragraph">
        In conclusion, this project was a fun two-month-long endeavor that
        required a lot of focus. Although there are still some bugs and no
        tests, I'm happy with the result.
      </p>
    </div>
  );
}

function AboutPortuguese() {
  return (
    <div className="about">
      <Navbar />
      <div className="about-title">Somente em inglês por agora</div>
      <AboutEnglish />
    </div>
  );
}

export default About;
