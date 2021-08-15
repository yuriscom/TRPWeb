require([ 'trp.app', 'account-management.config', 'account-management.svc',
  'manage-favorites.ctrl', 'manage-subscriptions.ctrl', 'manage-saved-searches.ctrl',
'list-view.ctrl', 'list-view.dir', 'saved-search.dir' ],
function () {
  angular.element (document).ready (function () {
    angular.bootstrap (document, [ 'TRP' ]);
  });
});