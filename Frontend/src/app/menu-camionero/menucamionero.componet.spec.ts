import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenucamioneroComponent } from './menucamionero.component';
 
describe('Menucamionero', () => {
  let component: MenucamioneroComponent;
  let fixture: ComponentFixture<MenucamioneroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenucamioneroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenucamioneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
