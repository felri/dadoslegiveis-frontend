import { RootState, AppDispatch } from "app/store";
import { setDates } from "@src/features/calendar/slice";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "@src/components/DatePicker";
import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import {
  FaCircle,
  FaSquare,
  FaHome,
  FaGithub,
  FaMinus,
  FaInfoCircle,
  FaGlobeAmericas,
} from "react-icons/fa";
import ExternalLink from "@src/components/ExternalLink";
import { useI18n } from "react-simple-i18n";
import Description from "@src/components/Description";
import { useEffect, useRef } from "react";
import Block from "@src/components/Block";
import { Range } from "@src/app/types";
import MobileWarning from "@src/components/MobileWarning";
import CanvasWrapper from "@src/components/CanvasWrapper";
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
      <Link to="/about" className={` ${pathname === "/about" ? "active" : ""}`}>
        <FaInfoCircle size={26} />
      </Link>
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

export const Navbar = () => {
  const { t } = useI18n();
  const { pathname } = useLocation();

  return (
    <nav>
      <Link
        to="/joyplot"
        className={`navbar-title ${
          pathname.includes("joyplot") ? "active" : ""
        }`}
      >
        <span>{t("nav.joyplot")}</span> <FaMinus size={26} />
      </Link>
      <Link
        to="/circular_packing"
        className={`navbar-title ${
          pathname.includes("circular_packing") ? "active" : ""
        }`}
      >
        <span>{t("nav.circular_packing")}</span> <FaCircle size={26} />
      </Link>
      <Link
        to="/treemap"
        className={`navbar-title ${
          pathname.includes("treemap") ? "active" : ""
        }`}
      >
        <span>{t("nav.treemap")}</span>
        <FaSquare size={26} />
      </Link>
      <Link
        to="/map"
        className={`navbar-title ${
          pathname.includes("map") ? "active" : ""
        }`}
      >
        <span>{t("nav.map")}</span>
        <FaGlobeAmericas size={26} />
      </Link>
      <RightSide />
      <LeftSide />
    </nav>
  );
};

const Home: React.FC = () => {
  const viewRef = useRef<HTMLDivElement>(null);
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
    if (pathname.includes("/circular_packing")) {
      return [t("circular_packing.description")];
    }
    if (pathname.includes("/map")) {
      return [t("map.description")];
    }
    if (pathname === "/") {
      return [
        t("home.sectionOne"),
        t("home.sectionTwo"),
        t("home.sectionThree"),
        t("home.sectionFour"),
        t("home.sectionFive"),
        t("home.sectionSix"),
      ];
    }
    return [""];
  };

  return (
    <div className="App container" ref={viewRef}>
      <Navbar />
      <MobileWarning />
      {pathname === "/" && (
        <div className="base">
          <Block
            url="joyplot"
            icon={<FaMinus size={50} />}
            title={t("nav.joyplot")}
          />
          <Block
            url="circular_packing"
            icon={<FaCircle size={50} />}
            title={t("nav.circular_packing")}
          />
          <Block
            url="treemap"
            icon={<FaSquare size={50} />}
            title={t("nav.treemap")}
          />
          <Block
            url="map"
            icon={<FaGlobeAmericas size={50} />}
            title={t("nav.map")}
          />
        </div>
      )}
      <div className="base">
        <div
          className={`top-section ${
            pathname === "/" ? "top-section-home" : ""
          }`}
        >
          <div>
            {description().map((item, i) => (
              <Description key={i}>{item}</Description>
            ))}
          </div>
          <DatePicker
            startDate={startDate}
            endDate={endDate}
            handleChange={handleFetchJoyplot}
          />
        </div>
        {pathname === "/" && <CanvasWrapper viewRef={viewRef} />}
      </div>
      <Outlet />
    </div>
  );
};

export default Home;
