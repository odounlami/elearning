import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { revealPage } from '../../shared/utils/page-motion';

@Component({imports:[FormsModule,RouterLink],templateUrl:'./forgot-password.html'})
export class ForgotPassword implements AfterViewInit {
  private readonly host=inject(ElementRef<HTMLElement>);
  email='';sent=false;
  ngAfterViewInit(){revealPage(this.host);}
  submit(){if(this.email.trim())this.sent=true;}
}