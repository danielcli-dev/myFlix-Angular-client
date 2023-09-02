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
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  getFavorites(): void {
    this.fetchApiData
      .getFavoriteMovies(this.localUsername)
      .subscribe((resp: any) => {
        this.favorites = resp;
        return this.favorites;
      });
  }

  goToProfile(): void {
    this.router.navigate(['profile']);
  }
  getMovieGenre(name: string, details: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: name,
        text: details,
      },
    });
  }
  getMovieDirector(name: string, details: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: name,
        text: details,
      },
    });
  }

  getMovieSynopsis(details: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: 'Synopsis',
        text: details,
      },
    });
  }

  toggleMovieFavorite(name: string, id: any): void {
    if (!this.favorites.includes(id)) {
      this.fetchApiData.addFavoriteMovie(name, id).subscribe((resp: any) => {
        this.favorite = resp;
        this.getFavorites();
        return this.favorite;
      });
    } else if (this.favorites.includes(id)) {
      this.fetchApiData.deleteFavoriteMovie(name, id).subscribe((resp: any) => {
        this.favorite = resp;
        this.getFavorites();
        return this.favorite;
      });
    }
  }
  
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
