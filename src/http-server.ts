import * as logger from './utils/logger.ts'
import * as dbConnection from './db-connection.ts'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'
import { type Movie } from './models/movie.ts'

const HTTP_PORT: number = parseInt(process.env.HTTP_PORT || '8080', 10)
const API_MOVIES_ID_REGEX: RegExp = /^\/api\/movies\/(\d*)$/

const isPathname = (req: Request, pathname: string): boolean => new URL(req.url).pathname === pathname
const pathnameRegExTest = (req: Request, regex: RegExp): boolean => regex.test(new URL(req.url).pathname)
const isGet = (req: Request): boolean => req.method === 'GET'
const isPost = (req: Request): boolean => req.method === 'POST'
const isDelete = (req: Request): boolean => req.method === 'DELETE'

const server = Bun.serve({
  port: HTTP_PORT,
  async fetch(req: Request): Promise<Response> {
    if (isGet(req) && isPathname(req, '/api/movies')) {
      logger.info('Get all movies')
      return dbConnection.getAllMovies()
        .then(movies => new Response(
          JSON.stringify(snakecaseKeys(movies)),
          { headers: { 'Content-Type': 'application/json' }}
        ))
    }

    if (isPost(req) && isPathname(req, '/api/movies')) {
      const movie: Movie = camelcaseKeys(await req.json())
      logger.info(`Post movie with id ${movie.id}`)
      return dbConnection.saveMovie(movie)
        .then(() => new Response())
    }

    if (isDelete(req) && pathnameRegExTest(req, API_MOVIES_ID_REGEX)) {
      const movieId: number = parseInt(API_MOVIES_ID_REGEX.exec(new URL(req.url).pathname)?.[1] || '', 10)
      if (movieId) {
        logger.info(`Delete movie with id ${movieId}`)
        return dbConnection.deleteMoveById(movieId)
          .then(() => new Response())
      }
    }

    return new Response('404 Not Found', { status: 404 })
  },
})

logger.info(`Application is listening on port ${server.port}`)
