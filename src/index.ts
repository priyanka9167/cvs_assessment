import express, {Express, Request, Response, Application} from 'express';
import morgan from 'morgan';
import movieRouter from './routes/movie.routes';
import handleError from './middlewares/error-handler.middleware';


const app: Application = express();
app.use(express.json());
const port = process.env.PORT || 8000;



// Use morgan middleware before your routes
app.use(morgan('combined'));

app.use("/api/movies", movieRouter);

// add custom error handler middleware as the last middleware
app.use(handleError);


app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
})