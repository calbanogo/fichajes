import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCompanyPage } from './edit-company.page';

describe('EditCompanyPage', () => {
  let component: EditCompanyPage;
  let fixture: ComponentFixture<EditCompanyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
