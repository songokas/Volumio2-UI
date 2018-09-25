class HeaderController {
  constructor(matchmediaService, socketService, uiSettingsService, $scope, themeManager, $state, authService) {
    'ngInject';
    this.matchmediaService = matchmediaService;
    this.themeManager = themeManager;
    this.uiSettingsService = uiSettingsService;
    this.isSocketReady = false;
    this.authService = authService;
    this.$state = $state;
    this.language = {};
    this.languages = [{
        "value": "ca",
        "label": "Català"
      },
      {
        "value": "cs",
        "label": "Cesky"
      },
      {
        "value": "da",
        "label": "Dansk"
      },
      {
        "value": "de",
        "label": "Deutsch"
      },
      {
        "value": "en",
        "label": "English"
      },
      {
        "value": "es",
        "label": "Español"
      },
      {
        "value": "fr",
        "label": "Français"
      },
      {
        "value": "gr",
        "label": "e???????"
      },
      {
        "value": "it",
        "label": "Italiano"
      },
      {
        "value": "ja",
        "label": "???"
      },
      {
        "value": "ko",
        "label": "???"
      },
      {
        "value": "hu",
        "label": "Magyar"
      },
      {
        "value": "nl",
        "label": "Nederlands"
      },
      {
        "value": "no",
        "label": "Norsk"
      },
      {
        "value": "pl",
        "label": "Polski"
      },
      {
        "value": "pt",
        "label": "Português"
      },
      {
        "value": "ru",
        "label": "???????"
      },
      {
        "value": "sk",
        "label": "Slovensky"
      },
      {
        "value": "fi",
        "label": "Suomi"
      },
      {
        "value": "sv",
        "label": "Svenska"
      },
      {
        "value": "ua",
        "label": "??????????"
      },
      {
        "value": "zh",
        "label": "????"
      },
      {
        "value": "zh_TW",
        "label": "????"
      }
    ];
    if (!socketService.host) {
      this.setDefaultLanguage();
    }
    $scope.$watch(() => socketService.host, () => {
      if (socketService.host) {
        this.isSocketReady = true;
      } else {
        this.isSocketReady = false;
      }
    });
  }

  setDefaultLanguage() {
    const browserDefaultLanguage = this.uiSettingsService.getBrowserDefaultLanguage();
    const defaultLanguageModel = this.languages.find(item => item.value === browserDefaultLanguage);
    if (defaultLanguageModel) {
      this.language = defaultLanguageModel;
    }
  }

  changeLanguage() {
    this.uiSettingsService.setLanguage(this.language.value);
  }

  logout() {
    this.$state.go("myvolumio.logout");
  }
}

export default HeaderController;
