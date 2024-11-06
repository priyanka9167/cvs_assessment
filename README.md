# Movie API Application

This application provides an API to retrieve movies along with their editors from `cast` and `crew` based on a given year and page number. It fetches data from an external API and formats the results for clients.

## Features

- Fetch movies released in a specific year.
- Include editor information for each movie from `cast` as well as `crew`.
- Support pagination with the `page` parameter.
- Logging for every request.
- Error handling with custom error messages.

## Prerequisites

- **Node.js** (version 12 or higher)
- **npm** (version 6 or higher)

## Getting Started

### Installation

1. **Clone the repository**

   ```
   git clone https://github.com/priyanka9167/cvs_assessment.git
   cd cvs_assessment
   ```

2. **Install dependencies**
   ```
   npm install
   ```

### Configuration

1. **Environment Variables**

   - Copy the `env.template` file and rename it to `.env`.

     cp env.template .env

   - Open the `.env` file and add your bearer token:
     ```
     TOKEN_SECRET=your_bearer_token_here
     ```
     Note: You need a bearer token to authenticate with the external API. Obtain this token from the API provider.

### Running the Application

- **Development Mode**

  ```
  npm run dev
  ```

  This will start the server on the default port (e.g., `8000`).

## API Documentation

### GET `/api/movies`

Retrieve movies released in a specific year, including their editors.

#### Query Parameters

- `year` (required): The release year of the movies. Must be a 4-digit number in `YYYY` format.
- `page` (optional): The page number for pagination. Defaults to `1` if not provided.

#### Example Request

GET /api/movies?year=2020&page=1

#### Example Response

{
  "success": true,
  "data": [
    {
      "title": "Movie Title",
      "release_date": "January 1, 2020",
      "vote_average": 8.5,
      "editors": ["Editor Name 1", "Editor Name 2"]
    },
    {
      "title": "Another Movie",
      "release_date": "February 14, 2020",
      "vote_average": 7.8,
      "editors": ["Editor Name 3"]
    }
    // ...more movies
  ]
}

#### Error Responses

- **400 Bad Request**

  {
    "message": "Invalid query parameters",
    "status": 400,
    "name": "CustomError",
    "additionalInfo": "Year parameter must be a valid YYYY format"
  }

- **500 Internal Server Error**

  {
    "message": "Internal Server Error",
    "status": 500,
    "name": "Error",
    "additionalInfo": "Error message details"
  }

## External APIs

This application uses the following third-party APIs to fetch movie and editor data:

- **Discover Movie API**: Used to discover movies based on a specific year.
  - **URL**: `https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&primary_release_year=&sort_by=popularity.desc`
  - **Parameter**: The year is set by the user of your API.

- **Movie Credits API**: Used to fetch the credits for a specific movie, including editors.
  - **URL**: [Movie Credit API Reference](https://developer.themoviedb.org/reference/movie-credits)
  - **Filter**: To find editors, filter for `known_for_department` set to `"Editing"` and use the `name` property.

## Setting Up the Bearer Token

1. **Obtain the API Token**
   - Register and obtain an API token from the external API provider.

2. **Add the Token to Environment Variables**
   - Open the `.env` file.
   - Add your token:
    ```
    TOKEN_SECRET=your_bearer_token_here.
    ```

## Logging

The application logs every request using [Morgan](https://github.com/expressjs/morgan) middleware.

- **Logs Include:**
  - HTTP method
  - Request URL
  - Status code
  - Response time

**Example Log Output:**

GET /api/movies?year=2020&page=1 200 45ms

## Error Handling

Custom error handling is implemented to provide meaningful error messages. Errors include:

- Missing or invalid parameters
- External API errors
- Internal server errors

## Testing


### Running Tests

npm test

## Project Structure

- `src/`
  - `controller/` - Contains route controllers.
  - `routes/` - Defines API routes.
  - `service/` - Handles business logic and external API calls.
  - `middlewares/` - Custom middleware functions (e.g., error handling, logging).
  - `config/` - Configuration files (e.g., Axios instance).
  - `models/` - Custom models (e.g., `CustomError` class).
  - `types/` - TypeScript type definitions.
  - `__tests__/` - Test files.
  - `env.template` - Template for environment variables.

## Scripts

- npm run dev - Runs the application in development mode.
- npm test - Runs the test suite.

## Dependencies

- **Express** - Web framework.
- **Axios** - HTTP client for making API requests.
- **Morgan** - HTTP request logger middleware.
- **Jest** - Testing framework.
- **Supertest** - HTTP assertions for testing Express APIs.

## License

This project is licensed under the MIT License.

## Contact

For questions, please contact [priyankachaurasia9167@gmail.com](mailto:priyankachaurasia9167@gmail.com).

---

