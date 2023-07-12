const express = require('express');
const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');


const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Define the API endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/favicon.ico', (req, res) => {
    res.status(204);
  });  

// Route for the university list page
app.get('/university-list', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'university-list.html'));
});

// Route for fetching university data
app.get('/universities', (req, res) => {
  const apiUrl = 'http://universities.hipolabs.com/search?country=United+States&limit=100';

  axios.get(apiUrl)
    .then(response => {
      const universityData = response.data;
      res.json(universityData);
    })
    .catch(error => {
      console.log('Error fetching university data:', error.message);
      res.status(500).send('Internal server error');
    });
});

// Route for exporting to CSV
app.get('/export', (req, res) => {
    const apiUrl = 'http://universities.hipolabs.com/search?country=United+States&limit=100';
  
    axios.get(apiUrl)
      .then(response => {
        const universityData = response.data;
  
        const csvWriter = createCsvWriter({
          path: 'public/university_data.csv',
          header: [
            { id: 'web_pages', title: 'Web Pages' },
            { id: 'domains', title: 'Domains' },
            { id: 'country', title: 'Country' },
            { id: 'name', title: 'Name' },
            { id: 'state_province', title: 'State/Province' },
            { id: 'alpha_two_code', title: 'Alpha Two Code' }
          ]
        });
  
        csvWriter.writeRecords(universityData)
          .then(() => {
            console.log('CSV file has been written successfully.');
            res.download(path.join(__dirname, 'public', 'university_data.csv'), 'university_data.csv', (err) => {
              if (err) {
                console.error('Error downloading CSV file:', err);
                res.status(500).send('Internal server error');
              }
              // Delete the generated CSV file after download
              fs.unlinkSync(path.join(__dirname, 'public', 'university_data.csv'));
            });
          })
          .catch(error => {
            console.error('Error writing CSV file:', error.message);
            res.status(500).send('Internal server error');
          });
      })
      .catch(error => {
        console.error('Error fetching university data:', error.message);
        res.status(500).send('Internal server error');
      });
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
