import React from "react";
import { RootState, AppDispatch } from "app/store";
import { useDispatch, useSelector } from "react-redux";
import { setByParty, setSearch } from "@src/features/joyplot/slice";
import { FaSearch } from "react-icons/fa";
import Switch from "react-switch";
import { useI18n } from "react-simple-i18n";
import "./styles.scss";

const Search = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useI18n();
  const joyplot = useSelector((state: RootState) => state.joyplot);
  const { search, byParty } = joyplot;

  const placeholder = byParty ? "PT" : "Eduardo Bolsona...";

  const handleInputChange = (event: { target: { value: string; }; }) => {
    const inputValue = event.target.value;
    dispatch(setSearch(inputValue));
  };

  const handleSwitchChange = (checked: boolean) => {
    dispatch(setByParty(checked));
  };

  return (
    <div className="search-container">
      <div className="input-container">
        <input
          type="text"
          onChange={handleInputChange}
          placeholder={placeholder}
          value={search}
        />
        <FaSearch size={20} className="search-icon" />
      </div>
      <div className="switch-container">
        <div className="switch-text">
          <span>{t('switch.deputy')}</span>
        </div>
        <Switch
          onChange={handleSwitchChange}
          checked={byParty}
          onColor="#86d3ff"
          onHandleColor="#2693e6"
          offColor="#86d3ff"
          offHandleColor="#2693e6"
          uncheckedIcon={false}
          checkedIcon={false}
          handleDiameter={30}
        />
        <div className="switch-text">
          <span>{t('switch.party')}</span>
        </div>
      </div>
    </div>
  );
};

export default Search;
