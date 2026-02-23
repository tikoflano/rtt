import { TestBed } from '@angular/core/testing';
import { AutofocusDirective } from './autofocus.directive';
import { MatInputModule } from '@angular/material/input';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: '<input matInput matInputAutofocus>',
  standalone: false,
})
class TestComponent {}

describe('AutofocusDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      declarations: [AutofocusDirective, TestComponent],
      imports: [MatInputModule],
    });
    const fixture = TestBed.createComponent(TestComponent);
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
  });
});
