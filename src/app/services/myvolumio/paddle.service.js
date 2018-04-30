class PaddleService {
  constructor(angularFireService, modalService, databaseService, $q, $http) {
    'ngInject';

    this.angularFireService = angularFireService;
    this.modalService = modalService;
    this.databaseService = databaseService;
    this.$q = $q;
    this.$http = $http;


    this.paddleJsUrl = 'https://cdn.paddle.com/paddle/paddle.js';
    this.paddleS2SUrl = '';
    this.paddleVendorId = 29290;

    this.isLoaded = false;
    this.isInit = false;
    this.setupPaddle();
  }

  setupPaddle() {
    this.injectPaddleScript().then(() => {
      this.isLoaded = true;
      this.initPaddle();
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  injectPaddleScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = this.paddleJsUrl;
      script.addEventListener('load', resolve);
      script.addEventListener('error', () => reject('Error loading script.'));
      script.addEventListener('abort', () => reject('Script loading aborted.'));
      document.head.appendChild(script);
    });
  }

  initPaddle() {
    Paddle.Setup({
      vendor: this.paddleVendorId,
      debug: true
    });
    this.isInit = true;
  }

  subscribe(subscription, userId) {

  }

  getPlanForSubscription(subscriptionId, userId) {

  }

  cancelSubscription(subscriptionId, userId, token) {
        var cancelling = this.$q.defer();
        this.$http({
            url: 'https://17c1bf11.ngrok.io/myvolumio/us-central1/api/v1/getPaddleCancelUrl',
            method: "POST",
            params: { "token": token, "uid": userId}
          }).then(response => {
            if (response && response.data && response.data.cancelUrl) {
              var cancelUrl = response.data.cancelUrl;
              Paddle.Checkout.open({
                override: cancelUrl,
                passthrough: {"uid": userId},
                successCallback: (data)=>{this.cancelling.resolve(true);},
                closeCallback: ()=>{this.cancelling.reject('');}
              }, false);
            } else {
              this.cancelling.reject('');
            }
          });
          return cancelling.promise;
}

  updateSubscription(planCode, userId, token) {
    return this.$http({
      url: 'https://us-central1-myvolumio.cloudfunctions.net/api/v1/disableMyVolumioDevice',
      method: "POST",
      params: {"token": token, "uid": userId}
    }).then(response => {
      return response.data;
    });
  }
}

export default PaddleService;
