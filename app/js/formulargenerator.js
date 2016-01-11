var formularGenerator = angular.module('formularGenerator', ["formly","formlyBootstrap"]);

formularGenerator.config(['formlyConfigProvider', function(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'datepicker',
      template: '<input type="date" class="form-control" ng-model="model[options.key]">',
      wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });
}])