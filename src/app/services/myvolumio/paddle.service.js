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

  updateSubscription(newPlan, userId, token) {
        var updating = this.$q.defer();
        var newPlanId = newPlan.paddleId;
        var subscription = this.executeUpdateSuscription(newPlanId, userId, token);
        subscription.then((response)=> {
          if (response && response.data && response.data.planData) {
              var planData = response.data.planData;
              Paddle.Checkout.open({
                override: planData.updateUrl,
                passthrough: {"uid": userId},
                subscription_id: planData.subscriptionId,
                plan_id: newPlan.paddleId,
                successCallback: (data)=>{updating.resolve(true);},
                closeCallback: ()=>{updating.reject('');}
              }, false);
            } else {
              updating.reject('');
            }
        }).catch((error) => {
          updating.reject('');
        });
        return updating.promise;
  }

  cancelSubscription(subscriptionId, userId, token) {
        var cancelling = this.$q.defer();
        var subscription = this.getSubscriptionCancelUrl(userId, token);
        subscription.then((response)=> {
          if (response && response.data && response.data.cancelUrl) {
              var cancelUrl = response.data.cancelUrl;
              Paddle.Checkout.open({
                override: cancelUrl,
                passthrough: {"uid": userId},
                successCallback: (data)=>{cancelling.resolve(true);},
                closeCallback: ()=>{cancelling.reject('');}
              }, false);
            } else {
              cancelling.reject('');
            }
        }).catch((error) => {
          cancelling.reject('');
        });
        return cancelling.promise;
 }

getSubscriptionCancelUrl(userId, token) {
  let promise = new Promise((resolve, reject) => {
    this.$http({
      url: 'https://us-central1-myvolumio.cloudfunctions.net/api/v1/getSubscriptionCancelUrl',
      method: "POST",
      params: {"token": token, "uid": userId}
    }).then(
        res => {
          resolve(res);
        },
        msg => {
          reject(msg);
        }
      )
  });
  return promise;
 }


executeUpdateSuscription(newPlan, userId, token) {

  let promise = new Promise((resolve, reject) => {
    this.$http({
      url: 'https://us-central1-myvolumio.cloudfunctions.net/api/v1/updateSubscription',
      method: "POST",
      params: {"token": token, "uid": userId, "newPlan": newPlan}
    }).then(
        res => {
          console.log(res)
          resolve(res);
        },
        msg => {
          reject(msg);
        }
      )
  });
  return promise;
 }


}
export default PaddleService;
