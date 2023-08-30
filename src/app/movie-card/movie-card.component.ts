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
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
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
}
