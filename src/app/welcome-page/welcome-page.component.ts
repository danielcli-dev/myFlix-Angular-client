import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  
  /**
   * This will provide MatDialog to the entire class, making it available via this.dialog
   * @param dialog Inject the MatDialog module to the constructor params
   */
  constructor(public dialog: MatDialog) {}
  ngOnInit(): void {}
  /**
   * This method opens the UserRegistrationForm component
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

   /**
   * This method opens the UserLoginForm component
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
