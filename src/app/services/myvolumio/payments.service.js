class PaymentsService {
  constructor(stripeService, paddleService, $q) {
    'ngInject';
    this.stripeService = stripeService;
    this.paddleService = paddleService;
    this.$q = $q;
  }

  /*subscribe(subscription, userId) {
    return this.stripeService.subscribe(subscription, userId);
  }

  cancelSubscription(subscriptionId, userId) {
    return this.stripeService.cancelSubscription(subscriptionId, userId);
  }

  updateSubscription(planCode, userId) {
    return this.stripeService.updateSubscription(planCode, userId);
  }*/

  subscribe(subscription, userId) {
    return this.paddleService.subscribe(subscription, userId);
  }

  cancelSubscription(subscriptionId, userId) {
    return this.paddleService.cancelSubscription(subscriptionId, userId);
  }

  updateSubscription(planCode, userId) {
    return this.paddleService.updateSubscription(planCode, userId);
  }

}

export default PaymentsService;