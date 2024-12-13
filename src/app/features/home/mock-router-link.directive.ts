import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[routerLink]',
  host: {
    '(click)': 'navigate()',
  },
})
export class MockRouterLinkDirective {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  navigate() {
    this.navigatedTo = this.linkParams;
  }
}
