
import { Injectable, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class UrlService{
  private previousUrl: string;
  private currentUrl: string;

  constructor(private location: Location) {
    this.currentUrl = this.location.path();

    // Registrar cambios en la URL
    this.location.onUrlChange((url: string) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = url;
    });
  }

  getCurrentUrl(): string {
    return this.currentUrl;
  }

  getPreviousUrl(): string {
    return this.previousUrl;
  }
}
