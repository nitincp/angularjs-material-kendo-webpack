import { moduleName } from "./app.module";
import * as angular from "angular";

angular.module(moduleName)
.config(function($mdThemingProvider: ng.material.IThemingProvider) {
    
    $mdThemingProvider.theme('default')
      .dark();
  });