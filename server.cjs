const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'dist'), { index: false }));

app.get('/health', (req, res) => res.status(200).send('OK'));

app.get('/{*path}', (req, res) => {
    if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map)$/)) {
        return res.status(404).send('Not found');
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8092;
app.listen(port, () => console.log(`oio listening on port ${port}`));
