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
  constructor($rootScope, $scope, $window, $timeout, $q, $state, paymentsService, modalService) {
    'ngInject';
    this.$scope = $scope;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$q = $q;
    this.$state = $state;
    this.paymentsService = paymentsService;
    this.handler = {};
    this.modalService = modalService;

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
    this.initButtonUI();
  }

  initButtonUI() {
    if (this.buttonLabel === undefined) {
      this.buttonLabel = "Buy now";
    }
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
      email: this.userEmail,
      passthrough: { "email": this.userEmail, "uid": this.userId },
      successCallback: this.successCallback,
      closeCallback: this.closeCallback,
    }, false);
  }

  successCallback(data) {
    if (data.checkout.completed == true) {
      console.log(data);
      var checkoutId = data.checkout.id;
      //Paddle.Order.DetailsPopup(data.checkout.id);
      this.$state.go('myvolumio.payment-success');
      return;
    }
    //TODO
    this.modalService.openDefaultModalError();
  }

  /*

  {
    "checkout": {
        "completed": true,
        "id": "4451433-chrd10623c1cbd5-c8d37ad479",
        "coupon": null,
        "prices": {
            "customer": {
                "currency": "USD",
                "unit": "9.99",
                "total": "9.99"
            },
            "vendor": {
                "currency": "USD",
                "unit": "9.99",
                "total": "9.99"
            }
        },
        "passthrough": null,
        "redirect_url": null
    },
    "product": {
        "quantity": 1,
        "id": "1234567",
        "name": "My Product"
    },
    "user": {
        "country": "GB",
        "email": "christian@paddle.com",
        "id": "29777"
    }
}

*/

  closeCallback(error) {
    console.log(error);
    this.modalService.openDefaultModalError();
  }

  /*
{
    "checkout": {
        "completed": false,
        "id": "4459220-chra432325e67421-fe2f8d232a",
        "coupon": null,
        "prices": {
            "customer": {
                "currency": "GBP",
                "unit": "34.95",
                "total": "34.95"
            },
            "vendor": {
                "currency": "USD",
                "unit": "43.82",
                "total": "43.82"
            }
        },
        "passthrough": null,
        "redirect_url": null
    },
    "product": {
        "quantity": 1,
        "id": "1234567",
        "name": "My Product"
    },
    "user": {
        "country": "GB",
        "email": "christian@paddle.com",
        "id": 29777
    }
}
  */

}

export default PaddlePayButtonDirective;