import { Component, ViewEncapsulation } from '@angular/core';
import { ITopBarModel } from '../../shared/components/topbar/topbar.interface';
import { AdminController } from '../../../api/admin.controller';
import { App, Permission, User } from 'shared/models';
import { ColumnDef } from 'mat-virtual-table';
import { MatDialog, MatSnackBar } from '@angular/material';
import { EditUserComponent } from './edit-user/edit-user.component';
import { last } from 'lodash';

@Component({
    selector: 'p-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AdminComponent {
    topbarModel: ITopBarModel = { logoutTitle: 'logout', routerLinks: [], menuItems: [] };
    users: User[];
    app: App;
    columns: ColumnDef[] = [
        { field: 'edit', title: ' ', width: '70px', isSortable: false },
        { field: 'email', title: 'מייל' },
        { field: 'company', title: 'חברה' },
        { field: 'name', title: 'שם' },
        { field: 'phone', title: 'טלפון' },
        { field: 'permission', title: 'הרשאה' },
        { field: 'details', title: 'פרטים נוספים' },
    ];

    constructor(private api: AdminController, private dialog: MatDialog, private snackBar: MatSnackBar) {
        this.app = last(window.location.pathname.split('/')) as App;
        this.api.users(this.app).then(users => (this.users = users));
    }

    openEditUserDialog(id?: string): void {
        const dialogRef = this.dialog.open(EditUserComponent, {
            width: '80%',
            maxWidth: '540px',
            data: id
                ? { ...this.users.find(user => user.id === id) }
                : new User({ roles: [{ app: this.app, permission: Permission.user }] }),
            direction: 'rtl',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const relevant = this.users.find(user => user._id === result._id);
                if (!relevant) {
                    this.users = this.users.concat([new User(result)]);
                } else {
                    Object.keys(result).forEach(key => (relevant[key] = result[key]));
                }
                this.api.addUser(result).then(saveResult => {
                    if (!saveResult.ok) {
                        // tslint:disable-next-line:no-console
                        console.error('not saved!');
                        return;
                    }

                    this.snackBar.open('נשמר', 'בטל', {
                        duration: 2000,
                    });
                });
            }
        });
    }
}
