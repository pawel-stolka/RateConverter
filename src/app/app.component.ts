import { Component } from '@angular/core';
import { RateConverterComponent } from './rate-converter/rate-converter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RateConverterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'rate converter';
}
