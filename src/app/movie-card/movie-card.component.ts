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
  favorited: boolean = false;
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserName();
    this.getMovies();
  }
  getUserName(): void {
    this.localUser = localStorage.getItem('user');
    this.localUsername = JSON.parse(this.localUser).Username;
    // this.favorites = JSON.parse(this.localUser).FavoriteMovies;
  }
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log('movies are', this.movies);
      return this.movies;
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
  addMovieFavorite(username: string, id: any): void {
    // if (!this.favorited) {
    this.fetchApiData
      .addFavoriteMovie(username, '64309db721a224b46238c9b0')
      .subscribe((resp: any) => {
        return resp;
      });
    // } else if (this.favorited) {
    //   this.fetchApiData
    //     .deleteFavoriteMovie(username, id)
    // .subscribe((resp: any) => {});
    // }
  }
}
