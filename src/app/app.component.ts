import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RateConverter2Component } from './rate-converter2/rate-converter2.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RateConverter2Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'rate-exchange';
}
