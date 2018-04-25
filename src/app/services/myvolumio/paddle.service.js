class PaddleService {
  constructor() {
    'ngInject';

    //init paddle by injecting the js
    this.paddleJsUrl = 'https://cdn.paddle.com/paddle/paddle.js';
    this.paddleVendorId = 29290;

    this.isLoaded = false;
    this.isInit = false;
    this.setupPaddle();

  }

  setupPaddle() {
    this.injectPaddleScript().then(() => {
      console.log('Script loaded!');
      this.isLoaded = true;
      this.initPaddle();
    }).catch(error => {
      console.log(error);
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
      vendor: this.paddleVendorId
    });
    this.isInit = true;
  }

  subscribe(subscription, userId) {

  }

  getPlanForSubscription(subscriptionId, userId) {

  }

  cancelSubscription(subscriptionId, userId) {

  }

  updateSubscription(planCode, userId) {

  }
}

export default PaddleService;