import { Component } from '@angular/core';
import { FacilityPageComponent } from './components/facility-page/facility-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FacilityPageComponent],
  template: `
    <app-facility-page></app-facility-page>
  `,
})
export class AppComponent {}
