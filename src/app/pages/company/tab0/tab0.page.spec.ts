import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab0Page } from './tab0.page';

describe('Tab1Page', () => {
  let component: Tab0Page;
  let fixture: ComponentFixture<Tab0Page>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Tab0Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
