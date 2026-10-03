import { ElementRef } from '@angular/core';
import { gsap } from 'gsap';

export function revealPage(host: ElementRef<HTMLElement>): void {
  const root = host.nativeElement;

  gsap.from(root.querySelectorAll('.js-reveal'), {
    y: 18,
    opacity: 0,
    duration: 0.6,
    stagger: 0.06,
    ease: 'power2.out',
    clearProps: 'transform,opacity',
  });
}

export function floatBooks(host: ElementRef<HTMLElement>): void {
  const root = host.nativeElement;
  const book = root.querySelector('.js-book');

  if (!book) return;

  gsap.to(book, {
    y: -4,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}
