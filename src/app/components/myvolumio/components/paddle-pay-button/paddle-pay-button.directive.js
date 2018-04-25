class PaddlePayButtonDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/myvolumio/components/paddle-pay-button/paddle-pay-button.html',
      controller: PaddlePayButtonController,
      controllerAs: 'paddlePayButtonController',
      scope: {
        paddleProduct: "=",
        callback: "&",
        userId: '<',
        buttonLabel: '@',
        buttonClass: '@',
        userEmail: '='
      }
    };
    return directive;
  }
}

class PaddlePayButtonController {
  constructor($rootScope, $scope, $window, $timeout, $q, paymentsService, paddleService) {
    'ngInject';
    this.$scope = $scope;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$q = $q;
    this.paymentsService = paymentsService;
    this.handler = {};
    this.paddleService = paddleService;

    this.btnIconClasses = {
      normal: "glyphicon glyphicon-shopping-cart",
      loading: "glyphicon glyphicon-refresh"
    };

    this.btnIconClass = this.btnIconClasses.normal;

    this.product = this.$scope.paddleProduct;
    this.callback = this.$scope.callback;
    this.userId = this.$scope.userId;
    this.buttonLabel = this.$scope.buttonLabel;
    this.buttonClass = this.$scope.buttonClass;
    this.userEmail = this.$scope.userEmail || '';

    this.init();
  }

  init() {
    this.loadPaddle();
    this.initButtonUI();
  }

  initButtonUI() {
    if (this.buttonLabel === undefined) {
      this.buttonLabel = "Buy now";
    }
  }

  loadPaddle() {
    //
  }

  initButton() {
    //
  }

  getPayFunction() {
    return (token) => {
      this.startLoading();
      var payment = this.product;
      payment['token'] = token;
      var subscribing = this.$q.defer();

      this.paymentsService.subscribe(payment, this.userId).then((success) => {
        this.stopLoading();
        subscribing.resolve(success);
      }, (error) => {
        this.stopLoading();
        subscribing.reject(error);
      });

      this.callback({ subscribing: subscribing.promise });
    };
  }

  startLoading() {
    this.btnIconClass = this.btnIconClass.loading;
  }

  stopLoading() {
    this.btnIconClass = this.btnIconClasses.normal;
  }

  initDestroyer() {
    //
  }

  handlePayment() {
    Paddle.Checkout.open({
      product: this.product.paddleId,
      passthrough: '{"email": "' + this.userEmail + '"}',
      successCallback: this.successCallback
    }, false);
  }

  successCallback(data) {
    console.log(data);
  }

}

export default PaddlePayButtonDirective;