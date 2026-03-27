import React from "react";
import countryList from "../countryList";

const CurrencySelector = ({ label, value, onChange }) => {
  const countryCode = countryList[value] || "US";
  const flagSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  return (
    <div className="selector-group">
      <span className="selector-label">{label}</span>
      <div className="select-box">
        <img src={flagSrc} alt={value} className="flag-img" />
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {Object.keys(countryList).map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
        <span className="select-arrow">▾</span>
      </div>
    </div>
  );
};

export default CurrencySelector;
