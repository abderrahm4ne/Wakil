export const ERROR_MESSAGES: Record<string, string> = {
    UNAUTHORIZED: 'subscription.errors.unauthorized',
    INVALID_PLAN: 'subscription.errors.invalidPlan',
    INVALID_BILLING_MODE: 'subscription.errors.invalidBillingMode',
    NO_SUBSCRIPTION: 'subscription.errors.noSubscription',
    CANNOT_UPGRADE_ONE_TIME: 'subscription.errors.cannotUpgradeOneTime',
    ALREADY_ON_THIS_PLAN: 'subscription.errors.alreadyOnPlan',
    PLAN_NOT_AVAILABLE: 'subscription.errors.planNotAvailable',
    NO_ACTIVE_SUBSCRIPTION: 'subscription.errors.noActiveSubscription',
    CUSTOMER_DELETED: 'subscription.errors.customerDeleted',
    NO_PAYMENT_METHOD: 'subscription.errors.noPaymentMethod',
    NO_CUSTOMER: 'subscription.errors.noCustomer',
    NOT_SCHEDULED_FOR_CANCELLATION: 'subscription.errors.notScheduled',
    SERVER_ERROR: 'subscription.errors.generic',
    DOWNGRADE_NOT_ALLOWED: 'subscription.errors.downgradeNotAllowed'
}

export function resolveErrorMessage(code: string, t: (key: string) => string): string {
    const key = ERROR_MESSAGES[code] ?? ERROR_MESSAGES.SERVER_ERROR
    return t(key)
}