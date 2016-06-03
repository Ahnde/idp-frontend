var formularGenerator = angular.module('formularGenerator', ["formly","formlyBootstrap","ngRoute"]);

formularGenerator.config(['formlyConfigProvider', function(formlyConfigProvider) 
{
    formlyConfigProvider.setType({
      name: 'datepicker',
      template: '<input type="date" class="form-control" ng-model="model[options.key]" />',
      wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });
    formlyConfigProvider.setType({
      name: 'image',
      template: '<img ng-src="{{to.urls[0]}}" alt="{{to.urls[0]}}" width="200" />',
      wrapper: ['bootstrapHasError']
    });
    formlyConfigProvider.setType({
      name: 'video',
      template: '<video controls width="400"><source src="{{to.urls[0]}}" /></video>',
      wrapper: ['bootstrapHasError']
    });
    formlyConfigProvider.setType({
      name: 'textlabel',
      template: '<p></p>{{to.label}}',
      wrapper: ['bootstrapHasError']
    });
    formlyConfigProvider.setType({
      name: 'emptydiv',
      template: '<div class=\"form-block\" />',
      wrapper: ['bootstrapHasError']
    });
    formlyConfigProvider.setType({
      name: 'mui',
      template: '<div class=\"form-inline\">\
                  <div ng-repeat=\"(key, option) in to.options\" class=\"form-inline form-mui\">\
                      <label>\
                          <input type=\"radio\" id=\"{{id + \'_\'+ $index}}\" tabindex=\"0\" ng-value=\"option[to.valueProp || \'value\']\" ng-model=\"model[options.key]\">\
                            {{option[to.labelProp || \'name\']}}\
                          </input>\
                      </label>\
                  </div>\
                </div>\
                <div class=\"form-block\"></div>',
      wrapper: ['bootstrapHasError']
    });
    formlyConfigProvider.setWrapper({
      name: 'panel',
      template: '<div class=\'panel panel-default\'>\
                  <div class=\"panel-heading px-nested-panel-heading clearfix">\
                    <strong class="control-label" ng-if="options.templateOptions.label">\
                      {{options.templateOptions.label}}\
                    </strong>\
                  </div>\
                  <div class="panel-body px-nested-panel-body">\
                    <formly-transclude></formly-transclude>\
                  </div>\
                </div>'
    });
}])


formularGenerator.config(function($locationProvider,$routeProvider) {
    
    $routeProvider.
        when('/form/ids', {
            controller: 'rendererController'
        }).
        when('/form/:id', {
            controller: 'rendererController'
        }).
        when('/form/:id/data/ids', {
            controller: 'rendererController'
        }).
        when('/form/:id/data/:dataId', {
            controller: 'rendererController'
        }).
        otherwise({ redirectTo: '/' });
});

