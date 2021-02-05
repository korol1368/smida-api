const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

let historyData;
fs.readFile('./data/test_data.json', 'utf8', function (err, data) {
  if (err) throw err;
  historyData = JSON.parse(data);
});

app.get('/history', (req, res) => {
  const result = historyData.filter(function (entry) {
    let publicationTypesFilter = true;
    let termTypesFilter = true;
    let reportGroupsFilter = true;
    let reportStatesFilter = true;
    let reportFormatsFilter = true;
    let outputNumberFilter = true;
    let outputDateFilter = true;

    if (req.query.publicationTypes) {
      const termTypes = req.query.publicationTypes.split(',');
      publicationTypesFilter = termTypes.includes(entry.publicationType);
    }

    if (req.query.termTypes) {
      const termTypes = req.query.termTypes.split(',');
      termTypesFilter = termTypes.includes(entry.termType);
    }

    if (req.query.reportGroups) {
      const termTypes = req.query.reportGroups.split(',');
      reportGroupsFilter = termTypes.includes(entry.reportGroup);
    }

    if (req.query.reportStates) {
      const termTypes = req.query.reportStates.split(',');
      reportStatesFilter = termTypes.includes(entry.reportState);
    }

    if (req.query.reportFormats) {
      const termTypes = req.query.reportFormats.split(',');
      reportFormatsFilter = termTypes.includes(entry.reportFormat);
    }

    if (req.query.outputNumber) {
      const outputNumber = req.query.outputNumber;
      outputNumberFilter = entry.outputNumber.indexOf(outputNumber) !== -1;
    }

    if (req.query.outputDateStart && req.query.outputDateEnd) {
      const outputDateStart = new Date(req.query.outputDateStart);
      const outputDateEnd = new Date(req.query.outputDateEnd);
      const date = new Date(entry.outputDate.date);
      outputDateFilter = date >= outputDateStart && date <= outputDateEnd;
    }

    return publicationTypesFilter &&
      termTypesFilter &&
      reportGroupsFilter &&
      reportStatesFilter &&
      reportFormatsFilter &&
      outputNumberFilter &&
      outputDateFilter;
  });

  res.send(result);
});

app.delete('/history/:id', (req, res) => {
  historyData = historyData.filter(item => item.idReport !== Number(req.params.id))
  res.send({result: true});
});

app.listen(3000, () => {
  console.log("Server started on port 3000!");
});
