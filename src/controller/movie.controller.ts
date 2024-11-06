
import { NextFunction, Request, Response, RequestHandler } from "express";
import { CustomError } from "../models/custom-error.model";
import * as moviesService from '../service/movie.service';
import { MoviesData, MoviesDataResponse } from "../types/movie.types";


/**
 * 
 * @param req request from express
 * @param res response from express
 * @param next nextFn from express
 */
export const getMoviesByYear: RequestHandler = async(req:Request, res:Response, next: NextFunction) => {
  
    try{

        const{year, page} = req.query;

        const yearNumber = Number(year);

         // Validate 'year' parameter - check if it's a 4-digit number by length
         if (!year || typeof year !== 'string' || year.length !== 4 || isNaN(Number(year))) {
            throw new CustomError('Invalid query parameters', 400, 'Year parameter must be a valid YYYY format');
        }

        
        // Set default page to 1 if not provided
        let pageNumber = 1;
        
        if (page !== undefined) {
            pageNumber = Number(page);
            if (isNaN(pageNumber) || pageNumber <= 0) {
                throw new CustomError('Invalid query parameters', 400, 'Page parameter must be a positive number');
            }
        }
        const moviesData: MoviesData[] = await moviesService.getMovies(year, pageNumber);

        res.status(200).json({
            success: true,
            data: moviesData,
        });
    }
    catch(err){
        next(err);
    }
}