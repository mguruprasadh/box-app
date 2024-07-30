import { Component } from '@angular/core';
import { BoxService } from '../box.service';
import { Box } from '../box.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-boxlist',
  templateUrl: './box-list.component.html',
  styleUrls: ['./box-list.component.scss']
})
export class BoxListComponent {
  boxes: Box[] = [];
  newBox: Partial<Box> = {};  

  constructor(private boxService: BoxService,private router:Router) {}

  ngOnInit(): void {
    this.loadBoxes();
  }

  loadBoxes(): void {
    this.boxService.getBoxes().subscribe(
      (data: Box[]) => {
        this.boxes = data;
      },
      (error) => {
        console.error('Error loading boxes', error);
      }
    );
  }

  deleteBox(id: number): void {
    this.boxService.deleteBox(id).subscribe(
      () => {
        this.loadBoxes(); // Reload boxes after deletion
      },
      (error) => {
        console.error('Error deleting box', error);
      }
    );
  }

  onAddBox(): void {
    if (!this.newBox.title || !this.newBox.size) {
      // Basic validation (optional)
      return;
    }

    this.boxService.createBox(this.newBox as Box).subscribe(
      (box) => {
        this.boxes.push(box); // Add the new box to the list
        this.newBox = {}; // Reset the form
      },
      (error) => {
        console.error('Error adding box', error);
      }
    );
  }
  onTitleAnchor(id: number) {
    this.router.navigate(['/box-info', id]);
  }
 
}
