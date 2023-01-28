import { RootState, AppDispatch } from "app/store";
import { setDates } from "@src/features/calendar/slice";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "@src/components/DatePicker";
import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { FaTable, FaChartBar, FaHome, FaGithub } from "react-icons/fa";
import { SiAboutdotme } from "react-icons/si";
import ExternalLink from "@src/components/ExternalLink";
import { useI18n } from "react-simple-i18n";
import Description from "@src/components/Description";
import { useEffect } from "react";
import Block from "@src/components/Block";
import { Range } from "@src/app/types";
import "./App.scss";

const LeftSide = () => {
  const { pathname } = useLocation();

  return (
    <div className="left-side">
      <Link to="/" className={` ${pathname === "/" ? "active" : ""}`}>
        <FaHome size={26} />
      </Link>
      <ExternalLink url={"https://github.com/felri/dadoslegiveis-frontend"}>
        <FaGithub size={26} />
      </ExternalLink>
    </div>
  );
};

const RightSide = () => {
  const { i18n } = useI18n();
  return (
    <div className="right-side">
      <span onClick={() => i18n.setLang("ptBR")}>🇧🇷</span>
      <span onClick={() => i18n.setLang("enUS")}>🇺🇸</span>
    </div>
  );
};

const Navbar = () => {
  const { t } = useI18n();
  const { pathname } = useLocation();

  return (
    <nav>
      <Link
        to="joyplot"
        className={`navbar-title ${pathname === "/joyplot" ? "active" : ""}`}
      >
        <span>{t("nav.joyplot")}</span> <FaChartBar size={26} />
      </Link>
      <Link
        to="treemap"
        className={`navbar-title ${pathname === "/treemap" ? "active" : ""}`}
      >
        <FaTable size={26} /> <span>{t("nav.treemap")}</span>
      </Link>
      <RightSide />
      <LeftSide />
    </nav>
  );
};

const Home: React.FC = () => {
  const { pathname } = useLocation();
  const { t, i18n } = useI18n();
  const dispatch: AppDispatch = useDispatch();
  const calendar = useSelector((state: RootState) => state.calendar);

  const { startDate, endDate } = calendar;

  const handleFetchJoyplot = ({ startDate, endDate }: Range) => {
    dispatch(setDates({ startDate, endDate }));
  };

  useEffect(() => {
    const lang = navigator.language.replace("-", "");
    if (lang === "ptBR" || lang === "enUS")
      i18n.setLang(navigator.language.replace("-", ""));
  }, []);

  const description = () => {
    if (pathname.includes("/joyplot")) {
      return [t("joyplot.description")];
    }
    if (pathname.includes("/treemap")) {
      return [t("treemap.description")];
    }
    if (pathname === "/") {
      return [
        t("home.sectionOne"),
        t("home.sectionTwo"),
        t("home.sectionThree"),
      ];
    }
    return [""];
  };

  return (
    <div className="App container">
      <Navbar />
      <div className="base">
        <div>
          {description().map((item) => (
            <Description>{item}</Description>
          ))}
        </div>
        <DatePicker
          startDate={startDate}
          endDate={endDate}
          handleChange={handleFetchJoyplot}
        />
      </div>
      {pathname === "/" && (
        <div className="base">
          <Block
            url="joyplot"
            icon={<FaChartBar size={200} />}
            title={t("nav.joyplot")}
          />
          <Block
            url="treemap"
            icon={<FaTable size={200} />}
            title={t("nav.treemap")}
          />
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default Home;
