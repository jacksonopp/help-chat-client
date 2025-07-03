import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import {ButtonModule} from 'primeng/button'
import { environment } from '../environment';

@Component({
  imports: [NxWelcome, RouterModule, ButtonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'help-chat-portal';
  environment = environment
}
