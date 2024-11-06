import { getMovies, getEditorsForMovies } from '../service/movie.service';
import axiosInstance from '../config/axios.config';
import { AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { MoviesResponse, MovieCreditsResponse } from '../types/movie.types';
import { CustomError } from '../models/custom-error.model';

jest.mock('../config/axios.config');

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('Movie Service', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getMovies', () => {
      it('should return movies data when API call is successful', async () => {
        const year = '2020';
        const page = 1;
        const mockMoviesResponse: AxiosResponse = {
            data: {
                results: [
                    {
                        id: 1,
                        title: 'Movie 1',
                        release_date: '2020-01-01',
                        vote_average: 8.5,
                    },
                    {
                        id: 2,
                        title: 'Movie 2',
                        release_date: '2020-02-01',
                        vote_average: 7.5,
                    },
                ],
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as InternalAxiosRequestConfig
        };
  
        const mockCreditsResponse: AxiosResponse = {
          data: {
            cast: [
              { name: 'Editor A', known_for_department: 'Editing' },
              { name: 'Actor B', known_for_department: 'Acting' },
            ],
            crew: [
              { name: 'Editor C', known_for_department: 'Editing' },
              { name: 'Director D', known_for_department: 'Directing' },
            ],
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as InternalAxiosRequestConfig
        };
  
        // Mock the axios GET requests
        mockedAxios.get.mockImplementation((url) => {
          if (url.startsWith('/discover/movie')) {
            return Promise.resolve(mockMoviesResponse);
          } else if (url.startsWith('/movie/1/credits')) {
            return Promise.resolve(mockCreditsResponse);
          } else if (url.startsWith('/movie/2/credits')) {
            return Promise.resolve(mockCreditsResponse);
          } else {
            return Promise.reject(new Error('Not Found'));
          }
        });
  
        const moviesData = await getMovies(year, page);
        expect(moviesData).toEqual([
          {
            title: 'Movie 1',
            release_date: 'January 1, 2020',
            vote_average: 8.5,
            editors: ['Editor A', 'Editor C'],
          },
          {
            title: 'Movie 2',
            release_date: 'February 1, 2020',
            vote_average: 7.5,
            editors: ['Editor A', 'Editor C'],
          },
        ]);
        expect(mockedAxios.get).toHaveBeenCalledTimes(3);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `/discover/movie?language=en-US&page=${page}&primary_release_year=${year}=&sort_by=popularity.desc`
        );
        expect(mockedAxios.get).toHaveBeenCalledWith(`/movie/1/credits?language=en-US`);
        expect(mockedAxios.get).toHaveBeenCalledWith(`/movie/2/credits?language=en-US`);
      });
  
      it('should throw CustomError when no data is received', async () => {
        const year = '2020';
        const page = 1;
        const mockEmptyResponse: AxiosResponse = {
          data: {},
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        };
        mockedAxios.get.mockResolvedValue(mockEmptyResponse);
        await expect(getMovies(year, page)).rejects.toThrow(
          new CustomError(`No data received for year ${year}`, 400, '')
        );
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `/discover/movie?language=en-US&page=${page}&primary_release_year=${year}=&sort_by=popularity.desc`
        );
      });
  
      it('should throw CustomError when axios throws an error', async () => {
        const year = '2020';
        const page = 1;
        const errorMessage = 'Network Error';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));
        await expect(getMovies(year, page)).rejects.toThrow(
          new CustomError(errorMessage, 500, '')
        );
  
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `/discover/movie?language=en-US&page=${page}&primary_release_year=${year}=&sort_by=popularity.desc`
        );
      });
    });
  
    describe('getEditorsForMovies', () => {
      it('should return editors when API call is successful', async () => {
        const movieId = 1;
        const mockCreditsResponse: AxiosResponse = {
          data: {
            cast: [
              { name: 'Editor A', known_for_department: 'Editing' },
              { name: 'Actor B', known_for_department: 'Acting' },
            ],
            crew: [
              { name: 'Editor C', known_for_department: 'Editing' },
              { name: 'Director D', known_for_department: 'Directing' },
            ],
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        };
  
        mockedAxios.get.mockResolvedValue(mockCreditsResponse);
        const editors = await getEditorsForMovies(movieId);
        expect(editors).toEqual(['Editor A', 'Editor C']);
        expect(mockedAxios.get).toHaveBeenCalledWith(`/movie/${movieId}/credits?language=en-US`);
      });
  
      it('should return empty array when API call fails', async () => {
        const movieId = 1;
        mockedAxios.get.mockRejectedValue(new Error('Network Error'));
        const editors = await getEditorsForMovies(movieId);
        expect(editors).toEqual([]);
        expect(mockedAxios.get).toHaveBeenCalledWith(`/movie/${movieId}/credits?language=en-US`);
      });
    });
  });
