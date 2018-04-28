class PaddleService {
  constructor(modalService) {
    'ngInject';

    this.modalService = modalService;

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
    console.log("I M IN THE SUBSCRIBE FUNCTION IN PADDLE SERVICE");
  }

  getPlanForSubscription(subscriptionId, userId) {

  }

  cancelSubscription(subscriptionId, userId) {
    return this.$http({
      url: 'https://us-central1-myvolumio.cloudfunctions.net/api/v1/disableMyVolumioDevice',
      method: "POST",
      params: { token: token, uid: this.user.uid, hwuuid: device.hwuuid }
    }).then(response => {
      return response.data;
    });
  }

  updateSubscription(planCode, userId) {
    return this.$http({
      url: 'https://us-central1-myvolumio.cloudfunctions.net/api/v1/disableMyVolumioDevice',
      method: "POST",
      params: { token: token, uid: this.user.uid, hwuuid: device.hwuuid }
    }).then(response => {
      return response.data;
    });
  }
}

export default PaddleService;