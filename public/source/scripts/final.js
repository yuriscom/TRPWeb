// for those vendor modules which actually implemented AMD and require 'jquery'
define('jquery', [], function () { return window.jQuery; });
// empty module, all common vendor dependencies will be merged before this line
define('vendor', [], function () {});