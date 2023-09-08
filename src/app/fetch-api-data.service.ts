import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Declaring the api url that will provide data for the client app
 */
const apiUrl = 'https://cfdb-movie-api-59ec69f25db6.herokuapp.com/';
@Injectable({
  providedIn: 'root',
})


export class FetchApiDataService {

  /**
   * This will provide HttpClient to the entire class, making it available via this.http
   * @param http Inject the HttpClient module to the constructor params
   */
  constructor(private http: HttpClient) {}
  
  /**
   * Making the api call for user registration
   * @param userDetails 
   * @returns object with user data
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Making the api call for user login
   * @param userDetails 
   * @returns object with user data
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Making the api call for getting movies
   * @returns object with all movies data
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for getting a specific movie data
   * @param title 
   * @returns object with a specific movie's data
   */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for getting a movie's director data
   * @param name 
   * @returns object with director's data
   */
  getDirector(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/director/' + name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for getting movie's genre data
   * @param genre 
   * @returns object with movie's genre data
   */
  getGenre(genre: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/genre/' + genre, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for getting user data
   * @param name 
   * @returns object with user data
   */
  getUser(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for getting user's favorite movies
   * @param name 
   * @returns object with user's favorite movies as id
   */
  getFavoriteMovies(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.FavoriteMovies),
        catchError(this.handleError)
      );
  }

  /**
   * Making the api call for adding favorite movie to user's favorite movies
   * @param name 
   * @param id 
   * @returns object of added movie
   */
  addFavoriteMovie(name: string, id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .post(
        apiUrl + 'users/' + name + '/add/' + id,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for deleting favorite movie from user's favorite movies
   * @param name 
   * @param id 
   * @returns object of deleted movie
   */
  deleteFavoriteMovie(name: string, id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + name + '/remove/' + id, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for editing user's data
   * @param name 
   * @param userDetails 
   * @returns object with user's updated data
   */
  editUser(name: string, userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + name, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for deleting  user
   * @param name 
   * @returns text confirming user deletion
   */
  deleteUser(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + name + '/deregister', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text',
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
 
  /**
   * Non-typed response extraction
   * @param res 
   * @returns 
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Default error handler
   * @param error 
   * @returns 
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
