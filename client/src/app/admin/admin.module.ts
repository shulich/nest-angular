import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
import { AdminController } from '../../api/admin.controller';
import { EditUserComponent } from './admin/edit-user/edit-user.component';

@NgModule({
    declarations: [AdminComponent, EditUserComponent],
    entryComponents: [AdminComponent, EditUserComponent],
    imports: [CommonModule, ComponentsModule, RouterModule.forChild([{ path: '', component: AdminComponent }])],
    providers: [AdminController],
})
export class AdminModule {}
