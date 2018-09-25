function routerConfig ($stateProvider, $urlRouterProvider, $locationProvider, themeManagerProvider) {
  'ngInject';
  console.info('[TEME]: ' + themeManagerProvider.theme, '[VARIANT]: ' + themeManagerProvider.variant);

  const resolverFn = (
    $rootScope,
    $http,
    $window,
    socketService,
    ripperService,
    modalListenerService,
    toastMessageService,
    uiSettingsService,
    updaterService) => {
      let localhostApiURL = `http://${$window.location.hostname }/api`;
      return $http.get(localhostApiURL + '/host').then((response) => {
        console.info('IP from API', response);
        $rootScope.initConfig = response.data;
        socketService.host  = response.data.host;
      }, () => {
        //Fallback socket
        console.info('IP from fallback');
        return $http.get('/app/local-config.json').then((response) => {
          socketService.host  = response.data.localhost;
        });
      });
    };

  $locationProvider.html5Mode(true);
  $stateProvider
    .state('volumio', {
      url: '/',
      abstract: true,
      views: {
        'layout': {
          templateUrl: themeManagerProvider.getHtmlPath('layout'),
          controller: 'LayoutController',
          controllerAs: 'layout'
        },
        'header@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('header'),
          controller: 'HeaderController',
          controllerAs: 'header'
        },
        'footer@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('footer'),
          controller: 'FooterController',
          controllerAs: 'footer'
        }
      },
      resolve: {
        //NOTE this resolver init also global services like toast
        socketResolver: ($rootScope, $http, $window, socketService, ripperService, modalListenerService,
            toastMessageService, uiSettingsService, updaterService) => {
          let localhostApiURL = `http://${$window.location.hostname}/api`;
          return $http.get(localhostApiURL + '/host')
            .then((response) => {
              console.info('IP from API', response);
              $rootScope.initConfig = response.data;
              const hosts = response.data;
              const firstHostKey = Object.keys(hosts)[0];
              socketService.hosts = hosts;
              socketService.host = hosts[firstHostKey];
            }, () => {
              //Fallback socket
              console.info('Dev mode: IP from local-config.json');
              return $http.get('/app/local-config.json').then((response) => {
                // const hosts = {
                //   'host1': 'http://192.168.0.65',
                //   'host2': 'http://192.168.0.66',
                //   'host3': 'http://192.168.0.67'};
                const hosts = {'devHost': response.data.localhost};
                const firstHostKey = Object.keys(hosts)[0];
                socketService.hosts = hosts;
                socketService.host = hosts[firstHostKey];
              });
            });
        }
      }
    })

  .state('volumio.browse', {
    url: 'browse',
    views: {
      'content@volumio': {
        templateUrl: themeManagerProvider.getHtmlPath('browse'),
        controller: 'BrowseController',
        controllerAs: 'browse'
      }
    }
  })

  .state('volumio.play-queue', {
    url: 'queue',
    views: {
      'content@volumio': {
        templateUrl: themeManagerProvider.getHtmlPath('play-queue'),
        controller: 'PlayQueueController',
        controllerAs: 'playQueue'
      }
    }
  })

  .state('volumio.playback', {
    url: 'playback',
    views: {
      'content@volumio': {
        templateUrl: themeManagerProvider.getHtmlPath('playback'),
        controller: 'PlaybackController',
        controllerAs: 'playback'
      }
    }
  })

  .state('volumio.debug', {
    url: 'debug',
    views: {
      'content@volumio': {
        templateUrl: 'app/components/debug/volumio-debug.html',
        controller: 'DebugController',
        controllerAs: 'debug'
      }
    }
  })

  .state('volumio.multi-room', {
    url: 'multi-room',
    views: {
      'content@volumio': {
        templateUrl: 'app/themes/axiom/multi-room-manager/axiom-multi-room-manager.html',
        controller: 'MultiRoomManagerController',
        controllerAs: 'multiRoomManager'
      }
    }
  })

  .state('volumio.plugin', {
    url: 'plugin/:pluginName',
    params: { isPluginSettings: null },
    views: {
      'content@volumio': {
        templateUrl: 'app/plugin/plugin.html',
        controller: 'PluginController',
        controllerAs: 'plugin'
      }
    }
  })

  .state('volumio.plugin-manager', {
    url: 'plugin-manager',
    views: {
      'content@volumio': {
        templateUrl: 'app/plugin-manager/plugin-manager.html',
        controller: 'PluginManagerController',
        controllerAs: 'pluginManager'
      }
    }
  })

  /* --------- MYVOLUMIO ----------- */

  .state('myvolumio', {
    url: '/myvolumio',
    abstract: true,
    views: {
      layout: {
        templateUrl: themeManagerProvider.getHtmlPath('layout'),
        controller: 'LayoutController',
        controllerAs: 'layout'
      },
      'header@myvolumio': {
        templateUrl: themeManagerProvider.getHtmlPath('header'),
        controller: 'HeaderController',
        controllerAs: 'header'
      },
      'footer@myvolumio': {
        templateUrl: themeManagerProvider.getHtmlPath('footer'),
        controller: 'FooterController',
        controllerAs: 'footer'
      }
    },
    resolve: {
      dependenciesResolver: (
        $rootScope,
        modalListenerService,
        toastMessageService,
        uiSettingsService
      ) => {
        //NOTE this resolver init global services like toast
        return true;
      },
      socketResolver: function(
        $rootScope,
        deviceEndpointsService,
        $q,
        uiSettingsService,
        $document
      ) {
        var initing = $q.defer();
        deviceEndpointsService.setCloudAutoConnectValue(false);
        $document[0].body.classList.add('myVolumioBkg');
        deviceEndpointsService
          .initSocket()
          .then(isAvalaible => {
            //NOTE: WARNING, this is to set language properly if socket is not avalaible
            //if (!isAvalaible) {
            uiSettingsService.setLanguage();
            //}
            initing.resolve(true);
          })
          .catch(error => {
            initing.resolve(false);
          });
        return initing.promise;
      },
      authEnabled: function(authService, $q) {
        let enabling = $q.defer();
        authService.isAuthEnabled().then(enabled => {
          if (!enabled) {
            enabling.reject('MYVOLUMIO_NOT_ENABLED');
          } else {
            enabling.resolve(true);
          }
        });
        return enabling.promise;
      }
    }
  })

  .state('myvolumio.login', {
    url: '/login',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/login/myvolumio-login.html',
        controller: 'MyVolumioLoginController',
        controllerAs: 'myVolumioLoginController',
        resolve: {
          user: function(authService) {
            return authService.requireNullUserOrRedirect();
          }
        }
      }
    }
  })

  .state('myvolumio.logout', {
    url: '/logout',
    onEnter: function(authService, $state) {
      authService.logOut().then(() => {
        $state.go("myvolumio.access");
        return true;
      });
    }
  })

  .state('myvolumio.signup', {
    url: '/signup',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/signup/myvolumio-signup.html',
        controller: 'MyVolumioSignupController',
        controllerAs: 'myVolumioSignupController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireNullUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.access', {
    url: '/access',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/access/myvolumio-access.html',
        controller: 'MyVolumioAccessController',
        controllerAs: 'myVolumioAccessController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireNullUserOrRedirect();
            }
          ]
        }
      }
    }
  })

  .state('myvolumio.profile', {
    url: '/profile',
    views: {
      'content@myvolumio': {
        templateUrl: 'app/components/myvolumio/profile/myvolumio-profile.html',
        controller: 'MyVolumioProfileController',
        controllerAs: 'myVolumioProfileController',
        resolve: {
          user: [
            'authService',
            function(authService) {
              return authService.requireVerifiedUserOrRedirect();
            }
          ]
        }
      }
    })

    .state('volumio.play-queue', {
      url: 'queue',
      views: {
        'content@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('play-queue'),
          controller: 'PlayQueueController',
          controllerAs: 'playQueue'
        }
      }
    })

    .state('volumio.playback', {
      url: 'playback',
      views: {
        'content@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('playback'),
          controller: 'PlaybackController',
          controllerAs: 'playback'
        }
      }
    })

    .state('volumio.debug', {
      url: 'debug',
      views: {
        'content@volumio': {
          templateUrl: 'app/components/debug/volumio-debug.html',
          controller: 'DebugController',
          controllerAs: 'debug'
        }
      }
    })

    .state('volumio.multi-room', {
      url: 'multi-room',
      views: {
        'content@volumio': {
          templateUrl: 'app/themes/axiom/multi-room-manager/axiom-multi-room-manager.html',
          controller: 'MultiRoomManagerController',
          controllerAs: 'multiRoomManager'
        }
      }
    })

    .state('volumio.plugin', {
      url: 'plugin/:pluginName',
      params: {isPluginSettings: null},
      views: {
        'content@volumio': {
          templateUrl: 'app/plugin/plugin.html',
          controller: 'PluginController',
          controllerAs: 'plugin'
        }
      }
    })

    .state('volumio.plugin-manager', {
      url: 'plugin-manager',
      views: {
        'content@volumio': {
          templateUrl: 'app/plugin-manager/plugin-manager.html',
          controller: 'PluginManagerController',
          controllerAs: 'pluginManager'
        }
      }
    })

    .state('volumio.static-page', {
      url: 'static-page/:pageName',
      views: {
        'content@volumio': {
          templateUrl: 'app/static-pages/static-page.html',
          controller: 'StaticPageController',
          controllerAs: 'staticPage'
        }
      }
    })


    .state('volumio.redirect', {
      url: 'redirect',
      views: {
        'content@volumio': {
          template: '',
          controller: function($state, uiSettingsService, browseService) {
            uiSettingsService.initService().then((data) => {
              if (data && data.indexState) {
                if (data.indexStateHome) {
                  browseService.backHome();
                  $state.go(`volumio.${data.indexState}`);
                } else {
                  $state.go(`volumio.${data.indexState}`);
                }
              } else {
                $state.go('volumio.playback');
              }
            });
          },
          controllerAs: 'redirect'
        }
      }
    })

    .state('volumio.wizard', {
      url: 'wizard',
      views: {
        'content@volumio': {
          templateUrl: 'app/wizard/wizard.html',
          controller: 'WizardController',
          controllerAs: 'wizard'
        }
      }
    })

  .state('redirect', {
    url: '/redirect',
    views: {
      layout: {
        template: '',
        controller: function($state, uiSettingsService, cloudService) {
          if (cloudService.isOnCloud === true) {
            $state.go('myvolumio.access');
            return;
          }
          uiSettingsService.initService().then((data) => {
            if (data && data.indexState) {
              if (data.indexStateHome) {
                browseService.backHome();
                $state.go(`volumio.${data.indexState}`);
              } else {
                $state.go(`volumio.${data.indexState}`);
              }
            } else {
              $state.go('volumio.playback');
            }
          });
        }
      }
    });


  $urlRouterProvider.otherwise('/redirect');
}

export default routerConfig;
