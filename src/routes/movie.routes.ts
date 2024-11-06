import { Router } from 'express';

import { getMoviesByYear } from '../controller/movie.controller';

const movieRouter = Router();

movieRouter.get("/", getMoviesByYear);


export default movieRouter;
