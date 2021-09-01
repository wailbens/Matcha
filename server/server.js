const   express = require('express'),
        cors = require('cors'),
        http = require('http'),
        bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

app.use(require('./routes.js'));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Server listening on port ' + port));
