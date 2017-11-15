using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using MovieApp.Models;

namespace MovieApp.Controllers
{
    [RoutePrefix("Api/Movies")]
    public class MoviesController : ApiController
    {
        private MovieAppContext db = new MovieAppContext();

        //Get Owned Movies
        [Route("OwnedMovies")]
        public List<Movie> GetMovies()
        {
            return db.Movie.Where(x => x.IsOwned == true && x.IsActive).ToList();
        }

        [Route("User")]
        public User GetUser(int userId)
        {
            return db.Users.FirstOrDefault(x => x.Id == userId);
        }

        //Get Wanted Movies
        [Route("WantedMovies")]
        public List<Movie> GetWantedMovies()
        {
            return db.Movie.Where(x => !x.IsOwned && x.IsActive).ToList();
        }

        //Get Movie
        [Route("GetMovie")]
        public IHttpActionResult GetMovie(int id)
        {
            var movie = db.Movie.FirstOrDefault(x => x.Id == id);

            return Ok(movie);
        }

        // PUT: api/Movies/5
        [Route("SaveMovie")]
        public IHttpActionResult PostMovie([FromBody]Movie movie)
        {
            if (movie.Id == 0)
            {
                db.Movie.Add(movie);                
            }
            else
            {
                var existingMovie = db.Movie.FirstOrDefault(x => x.Id == movie.Id);
                existingMovie.Description = movie.Description;
                existingMovie.IsActive = movie.IsActive;
                existingMovie.IsOwned = movie.IsOwned;
                existingMovie.Price = movie.Price;
                existingMovie.Title = movie.Title;
            }

            db.SaveChanges();

            return Ok();
        }

        // DELETE: api/Movies/5
        [Route("DeleteMovie")]
        public IHttpActionResult DeleteMovie(int id)
        {
            var deletedMovie = db.Movie.FirstOrDefault(x => x.Id == id);
            db.Movie.Remove(deletedMovie);
            db.SaveChanges();
            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MovieExists(int id)
        {
            return db.Movie.Count(e => e.Id == id) > 0;
        }
    }
}