# Distributed Rate Limiter

This project implements a distributed rate limiter using Node.js, Express, and Redis. It is designed to control the rate of requests to an application, ensuring fair usage and preventing abuse.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/distributed-rate-limiter.git
   ```

2. Navigate to the project directory:
   ```
   cd distributed-rate-limiter
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables. You can use the provided `.env.example` as a reference.

## Usage

To start the application, run the following command:
```
npm start
```

The server will start and listen on the specified port. You can then make requests to the defined routes.

## Configuration

The rate limiting settings can be adjusted in the `config/rateLimitConfig.js` file. You can set limits, time windows, and other parameters as needed.

Make sure to configure your Redis connection in the `.env` file to enable distributed rate limiting.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.