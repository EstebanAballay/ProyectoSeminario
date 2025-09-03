  import { ComponentFixture, TestBed } from '@angular/core/testing';

  import { PaginainicioComponent } from './paginainicio.component';

  describe('paginainicioComponent', () => {
    let component: PaginainicioComponent;
    let fixture: ComponentFixture<PaginainicioComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [PaginainicioComponent]
      })
      .compileComponents();

      fixture = TestBed.createComponent(PaginainicioComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
