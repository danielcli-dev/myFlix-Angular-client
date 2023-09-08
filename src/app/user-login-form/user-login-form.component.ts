import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  /**
   * @param fetchApiData service for making API calls
   * @param snackBar module for creating temporary prompts or messages
   * @param router module for navigating between different routes
   * @param dialog module for creating dialog or modals
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * This method makes an API call to login and set user and token in local storage
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.dialogRef.close(); 

        this.snackBar.open(result.user.Username + ' has been signed in!', "", {
          duration: 2000,
        });  
        this.router.navigate(['movies']);
      },
      (result) => {
        this.snackBar.open('OK');
      }
    );
  }
}
