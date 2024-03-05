const express = require('express')
const cors = require('cors');
const app = express();
const port = 5000

app.use(cors({
    origin: 'http://127.0.0.1:5173'
}));

app.use(express.json());

const testData = {
    status: '55',
    duration: '10 min',
    startTime: 'today',
    completed: 'yes',
    content: 'content'
}

app.get('/getIndexData', (req, res) => {
    res.json(testData);
});

app.post('/sendIndexData', (req, res) => {
    console.log(req.body);
});

app.listen(port, () => {
    console.log("server is running")
});