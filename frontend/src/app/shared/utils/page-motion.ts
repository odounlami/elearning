import { ElementRef } from '@angular/core';
import { gsap } from 'gsap';

export function revealPage(host: ElementRef<HTMLElement>): void {
  const root = host.nativeElement;
  gsap.from(root.querySelectorAll('.js-reveal'), {
    y: 22,
    opacity: 0,
    duration: 0.65,
    stagger: 0.07,
    ease: 'power3.out',
    clearProps: 'transform,opacity',
  });
}

export function floatBooks(host: ElementRef<HTMLElement>): void {
  const root = host.nativeElement;
  const books = root.querySelectorAll('.js-float');
  gsap.to(books, {
    y: -10,
    rotation: '+=1.8',
    duration: 2.4,
    stagger: 0.22,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
  gsap.to(root.querySelector('.js-book'), {
    y: -5,
    rotation: '+=1',
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}