import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoxService } from '../box.service';

@Component({
  selector: 'app-box-info',
  templateUrl: './box-info.component.html',
  styleUrls: ['./box-info.component.scss']
})
export class BoxInfoComponent {
  boxDetails: any;

  constructor(
    private route: ActivatedRoute,
    private boxService: BoxService,
    private router:Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: { [x: string]: string | number; }) => {
      const id = +params['id']; // Convert to number
      this.getBoxInfo(id);
    });
  }

  getBoxInfo(id: number) {
    this.boxService.getBoxById(id).subscribe(
      (data: any) => {
        this.boxDetails = data;
      },
      (error: any) => {
        console.error('Error fetching box info:', error);
      }
    );
  }
  goBack() {
    this.router.navigate(['']); // Navigate back to the root or change the path as needed
  }
}
