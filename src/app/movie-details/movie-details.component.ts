import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})


export class MovieDetailsComponent implements OnInit {
  constructor(
    /**
     * Inject allows for the passing of data when component is opened
     */
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      text: string;
    }
  ) {}

  ngOnInit(): void {}
}
