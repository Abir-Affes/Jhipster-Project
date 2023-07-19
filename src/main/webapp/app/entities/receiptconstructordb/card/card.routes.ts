import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CardComponent } from './list/card.component';
import { CardDetailComponent } from './detail/card-detail.component';
import { CardUpdateComponent } from './update/card-update.component';
import CardResolve from './route/card-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const cardRoute: Routes = [
  {
    path: '',
    component: CardComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CardDetailComponent,
    resolve: {
      card: CardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CardUpdateComponent,
    resolve: {
      card: CardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CardUpdateComponent,
    resolve: {
      card: CardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default cardRoute;
