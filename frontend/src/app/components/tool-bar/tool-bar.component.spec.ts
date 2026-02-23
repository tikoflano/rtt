import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ToolBarComponent } from './tool-bar.component';
import { ServerTimeServiceService } from '../../services/server-time.service';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';

describe('ToolBarComponent', () => {
  let component: ToolBarComponent;
  let fixture: ComponentFixture<ToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ToolBarComponent],
    providers: [
        { provide: ServerTimeServiceService, useValue: { getServerOffset: () => of(0) } },
        { provide: UserService, useValue: { getIsAuthenticated: () => of(false) } }
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
    .compileComponents();

    fixture = TestBed.createComponent(ToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
