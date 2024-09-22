import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [jsonData, setJsonData] = useState('');
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  // Handle JSON data input change
  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Get the base64 string
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert file to base64 string if a file is selected
      let fileB64 = '';
      if (file) {
        fileB64 = await convertToBase64(file);
      }

      // Create payload
      const payload = {
        data: JSON.parse(jsonData),
        file_b64: fileB64
      };

      // Send POST request to the backend
      const response = await axios.post('https://bajaj-api-back-6mpum3s58-papireddy903s-projects.vercel.app/bfhl', payload);
      // const response = await axios.post('http://127.0.0.1:5000/bfhl', payload);
      
      // Update response state
      setResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bajaj Finserv Health Dev Challenge</h1>
      
      {/* JSON Data Input */}
      <textarea 
        rows="4" 
        cols="50" 
        placeholder='Enter JSON data here...' 
        value={jsonData} 
        onChange={handleJsonChange}
      />

      {/* File Upload Input */}
      <input 
        type="file" 
        onChange={handleFileChange} 
        style={{ display: 'block', margin: '10px 0' }}
      />

      {/* Submit Button */}
      <button onClick={handleSubmit}>Submit</button>

      {/* Display Response */}
      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
