import request from 'supertest';
import express, { Application } from 'express';
import movieRouter from '../routes/movie.routes';
import handleError from '../middlewares/error-handler.middleware';
import * as moviesService from '../service/movie.service';

jest.mock('../service/movie.service'); // Mock the service module

const app: Application = express();

app.use(express.json());
app.use('/api/movies', movieRouter);
app.use(handleError);

describe('GET /api/movies', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return movies for a valid year', async () => {
        const mockMoviesData = [
            {
                title: 'Mock Movie',
                release_date: 'January 1, 2020',
                vote_average: 8.0,
                editors: ['Editor 1', 'Editor 2'],
            },
        ];

        (moviesService.getMovies as jest.Mock).mockResolvedValue(mockMoviesData);

        const response = await request(app).get('/api/movies').query({ year: '2020' });
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(mockMoviesData);
    });

    it('should default to page 1 if page is not provided', async () => {
        const mockMoviesData = [
            {
                title: 'Mock Movie',
                release_date: 'January 1, 2020',
                vote_average: 8.0,
                editors: ['Editor 1', 'Editor 2'],
            },
        ];

        (moviesService.getMovies as jest.Mock).mockResolvedValue(mockMoviesData);

        const response = await request(app).get('/api/movies').query({ year: '2020' });
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(mockMoviesData);
        expect(moviesService.getMovies).toHaveBeenCalledWith('2020', 1);
    });

    it('should return error for missing year parameter', async () => {
        const response = await request(app).get('/api/movies');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid query parameters',
            status: 400,
            name: 'CustomError',
            additionalInfo: 'Year parameter must be a valid YYYY format',
        });
    });

    it('should return error for invalid year format', async () => {
        const response = await request(app).get('/api/movies').query({ year: 'abcd' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid query parameters',
            status: 400,
            name: 'CustomError',
            additionalInfo: 'Year parameter must be a valid YYYY format',
        });
    });

    it('should return error for invalid page parameter', async () => {
        const response = await request(app).get('/api/movies').query({ year: '2020', page: '-1' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid query parameters',
            status: 400,
            name: 'CustomError',
            additionalInfo: 'Page parameter must be a positive number',
        });
    });

    it('should return error for non-numeric page parameter', async () => {
        const response = await request(app).get('/api/movies').query({ year: '2020', page: 'abc' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid query parameters',
            status: 400,
            name: 'CustomError',
            additionalInfo: 'Page parameter must be a positive number',
        });
    });
});
