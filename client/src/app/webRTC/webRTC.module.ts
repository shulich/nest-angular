import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebRTCComponent } from './webRTC.component';
import { RouterModule } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://128.199.41.162', options: {} };

@NgModule({
    declarations: [WebRTCComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: WebRTCComponent }]),
        SocketIoModule.forRoot(config),
    ],
    providers: [],
})
export class App2Module {}
