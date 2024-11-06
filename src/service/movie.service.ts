import { CastMember, CrewMember, Movie, MovieCreditsResponse, MoviesData, MoviesResponse } from "../types/movie.types";
import { AxiosResponse } from "axios";
import axiosInstance from "../config/axios.config";
import { CustomError } from "../models/custom-error.model";

/**
 * 
 * @param year movie release year
 * @param page for pagination
 * @returns MoviesData array
 */
export const getMovies = async (year: String, page: Number): Promise<MoviesData[]> => {
    try {
        // call the movies api
        const response: AxiosResponse = await axiosInstance.get(`/discover/movie?language=en-US&page=${page}&primary_release_year=${year}=&sort_by=popularity.desc`);

        const rawMovies: MoviesResponse = response.data;

        // check for results
        if (rawMovies && rawMovies.results) {
            let rawMoviesResult: Movie[] = response.data.results;

            // Use Promise.all to fetch editors concurrently
            const moviesData: MoviesData[] = await Promise.all(
                rawMoviesResult.map(async (movie: Movie) => {
                    // get editors for a movie
                    const editors = await getEditorsForMovies(movie.id);

                    // Release dat format
                    const formattedReleaseDate = new Date(movie.release_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        timeZone: 'UTC', // Added to fix date shift issue
                    });

                    return {
                        title: movie.title,
                        release_date: formattedReleaseDate,
                        vote_average: movie.vote_average,
                        editors: editors,
                    };
                })
            );

            return moviesData;

        }
        // If no data found for given year, throw error.
        throw new CustomError(`No data received for year ${year}`, 400, '');

    }
    catch (err: any) {
        throw new CustomError(err.message, 500, '');
    }
}

/**
 * 
 * @param movieId for which we want to get editors
 * @returns array of editor names
 */
export const getEditorsForMovies = async (movieId: number): Promise<Array<string>> => {
    try {
        const response: AxiosResponse = await axiosInstance.get(`/movie/${movieId}/credits?language=en-US`);
        const memberData: MovieCreditsResponse = response.data;
        // used set here to remove duplicates from cast and crew editors
        const editorNames = new Set<string>();

        // add editor from cast
        memberData.cast
            .filter((castMember: CastMember) => castMember.known_for_department === "Editing")
            .forEach((castMember: CastMember) => editorNames.add(castMember.name));
        // add editor from crew
        response.data.crew
            .filter((crewMember: CrewMember) => crewMember.known_for_department === "Editing")
            .forEach((crewMember: CrewMember) => editorNames.add(crewMember.name));


        return Array.from(editorNames);
    } catch (err) {
        return [];
    }
}