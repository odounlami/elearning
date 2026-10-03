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
  gsap.to(root.querySelectorAll('.js-float'), {
    y: -9,
    rotation: '+=1.5',
    duration: 2.2,
    stagger: 0.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}
