import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { DropdownService } from '@app/shared/services/dropdown.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  standalone: true,
})
export class DropdownComponent implements OnInit, OnDestroy {
  isOpen = false;
  id = crypto.randomUUID(); // unique ID per instance
  private sub!: Subscription;

  @Input() alignRight = false;
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('menu') menuRef!: ElementRef;

  constructor(
    private elRef: ElementRef,
    private dropdownService: DropdownService,
  ) { }

  ngOnInit(): void {
    this.sub = this.dropdownService.dropdownOpened$.subscribe((openedId) => {
      if (openedId !== this.id && this.isOpen) {
        this.isOpen = false;
        this.closed.emit();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  toggle(event: MouseEvent) {
    event.preventDefault();
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.dropdownService.notifyDropdownOpened(this.id);
      this.opened.emit();
    } else {
      this.closed.emit();
    }
  }

  @HostListener('document:click', ['$event'])
  closeIfClickedOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elRef.nativeElement.contains(target)) {
      this.isOpen = false;
      this.closed.emit();
    }
  }
}
