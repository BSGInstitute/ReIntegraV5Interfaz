import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  constructor() {}

  @Input() public value: number;
  @Input() public max: number;

  public stars: number[];

  public ngOnInit(): void {
    this.stars = new Array(this.max).fill(1).map((item, index) => item + index);
  }

  public ratingIcon(item: number): string {
    return item <= this.value
      ? 'k-icon k-i-star yellow'
      : 'k-icon k-i-star-outline';
  }
}
