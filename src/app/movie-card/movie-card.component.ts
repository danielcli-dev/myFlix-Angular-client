import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  localUser: any = {};
  localUsername: string = '';
  movies: any[] = [];
  favorite: any = {};
  favorites: any = [];
  favorited: boolean = true;
  buttonStyle: any = {};
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserName();
    this.getMovies();
    this.getFavorites();
  }
  // Functions for retrieving data from local storage or for triggering API calls
  getUserName(): void {
    this.localUser = localStorage.getItem('user');
    this.localUsername = JSON.parse(this.localUser).Username;
  }

  /**
   * This method makes an API call to retrieve an array of all the movies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      // return this.movies;
    });
  }

  /**
   * This method makes an API call to retrieve the user's favorite movies
   * @return {array} Favorite Movies array
   */
  getFavorites(): void {
    this.fetchApiData
      .getFavoriteMovies(this.localUsername)
      .subscribe((resp: any) => {
        this.favorites = resp;
        // return this.favorites;
      });
  }

  /**
   *  This method redirects to the profile route
   */
  goToProfile(): void {
    this.router.navigate(['profile']);
  }
  /**
   * This method displays the movie genre details using Movie Details Dialog

   * @param name
   * @param details
   */
  getMovieGenre(name: string, details: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: name,
        text: details,
      },
    });
  }
  /**
   * This method displays the movie director details using Movie Details Dialog
   * @param name
   * @param details
   */
  getMovieDirector(name: string, details: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: name,
        text: details,
      },
    });
  }

  /**
   * This method displays the movie synopsis details using Movie Details Dialog
   * @param details
   */
  getMovieSynopsis(details: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: 'Synopsis',
        text: details,
      },
    });
  }

  /**
   * This method either adds or removes the movie from the user's favorite movies
   * @param name username
   * @param id movie id
   */
  toggleMovieFavorite(name: string, id: any): void {
    if (!this.favorites.includes(id)) {
      this.fetchApiData.addFavoriteMovie(name, id).subscribe((resp: any) => {
        this.favorite = resp;
        this.getFavorites();
        // return this.favorite;
      });
    } else if (this.favorites.includes(id)) {
      this.fetchApiData.deleteFavoriteMovie(name, id).subscribe((resp: any) => {
        this.favorite = resp;
        this.getFavorites();
        // return this.favorite;
      });
    }
  }

  /**
   *  This method clears local storage and redirects to home page
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
