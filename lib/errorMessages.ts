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
    DOWNGRADE_NOT_ALLOWED: 'subscription.errors.downgradeNotAllowed',
    NO_CHANNELS_FOUND: 'channels.errors.noPages.title',
    PRODUCT_UPLOAD_REQUIRES_PRO_OR_BUSINESS: 'bot.product.errors.requiresPro',
    EMPTY_FILE: 'bot.product.errors.emptyFile',
    MISSING_HEADERS: 'bot.product.errors.missingHeaders',
    PRODUCT_LIMIT_EXCEEDED: 'bot.product.errors.limitExceeded',
    MISSING_NAME: 'bot.product.errors.missingName',
    INVALID_PRICE: 'bot.product.errors.invalidPrice',
    INVALID_STOCK: 'bot.product.errors.invalidStock',
    BOT_NOT_FOUND: 'bot.errors.notFound',
    
}

export function resolveErrorMessage(code: string, t: (key: string) => string): string {
    const key = ERROR_MESSAGES[code] ?? ERROR_MESSAGES.SERVER_ERROR
    return t(key)
}