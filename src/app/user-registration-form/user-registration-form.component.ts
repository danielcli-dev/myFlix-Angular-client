import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * Add modules to the UserRegistrationForm
   * @param fetchApiData service for making API calls
   * @param dialogRef module for creating dialog or modals
   * @param snackBar module for creating temporary prompts or messages
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  // void is the opposite of any type. means it is typeless. use for functions that do not return a value
  ngOnInit(): void {}
  
  /**
   * This method makes an API call to create a new user
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        this.dialogRef.close(); 

        this.snackBar.open(
          result.Username + ' has been successfully registered',
          '',
          {
            duration: 2000,
          }
        );
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
