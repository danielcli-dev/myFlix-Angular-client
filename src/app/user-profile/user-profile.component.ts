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
export class UserProfileComponent implements OnInit {
  user: any = {};
  localUser: any = {};
  localUsername: string = '';
  favorite: string = '';
  favorites: any[] = [];
  movies: any[] = [];
  favoriteMovies: any[] = [];

  /**
   * @param fetchApiData service for making API calls
   * @param snackBar module for creating temporary prompts or messages
   * @param router module for navigating between different routes
   * @param dialog module for creating dialog or modals
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  /**
   * Initializes variables to be assigned when input forms are filled
   */
  @Input() userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };
  /**
   * On initialization, methods are called to populate initial values
   */
  ngOnInit(): void {
    this.getUserName();
    this.getUser();
    this.getMovies();
  }

  /**
   * This method uses the router module to navigate to the movies route
   */
  goBack(): void {
    this.router.navigate(['movies']);
  }

  /**
   * This method retrieves data from local storage
   */
  getUserName(): void {
    this.localUser = localStorage.getItem('user');
    this.localUsername = JSON.parse(this.localUser).Username;
  }

  /**
   * This method makes API call to retrieve user data
   */
  getUser(): void {
    this.fetchApiData.getUser(this.localUsername).subscribe((resp: any) => {
      this.user = resp;
      this.userData.Username = this.user.Username;
      this.userData.Email = this.user.Email;
      this.userData.Birthday = this.user.Birthday.slice(0, 10);
      this.favorites = this.user.FavoriteMovies;
    });
  }

  /**
   * This method edits the user data on the database and sets the user and token in the local storage
   */
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

  /**
   * This method makes API call to delete user from database
   */
  deleteUser(): void {
    if (confirm(`Are you sure you want to delete your account?`)) {
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

  /**
   * This method makes an API call to retrieve an array of all the movies
   */
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
