import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [dropdown, setDropdown] = useState([]);

  const handleInputChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDropdownChange = (event) => {
    const { value, checked } = event.target;
    setDropdown((prev) =>
      checked ? [...prev, value] : prev.filter((option) => option !== value)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const parsedInput = JSON.parse(jsonInput);
      let fileBase64 = "";
      if (file) {
        fileBase64 = await convertFileToBase64(file);
      }

      parsedInput.file_b64 = fileBase64;
      const res = await axios.post('https://bajaj-flask-backend.vercel.app/bfhl', parsedInput);
      setResponse(res.data);
    } catch (error) {
      alert('Invalid JSON or Backend Error: ' + error.message);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const filteredResponse = () => {
    if (!response) return null;
    if (dropdown.length === 0) return response;

    const filtered = {};
    dropdown.forEach((key) => {
      if (response[key] !== undefined) {
        filtered[key] = response[key];
      }
    });

    return filtered;
  };

  return (
    <div className="App">
      <form className="form" onSubmit={handleSubmit}>
        <textarea
          className="json-input"
          rows="10"
          cols="50"
          value={jsonInput}
          onChange={handleInputChange}
          placeholder='Enter JSON like { "data": ["A", "B", "c", "1", "2"] }'
        />
        <br />
        <input className="file-input" type="file" onChange={handleFileChange} />
        <br />
        <button className="submit-button" type="submit">Submit</button>
      </form>

      {response && (
        <div className="response-container">
          <h2 className="response-title">Response:</h2>
          <div className="checkbox-group">
            <input className="checkbox" type="checkbox" value="numbers" onChange={handleDropdownChange} /> Numbers
            <input className="checkbox" type="checkbox" value="alphabets" onChange={handleDropdownChange} /> Alphabets
            <input className="checkbox" type="checkbox" value="highest_lowercase_alphabet" onChange={handleDropdownChange} /> Highest Lowercase Alphabet
          </div>
          <div className="response-output">
            <pre>{JSON.stringify(filteredResponse(), null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
