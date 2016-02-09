var formularGenerator = angular.module('formularGenerator', ["formly","formlyBootstrap"]);

formularGenerator.config(['formlyConfigProvider', function(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'datepicker',
      template: '<input type="date" class="form-control" ng-model="model[options.key]">',
      wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });
    formlyConfigProvider.setType({
      name: 'image',
      template: '<img ng-src="{{to.url}}" alt="{{to.url}}">',
      wrapper: ['bootstrapHasError']
    });
    formlyConfigProvider.setType({
      name: 'textlabel',
      template: '<p>{{options.label}}</p>',
      wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });
}])