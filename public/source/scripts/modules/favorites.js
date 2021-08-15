define('favorites', [ 'main', 'vendor' ], function () {

  TheRedPin.Favorites = (function () {

    var getUserID = function () {
      return $.cookie('trp_user_id');
    };

    var launchRegistration = function () {
      var accountOptions = {
        message: 'fav',
        autoRefresh: false,
        ga: {
          regOpen:  'RegisterFav -- Open',
          regSub:   'RegisterFav -- Submit',
          regToLog: 'RegisterToLoginFav',
          logOpen:  'LoginFav -- Open',
          logSub:   'LoginFav -- Submit',
          logToReg: 'LoginToRegisterFav'
        }
      };
      TheRedPin.invokeAuth('register', false, accountOptions);
    };

    var delayedFavorite = function (type, id) {
      var deferred = new $.Deferred();
      $.subscribe('oauth.login', function () {
        var userID = getUserID();
        if (userID) {
          addFavorite(type, id).done(function (response) {
            deferred.resolve(response);
          });
        }
      });
      return deferred;
    };

    var addFavorite = function (type, id) {
      var userID = getUserID();
      if (!userID) {
        launchRegistration();
        return delayedFavorite(type, id);
      }
      var data = {
        entity_type: type,
        entity_id: id
      };
      var addFav = $.ajax({
        url: TheRedPin.url + 'users/' + userID + '/favorites',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data)
      });

      return addFav;
    };

    var removeFavorite = function (favID) {
      var userID = getUserID();
      if (!userID) {
        launchRegistration();
        return;
      }
      var data = {
        is_deleted: true
      };
      var removeFav = $.ajax({
        url: TheRedPin.url + 'users/' + userID + '/favorites/' + favID,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data)
      });

      return removeFav;
    };

    return {
      addFavorite: addFavorite,
      removeFavorite: removeFavorite
    };
  })();
});