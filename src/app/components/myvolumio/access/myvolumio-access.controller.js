class MyVolumioAccessController {
  constructor($scope, $state, authService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.user = null;

    this.init();
  }

  init() {
    this.authInit();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
      this.postAuthInit();
    });
  }

  postAuthInit() {
    if (this.user !== null) {
      this.$state.go('myvolumio.profile');
    }
  }

  goToLogin() {
    this.$state.go('myvolumio.login');
  }

  goToSignUp() {
    this.$state.go('myvolumio.signup');
  }

  isSocialEnabled() {
    return this.authService.isSocialEnabled();
  }

  loginWithFacebook() {
    this.loginWithProvider('facebook');
  }

  loginWithGoogle() {
    this.loginWithProvider('google');
  }

  loginWithGithub() {
    this.loginWithProvider('github');
  }

  loginWithProvider(provider) {
    this.authService.loginWithProvider(provider).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

}

export default MyVolumioAccessController;