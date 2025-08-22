import {
  AfterViewInit,
  Directive,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { TabStripComponent, TabStripTabComponent } from '@progress/kendo-angular-layout';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[loadOnDemand]',

  // selector: '[appTabContentLoadOnDeman]'
})
export class TabContentLoadOnDemanDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  protected s: Subscription = new Subscription();
  protected wasLoaded: boolean = false;

  constructor(
    private tabStripComponent: TabStripComponent,
    private tabStripTabComponent: TabStripTabComponent,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  public ngOnInit(): void {
    if (!this.tabStripComponent || !this.tabStripTabComponent) {
        return;
    }
    this.tabStripComponent.keepTabContent = true;

    this.s.add(
      this.tabStripComponent.tabSelect.subscribe(this.tabSelectEx.bind(this))
    );
    if (this.tabStripTabComponent.selected) {
      this.loadMe();
    }
  }

  public ngAfterViewInit(): void {
    // if (this.tabStripTabComponent.selected) {
    //   this.loadMe();
    // }
  }

  public ngOnDestroy(): void {
    this.s.unsubscribe();
  }

  protected loadMe(): void {
    if (!this.wasLoaded) {
      this.wasLoaded = true;
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  protected unloadMe(): void {
    if (this.wasLoaded) {
      this.wasLoaded = false;
      this.viewContainer.clear();
    }
  }

  protected tabSelectEx(e: any): void {
    if (e.title === this.tabStripTabComponent.title) {
      this.loadMe();
    }
  }
}
