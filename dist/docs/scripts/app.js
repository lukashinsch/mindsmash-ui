(function(angular) {
  'use strict';

  angular.module('app', [
      'msm.components.ui',
      'msm.components.util',
      'ui.bootstrap',
      'ui.bootstrap.datepicker',
      'ui.bootstrap.dropdown',
      'ui.router',
      'pascalprecht.translate'
    ])

      .config(configTranslations)
      .config(configRoutes)
      .config(configNotifications)

      .run(Main)

      .controller('NotificationController', NotificationController)
      .controller('EditableTextController', EditableTextController)
      .controller('ModalController', ModalController)
      .controller('ClickToEditController', ClickToEditController)
      .controller('TableController', TableController);

  //////////////

  function configNotifications(NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 3500,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'top'
    });
  }

  function configRoutes($stateProvider) {

    $stateProvider
        .state('test', {
          url: '/mobile-menu-test',
          views: {
            'mobile-menu-test': {template: '<span>it works! <a ui-sref="index">close</a></span>'}
          }
        })
        .state('index', {
          url: '',
          views: {
            'mobile-menu-test': {template: ''}
          }
        })
  }

  function configTranslations($translateProvider) {
    $translateProvider.translations('en', {
      BUTTON_DELETE: 'Delete',
      WELCOME: 'Welcome to the Mindsmash UI kit!'
    });
    $translateProvider.translations('de', {
      BUTTON_DELETE: 'Löschen',
      WELCOME: 'Willkommen zum Mindsmash UI-Kit!'
    });

    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy(null);
  }

  function Main(msmNotification) {
    // use an i18n key here
    msmNotification.primary('WELCOME');
  }

  function NotificationController($log, msmNotification) {
    var vm = this;

    vm.primary = function() {
      msmNotification.primary('Primary', false);
    };

    vm.error = function() {
      msmNotification.error('Error', false);
    };

    vm.success = function() {
      msmNotification.success('Success', false);
    };

    vm.info = function() {
      msmNotification.info('Info', false);
    };

    vm.warning = function() {
      msmNotification.warning('Warning', false);
    };

    vm.clearAll = function() {
      msmNotification.clearAll();
    };

    (function initController() {
      $log.debug('[NotificationController] Initializing...');
    })();
  }

  function EditableTextController($log) {
    var vm = this;

    vm.model = {
      text1: 'First text',
      text2: 'Second text',
      isEditable: false,
    };

    (function initController() {
      $log.debug('[EditableTextController] Initializing...');
    })();
  }

  function ClickToEditController($log, msmNotification) {
    var vm = this;

    vm.model = {
      text1: 'First text',
      text2: 'Second text',
      isEditing: false
    };

    vm.changed = function(value) {
      msmNotification.success('Successfully changed the value to \'' + value + '\'', false);
    };

    (function initController() {
      $log.debug('[ClickToEditController] Initializing...');
    })();
  }

  function TableController($log) {
    var vm = this;

    vm.model = {
      isHover: false,
      isStriped: false,
      isBordered: false,
      isCondensed: false
    };

    (function initController() {
      $log.debug('[TableController] Initializing...');
    })();
  }

  function ModalController($log, $q, msmModal, msmNotification) {
    var vm = this;

    function valueAsync() {
      return $q(function(resolve) {
        setTimeout(function() {
          resolve('Some async value...');
        }, 1000);
      });
    }

    function valueFunction() {
      return 'Some return value...';
    }

    vm.openCustom = function(size) {
      return msmModal.open({
        value: 'Some value...',
        valueAsync: valueAsync(),
        valueFunction: valueFunction
      }, function(value, valueAsync, valueFunction) {
        var vm = this;
        vm.title = 'Customization';
        vm.text = valueAsync;
      }, size).result.then(function(selectedItem) {
        $log.info('Modal (custom): Clicked OK.');
      }, function() {
        $log.info('Modal (custom): Cancelled.');
      });
    };

    vm.openNote = function(size) {
      return msmModal.note(
        'Note',
        'This is some very important information.',
        size
      ).result.then(function(selectedItem) {
        $log.info('Modal (note): Clicked OK.');
        msmNotification.success('Closed', false);
      }, function() {
        $log.info('Modal (note): Cancelled.');
      });
    };

    vm.openConfirm = function(size) {
      return msmModal.confirm(
          'Confirmation',
          'Are you sure you want to continue?',
          size, 'Yes', 'No'
      ).result.then(function() {
        $log.info('Modal (confirm): Confirmed.');
        msmNotification.success('Confirmed', false);
      }, function() {
        $log.info('Modal (confirm): Cancelled.');
      });
    };

    var values = [
      {
        key: 'KeyItem1',
        value: 'Item 1'
      },
      {
        key: 'KeyItem2',
        value: 'Item 2'
      },
      {
        key: 'KeyItem3',
        value: 'Item 3'
      }
    ];
    var selectedSelectModalItem = values[0].key;
    vm.openSelect = function(size) {
      return msmModal.select(
          'Selection',
          'Please select:',
          {
            values: values,
            selected: selectedSelectModalItem
          },
          size
      ).result.then(function(selectedItem) {
        $log.info('Modal (select): Clicked OK.');
        selectedSelectModalItem = selectedItem;
        msmNotification.success('Selected item: \'' + selectedItem + '\'', false);
      }, function() {
        $log.info('Modal (select): Cancelled.');
      });
    };

    vm.openForm = function(size) {
      function beforeClose(models) {
        console.log(models);
        return true;
      }

      return msmModal.form(
          'Custom form',
          {
            inputFields: [
              {
                id: 'id1',
                label: 'Label 1',
                type: 'text',
                placeholder: 'Placeholder 1',
                image: 'zmdi-flag',
                name: 'Label 1 name',
                model: 'field1',
                errorClass: 'has-error',
                errorDefinitions: 'form.id1.$dirty',
                required: true
              },
              {
                id: 'id2',
                label: 'Label 2',
                type: 'password',
                placeholder: 'Placeholder 2',
                image: 'zmdi-key',
                name: 'Label 2 name',
                model: 'field2',
                errorClass: 'has-error',
                errorDefinitions: 'form.id2.$dirty',
                required: true
              },
              {
                id: 'id3',
                label: 'Label 3',
                type: 'text',
                placeholder: 'Placeholder 3',
                image: 'zmdi-pin',
                name: 'Label 3 name',
                model: 'field3',
                errorClass: 'has-error',
                errorDefinitions: 'form.id3.$dirty',
                required: false
              }
            ]
          },
          beforeClose,
          size
      ).result.then(function(result) {
        $log.info('Modal (form): Ok.', result);
        msmNotification.success('Ok', false);
      }, function() {
        $log.info('Modal (form): Cancel.');
      });
    };

    (function initController() {
      $log.debug('[ModalController] Initializing...');
    })();
  }

})(angular);
