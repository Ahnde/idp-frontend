var formularGenerator = angular.module('formularGenerator', ["formly","formlyBootstrap","ngRoute"]);

var unique = 1;

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
    formlyConfigProvider.setType({
      name: 'panel',
      template: '<div class=\'panel panel-default\'>\
                  <div class=\"panel-heading px-nested-panel-heading clearfix">\
                    <strong class="control-label" ng-if="options.templateOptions.label">\
                      {{options.templateOptions.label}}\
                    </strong>\
                  </div>\
                  <div class="panel-body px-nested-panel-body">\
                    <formly-form fields="to.fields"\
                                  model="model"\
                                   form="form">\
                    </formly-form>\
                  </div>\
                </div>'
    });
    formlyConfigProvider.setType({
      name: 'tabPanel',
      template: '<div class=\'\'>\
                    <ul class="tab">\
                      <li class="tablinks" ng-repeat="field in to.fields" ng-bind-html-unsafe="field.key" ng-click="openTab(event, field)" >\
                        <div class="panel-heading px-nested-panel-heading clearfix">\
                          <strong class="control-label" ng-if="field.key">\
                            {{ field.templateOptions.label }}\
                          </strong>\
                        </div>\
                      </li>\
                    </ul>\
                    <div class="tabcontent" ng-if="showTab != undefined">\
                      <div class="" ng-repeat="field in to.fields" id="field.key" ng-if="showTab == field.key">\
                        <div class="" ng-repeat="contentField in field.templateOptions.fields">\
                          <formly-form fields="[contentField]"\
                                        model="model"\
                                         form="form">\
                          </formly-form>\
                        </div>\
                      </div>\
                    </div>\
                </div>',
      controller: function($scope) {
        $scope.openTab = openTab;
        function openTab(event, field) {
          $scope.showTab = field.key;
        }
      }
    });
    formlyConfigProvider.setType({
      name: 'repeatingPanel',
      template: '<div>\
                  <div class="repeatsection" ng-repeat="element in model[options.key]" ng-init="fields = copyFields(to.fields)">\
                    <formly-form fields="fields"\
                                  model="element"\
                                   form="form">\
                    </formly-form>\
                    <div style="margin-bottom:20px;">\
                      <button type="button" class="btn btn-sm btn-danger" ng-click="model[options.key].splice($index, 1)">\
                        Remove\
                      </button>\
                    </div>\
                    <hr>\
                  </div>\
                  <p class="AddNewButton">\
                    <button type="button" class="btn btn-primary" ng-click="addNew()" >Add</button>\
                  </p>\
                </div>',
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        
        $scope.copyFields = copyFields;
        
        function copyFields(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }
        
        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }
          repeatsection.push(newsection);
        }
        
        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }
            
            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }
            
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }
        
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }
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

