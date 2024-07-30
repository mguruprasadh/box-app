import { Output, EventEmitter } from '@angular/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent {
  @Input()
  id!: any;
  @Input()
  title!: string;
  @Input()
  size!: number;

  @Output() delete = new EventEmitter<number>(); // EventEmitter for the delete action
  @Output() titleAnchor = new EventEmitter<number>(); // EventEmitter for the delete action


  // Method to emit the delete event
  onDelete(): void {
    this.delete.emit(this.id);
  }
  onTitle():void{
    this.titleAnchor.emit(this.id);
  }
  
  
}
