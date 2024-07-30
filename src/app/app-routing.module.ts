import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxListComponent } from './box-list/box-list.component';
import { BoxInfoComponent } from './box-info/box-info.component';

const routes: Routes = [
  {path:'',component:BoxListComponent,pathMatch:'full'},
  {path:'box-info/:id',component:BoxInfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
