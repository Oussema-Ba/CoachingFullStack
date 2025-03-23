import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddProviderComponent} from "./add-provider/add-provider.component";
import {ListProvidersComponent} from "./list-providers/list-providers.component";

const routes: Routes = [
  { path: '', component: ListProvidersComponent },
  { path: 'add', component: AddProviderComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
