import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
@Component({selector:'app-header',imports:[RouterLink,RouterLinkActive],templateUrl:'./header.html'}) export class Header { readonly auth=inject(AuthService); menuOpen=false; }