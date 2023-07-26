import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TerminalComponent } from './list/terminal.component';
import { TerminalDetailComponent } from './detail/terminal-detail.component';
import { TerminalUpdateComponent } from './update/terminal-update.component';
import TerminalResolve from './route/terminal-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const terminalRoute: Routes = [
  {
    path: '',
    component: TerminalComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TerminalDetailComponent,
    resolve: {
      terminal: TerminalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TerminalUpdateComponent,
    resolve: {
      terminal: TerminalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TerminalUpdateComponent,
    resolve: {
      terminal: TerminalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default terminalRoute;
