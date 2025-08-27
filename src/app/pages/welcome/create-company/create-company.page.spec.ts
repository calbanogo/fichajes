import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCompanyPage } from './create-company.page';

describe('CreateCompanyPage', () => {
  let component: CreateCompanyPage;
  let fixture: ComponentFixture<CreateCompanyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
