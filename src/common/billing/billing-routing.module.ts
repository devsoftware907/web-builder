import { Route, RouterModule } from '@angular/router';
import { UpgradePageComponent } from './upgrade-page/upgrade-page.component';
import { NgModule } from '@angular/core';
import { BillingPlansResolver } from './upgrade-page/billing-plans-resolver.service';
import { UserSubscriptionPageComponent } from './subscriptions/user-subscription-page/user-subscription-page.component';
import { CurrenciesListResolver } from './upgrade-page/currencies-list-resolver.service';
import { UserSubscribedGuard } from './guards/user-subscribed-guard.service';
import { AuthGuard } from '../guards/auth-guard.service';
import { BillingEnabledGuard } from '../shared/billing/guards/billing-enabled-guard.service';
import { InvoiceIndexComponent } from '@common/billing/invoices/invoice-index/invoice-index.component';
import { CheckPermissionsGuard } from '@common/guards/check-permissions-guard.service';
import { PricingPageComponent } from '@common/billing/pricing-page/pricing-page.component';
import { RedirectToUpgradePage } from '@common/billing/guards/redirect-to-upgrade-page.service';

export const routes: Route[] = [
    {
        path: 'pricing',
        component: PricingPageComponent,
        data: {allowIfSubscriptionForced: true},
        canActivate: [RedirectToUpgradePage],
        resolve: {
            plans: BillingPlansResolver,
            currencies: CurrenciesListResolver
        }
    },
    {
        path: '',
        canActivate: [AuthGuard, CheckPermissionsGuard],
        canActivateChild: [CheckPermissionsGuard],
        data: {allowIfSubscriptionForced: true},
        children: [
            {
                path: 'upgrade',
                component: UpgradePageComponent,
                canActivate: [BillingEnabledGuard, AuthGuard],
                resolve: {
                    plans: BillingPlansResolver,
                    currencies: CurrenciesListResolver
                }
            },
            {
                path: 'subscription',
                component: UserSubscriptionPageComponent,
                resolve: { plans: BillingPlansResolver },
                canActivate: [BillingEnabledGuard, AuthGuard, UserSubscribedGuard],
                data: { name: 'subscription' }
            },
            {
                path: 'invoices',
                component: InvoiceIndexComponent,
                canActivate: [BillingEnabledGuard, AuthGuard, UserSubscribedGuard],
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingRoutingModule {}
