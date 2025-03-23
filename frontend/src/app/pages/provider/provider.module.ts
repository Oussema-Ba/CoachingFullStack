import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProviderRoutingModule } from './provider-routing.module';
import { AddProviderComponent } from './add-provider/add-provider.component';
import { ListProvidersComponent } from './list-providers/list-providers.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {UiSwitchModule} from "ngx-ui-switch";


@NgModule({
  declarations: [
    AddProviderComponent,
    ListProvidersComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    ReactiveFormsModule,
    NgbPagination,
    UiSwitchModule
  ]
})
export class ProviderModule { }
