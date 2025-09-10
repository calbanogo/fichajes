import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appFocusFix]'
})
export class FocusFixDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;
    const isFocused = document.activeElement === element;

    if (isFocused && this.hasAriaHiddenAncestor(element)) {
      console.warn('Elemento enfocado dentro de aria-hidden. Corrigiendo...');
      this.removeAriaHiddenFromAncestors(element);
    }
  }

  private hasAriaHiddenAncestor(el: HTMLElement): boolean {
    let parent = el.parentElement;
    while (parent) {
      if (parent.hasAttribute('aria-hidden')) return true;
      parent = parent.parentElement;
    }
    return false;
  }

  private removeAriaHiddenFromAncestors(el: HTMLElement): void {
    let parent = el.parentElement;
    while (parent) {
      if (parent.hasAttribute('aria-hidden')) {
        parent.removeAttribute('aria-hidden');
      }
      parent = parent.parentElement;
    }
  }
}