const express = require('express')
const cors = require('cors');
const app = express();
const port = 5000

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

const testData = {
    status: '55',
    duration: '10 min',
    startTime: 'today',
    completed: 'yes',
    content: 'content'
}

const testDataAll =
{
    a1: {
        status: '55',
        duration: '10 min',
        startTime: 'today',
        completed: 'yes',
        content: 'content'
    },
    a2: {
        status: '55',
        duration: '10 min',
        startTime: 'today',
        completed: 'yes',
        content: 'content'
    },
    a3:  {
        status: '55',
        duration: '10 min',
        startTime: 'today',
        completed: 'yes',
        content: 'content'
    },
    a4:  {
        status: '55',
        duration: '10 min',
        startTime: 'today',
        completed: 'yes',
        content: 'content'
    }
}

app.post('/getIndexData1', (req, res) => {
    console.log(req.body);
});

app.get('/getAllJobs', (req, res) => {
    res.json(testDataAll);
});

app.get('/getIndexData2', (req, res) => {
    res.json(testData);
});

app.post('/sendIndexData', (req, res) => {
    console.log(req.body);
});

app.post('/deleteData', (req, res) => {
    console.log(req.body);
});

app.listen(port, () => {
    console.log("server is running")
});