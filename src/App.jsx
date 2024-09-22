import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [view, setView] = useState({
    numbers: true,
    alphabets: true,
    highestAlphabet: true,
  });

  // const url = "http://127.0.0.1:8080/bfhl";  // local url
  // const url = "http://127.0.0.1:8000/bfhl";
  const url = "https://api-backend-d13tcbbsp-papireddy903s-projects.vercel.app/bfhl";

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);

      if (!Array.isArray(parsedData.data) || !parsedData.data.every(item => typeof item === 'string')) {
        throw new Error('Invalid data format. Data should be an array of strings.');
      }

      const requestData = { data: parsedData.data };
      console.log('Request Payload:', requestData); 

      const res = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(res.data);
      setResponse(res.data);
    } catch (error) {
      console.error('Error submitting data:', error.response ? error.response.data : error.message);
    }
  };

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleViewChange = (e) => {
    setView((prevView) => ({
      ...prevView,
      [e.target.name]: e.target.checked,
    }));
  };

  return (
    <div className="App">
      {/* <h1>{response.roll_number}</h1> */}
      <textarea
        rows="10"
        cols="50"
        value={jsonInput}
        onChange={handleJsonChange}
        placeholder='Enter JSON here, e.g., {"data": ["A", "C", "z"]}'
      />
      <button onClick={handleSubmit}>Submit</button>

      {response && (
        <div>
          <h2>Response</h2>
          <div>
            <h3>View Options:</h3>
            <label>
              <input
                type="checkbox"
                name="numbers"
                checked={view.numbers}
                onChange={handleViewChange}
              />
              Numbers
            </label>
            <label>
              <input
                type="checkbox"
                name="alphabets"
                checked={view.alphabets}
                onChange={handleViewChange}
              />
              Alphabets
            </label>
            <label>
              <input
                type="checkbox"
                name="highestAlphabet"
                checked={view.highestAlphabet}
                onChange={handleViewChange}
              />
              Highest Alphabet
            </label>
          </div>

          {view.numbers && (
            <div>
              <h3>Numbers</h3>
              <pre>{JSON.stringify(response.numbers, null, 2)}</pre>
            </div>
          )}
          {view.alphabets && (
            <div>
              <h3>Alphabets</h3>
              <pre>{JSON.stringify(response.alphabets, null, 2)}</pre>
            </div>
          )}
          {view.highestAlphabet && (
            <div>
              <h3>Highest Alphabet</h3>
              <pre>{JSON.stringify(response.highest_alphabet, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
