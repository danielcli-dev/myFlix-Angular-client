import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})

/**
 *  THIS IS MY CLASS
 */
export class UserProfileComponent implements OnInit {
  user: any = {};
  localUser: any = {};
  localUsername: string = '';
  favorite: string = '';
  favorites: any[] = [];
  movies: any[] = [];
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}
  // Initializes variables to be assigned when input forms are filled
  @Input() userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };
// function triggerred on component creation at beginning of lifecycle
  ngOnInit(): void {
    this.getUserName();
    this.getUser();
    this.getMovies();
  }

  /**
   * 
   */
  goBack(): void {
    this.router.navigate(['movies']);
  }
  getUserName(): void {
    this.localUser = localStorage.getItem('user');
    this.localUsername = JSON.parse(this.localUser).Username;
  }

  getUser(): void {
    this.fetchApiData.getUser(this.localUsername).subscribe((resp: any) => {
      this.user = resp;
      this.userData.Username = this.user.Username;
      this.userData.Email = this.user.Email;
      this.userData.Birthday = this.user.Birthday.slice(0, 10);
      this.favorites = this.user.FavoriteMovies;
    });
  }

  editUser(): void {
    if (this.userData.Password) {
      this.fetchApiData.editUser(this.localUsername, this.userData).subscribe(
        (result) => {
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', result.token);
          this.snackBar.open(result, 'OK', {
            duration: 2000,
          });
          this.router.navigate(['/']);
        },
        (result) => {
          this.snackBar.open(result, 'OK', {
            duration: 2000,
          });
        }
      );
    } else {
      this.snackBar.open('Update failed', 'OK', {
        duration: 2000,
      });
    }
  }
  deleteUser(): void {
    if (
      confirm(
        `Are you sure you want to delete your account?`
      )
    ) {
      this.fetchApiData
        .deleteUser(this.localUsername)
        .subscribe((resp: any) => {
          this.snackBar.open(resp, 'OK', {
            duration: 2000,
          });
          this.router.navigate(['/']);
        });
    }
  }
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.favoriteMovies = this.movies.filter((movie) => {
        if (this.favorites.includes(movie._id)) {
          return movie;
        }
      });
      return this.movies;
    });
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
        this.getUser();
        this.getMovies();
        return this.favorite;
      });
    } else if (this.favorites.includes(id)) {
      this.fetchApiData.deleteFavoriteMovie(name, id).subscribe((resp: any) => {
        this.favorite = resp;
        this.getUser();
        this.getMovies();
        return this.favorite;
      });
    }
  }
}
