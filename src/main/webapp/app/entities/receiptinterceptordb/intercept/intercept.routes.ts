import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InterceptComponent } from './list/intercept.component';
import { InterceptDetailComponent } from './detail/intercept-detail.component';
import { InterceptUpdateComponent } from './update/intercept-update.component';
import InterceptResolve from './route/intercept-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const interceptRoute: Routes = [
  {
    path: '',
    component: InterceptComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InterceptDetailComponent,
    resolve: {
      intercept: InterceptResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InterceptUpdateComponent,
    resolve: {
      intercept: InterceptResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InterceptUpdateComponent,
    resolve: {
      intercept: InterceptResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default interceptRoute;
