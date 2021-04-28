import express from 'express';
import morgan from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();

//Settings
app.set('port', process.env.PORT || 4000);

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Statics
app.use(express.static(path.join(__dirname, 'assets')));


//Routes
require('./src/routes/index')(app);

app.listen(app.get('port'), () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${app.get('port')}`);
});