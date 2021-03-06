(function () {
  'use strict';

  angular.module('msm.components.ui')
      .directive('msmEditableForm', EditableForm)
      .directive('ngModel', NgModel);

  function EditableForm($parse) {
    return {
      restrict: 'A',
      require: 'form',
      controller: angular.noop,
      link: function (scope, elem, attrs, ctrl) {
        scope.$watch(attrs.msmEditableForm, setEditableClass);

        elem.on('reset', function(event) {
          event.preventDefault();
          ctrl.$rollbackViewValue();
        });

        function setEditableClass(isEditable) {
          if (isEditable) {
            elem.addClass('msm-is-editable');
            elem.removeClass('msm-non-editable');
          } else {
            elem.addClass('msm-non-editable');
            elem.removeClass('msm-is-editable');
          }
        }
      }
    }
  }

  function NgModel() {
    return {
      restrict: 'A',
      require: ['ngModel', '^?ngModelOptions', '^?msmEditableForm'],
      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, iElem, iAttrs, ctrls) {
            if (!ctrls[1] && ctrls[2]) {
              ctrls[0].$$setOptions({
                updateOnDefault: false,
                updateOn: ''
              });
            }
          }
        };
      }
    }
  }

})();
