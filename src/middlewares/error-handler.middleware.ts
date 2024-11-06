import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../models/custom-error.model';


/**
 * Custom error handler to standardize error objects returned to the client
 * @param err Error from Express
 * @param req Request from Express
 * @param res Response from Express
 * @param next  NextFunction function from Express
 */
export default function handleError(
	err: Error | CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof CustomError) {
		res.status(err.status).json({
			message: err.message,
			name: err.name,
			status: err.status,
			additionalInfo: err.additionalInfo,
		});
	} else {
		res.status(500).json({
			message: 'Internal Server Error',
			name: err.name || 'Error',
			status: 500,
			additionalInfo: err.message,
		});
	}
}