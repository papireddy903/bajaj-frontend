// frontend/src/App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState(null);

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Validate JSON
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data) {
        alert("Invalid JSON format. 'data' field is required.");
        return;
      }

      const res = await axios.post("https://api-backend-zeta.vercel.app/bfhl", parsedInput);
      setResponse(res.data);
      setFilteredResponse(null); // Reset filtered response
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Invalid JSON or server error.");
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilters(
      e.target.checked
        ? [...selectedFilters, value]
        : selectedFilters.filter((filter) => filter !== value)
    );
  };

  const applyFilters = () => {
    if (!response) return;

    let filteredData = {};
    selectedFilters.forEach((filter) => {
      filteredData[filter] = response[filter];
    });
    setFilteredResponse(filteredData);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>College Roll Number</h1>
        <textarea
          rows="5"
          cols="50"
          value={jsonInput}
          onChange={handleJsonChange}
          placeholder='Enter JSON here... Example: {"data": ["A","1","b","2"]}'
        />
        <button onClick={handleSubmit}>Submit</button>
        {response && (
          <>
            <div>
              <h3>Select Filters:</h3>
              <label>
                <input
                  type="checkbox"
                  value="alphabets"
                  onChange={handleFilterChange}
                />
                Alphabets
              </label>
              <label>
                <input
                  type="checkbox"
                  value="numbers"
                  onChange={handleFilterChange}
                />
                Numbers
              </label>
              <label>
                <input
                  type="checkbox"
                  value="highest_lowercase_alphabet"
                  onChange={handleFilterChange}
                />
                Highest Lowercase Alphabet
              </label>
              <button onClick={applyFilters}>Apply Filters</button>
            </div>
            <div>
              <h3>Response:</h3>
              <pre>{JSON.stringify(filteredResponse || response, null, 2)}</pre>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
