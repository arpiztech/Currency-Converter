import React, { useState, useCallback } from "react";
import CurrencySelector from "./components/CurrencySelector";
import "./App.css";

// OLD (broken)
// const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

// NEW
const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurr, setFromCurr] = useState("USD");
  const [toCurr, setToCurr] = useState("INR");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSwap = () => {
    setFromCurr(toCurr);
    setToCurr(fromCurr);
    setResult(null);
  };

  const handleConvert = useCallback(async () => {
    const safeAmount = !amount || amount < 1 ? 1 : parseFloat(amount);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // const url = `${BASE_URL}/${fromCurr.toLowerCase()}/${toCurr.toLowerCase()}.json`;
      const url = `${BASE_URL}/${fromCurr.toLowerCase()}.json`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch exchange rate.");

      const data = await response.json();
      // const rate = data[toCurr.toLowerCase()];
      const rate = data[fromCurr.toLowerCase()][toCurr.toLowerCase()]; // <-- nested access

      if (!rate) throw new Error("Rate not found.");

      const finalAmount = (safeAmount * rate).toFixed(4);

      setResult({
        from: fromCurr,
        to: toCurr,
        amount: safeAmount,
        finalAmount,
        rate: rate.toFixed(6),
      });
    } catch (err) {
      setError("Could not fetch rate. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurr, toCurr]);

  return (
    <div className="page">
      <div className="noise" />
      <div className="card">
        {/* Header */}
        <div className="card-header">
          <div className="logo-mark">₿</div>
          <h1 className="title">
            Currency
            <br />
            Converter
          </h1>
          <p className="subtitle">Live exchange rates · 150+ currencies</p>
        </div>

        {/* Form */}
        <div className="form-body">
          {/* Amount Input */}
          <div className="field">
            <label className="field-label">Amount</label>
            <div className="amount-input-wrap">
              <span className="currency-badge">{fromCurr}</span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="amount-input"
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* Currency Selectors */}
          <div className="selectors-row">
            <CurrencySelector
              label="From"
              value={fromCurr}
              onChange={(val) => {
                setFromCurr(val);
                setResult(null);
              }}
            />

            <button
              className="swap-btn"
              onClick={handleSwap}
              title="Swap currencies"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 16V4m0 0L3 8m4-4l4 4" />
                <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>

            <CurrencySelector
              label="To"
              value={toCurr}
              onChange={(val) => {
                setToCurr(val);
                setResult(null);
              }}
            />
          </div>

          {/* Button */}
          <button
            className={`convert-btn ${loading ? "loading" : ""}`}
            onClick={handleConvert}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-wrap">
                <span className="spinner" /> Fetching Rate…
              </span>
            ) : (
              "Get Exchange Rate"
            )}
          </button>

          {/* Error */}
          {error && <div className="error-msg">{error}</div>}

          {/* Result */}
          {result && (
            <div className="result-card">
              <div className="result-main">
                <span className="result-amount">
                  {result.amount.toLocaleString()}
                </span>
                <span className="result-currency">{result.from}</span>
                <span className="result-equals">=</span>
                <span className="result-final">
                  {parseFloat(result.finalAmount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}
                </span>
                <span className="result-currency">{result.to}</span>
              </div>
              <div className="result-rate">
                1 {result.from} = {result.rate} {result.to}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
