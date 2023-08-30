import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  user: any = {};
  localUser: any = {};
  localUsername: string = '';
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}
  @Input() userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };

  ngOnInit(): void {
    this.getUserName();
    this.getUser();
  }

  goBack(): void {
    this.router.navigate(['movies']);
  }
  getUserName(): void {
    this.localUser = localStorage.getItem('user');
    this.localUsername = JSON.parse(this.localUser).Username;
    // this.favorites = JSON.parse(this.localUser).FavoriteMovies;
  }

  getUser(): void {
    this.fetchApiData.getUser(this.localUsername).subscribe((resp: any) => {
      this.user = resp;
      this.userData.Username = this.user.Username;
      // this.userData.Password = this.user.Password;
      this.userData.Email = this.user.Email;
      this.userData.Birthday = this.user.Birthday.slice(0, 10);
      this.favorites = this.user.FavoriteMovies;
      console.log(this.favorites);
    });
  }
  editUser(): void {
    if (this.userData.Password) {
      this.fetchApiData.editUser(this.localUsername, this.userData).subscribe(
        (result) => {
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', result.token);
          console.log(result);
          this.snackBar.open(result, 'OK', {
            duration: 2000,
          });
          this.router.navigate(['/']);
        },
        (result) => {
          console.log(result);
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
  getFavorites(): void {
    this.fetchApiData.getFavoriteMovies(this.localUsername).subscribe(
      (result) => {
        console.log(result);
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
        this.router.navigate(['/']);
      },
      (result) => {
        console.log(result);
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
