define(['main', 'vendor', 'trp.app'], function () {
    angular.module('TRP')

        .factory('Tracking', function () {
            return {
                track_browser: TheRedPin.Reporting.get('browser'),
                track_browser_version: TheRedPin.Reporting.get('browser-ver'),
                track_page_url: window.location.href,
                track_os: TheRedPin.Reporting.get('os'),
                track_os_version: TheRedPin.Reporting.get('os-ver'),
                track_landing_url: TheRedPin.Reporting.get('landing-page'),
                track_http_referrer: TheRedPin.Reporting.get('referrer'),
                track_ip: TheRedPin.Reporting.get('ip'),
                track_marketo_cookie: $.cookie('_mkto_trk')
            };
        })

        .factory('SEO', function () {
            var seo = {
                titles: {
                    favorites: 'TheRedPin - My Favourites',
                    subscriptions: 'TheRedPin - My Alerts and Emails',
                    savedSearches: 'TheRedPin - My Saved Searches'
                }
            };

            seo.setTitle = function (path) {
                var title;
                switch (path) {
                    case '/my/saved-homes/':
                        title = seo.titles.favorites;
                        break;
                    case '/my/alerts-and-emails-settings/':
                        title = seo.titles.subscriptions;
                        break;
                    case '/my/saved-searches/':
                        title = seo.titles.savedSearches;
                        break;
                    default:
                        title = 'TheRedPin - Account Management';
                }
                $('title').html(title);
            };

            return seo;
        })

        .factory('Notice', function () {
            var reset = function () {
                this.type = '';
                this.message = '';
            };
            return function (options) {
                this.type = options.type || '';
                this.message = options.message || '';
                this.reset = reset;
            };
        })

        .factory('User', ['$http', function ($http) {
            var user = {};

            user.getUserID = function () {
                return $.cookie('trp_user_id');
            };

            user.isAuthenticated = function () {
                return $.cookie('access_token');
            };

            user.getUserByEmail = function (email, successCallback, errorCallback) {
                $http.get(TheRedPin.url + 'users/' + email + '?role=3&response=email-check&display=1')
                    .success(function (response) {
                        var result = response.result;
                        if (result[0]) {
                            user.id = response.result[0].id;
                            user.searchStatus = 'success';
                        } else {
                            user.searchStatus = 'failed';
                        }
                        successCallback(response);
                    }).error(function (response) {
                    errorCallback(response);
                });
            };

            return user;
        }])


        .factory('Subscriptions', ['$http', 'Tracking', 'User', function ($http, Tracking, User) {
            var subscriptions = {};

            subscriptions.getSubscriptions = function (angelUserID, successCallback, errorCallback) {
                var userID = angelUserID || User.getUserID();
                var params = angelUserID ? '?backdoor=1' : '';
                $http.get(TheRedPin.url + 'users/' + userID + '/subscriptions' + params)
                    .success(function (response) {
                        successCallback(response);
                    }).error(function (response) {
                    errorCallback(response);
                });
            };

            subscriptions.updateSubscriptions = function (angelUserID, subData, successCallback, errorCallback) {
                var userID = angelUserID || User.getUserID();
                var params = angelUserID ? '?backdoor=1' : '';
                var data = {
                    subscriptions: subData,
                    tracking: Tracking
                };
                $http.put(TheRedPin.url + 'users/' + userID + '/subscriptions' + params, data)
                    .success(function (response) {
                        successCallback(response);
                    }).error(function (response) {
                    errorCallback(response);
                });
            };

            return subscriptions;
        }])

        .factory('Favorites', ['$http', 'User', function ($http, User) {
            var favorites = {};

            favorites.getFavorites = function (successCallback, errorCallback) {
                var userID = User.getUserID();
                $http.get(TheRedPin.url + 'users/' + userID + '/favorites')
                    .success(function (response) {
                        favorites.properties = response.result.properties;
                        favorites.projects = response.result.projects;
                        favorites.buildImages();
                        successCallback(response);
                    }).error(function (response) {
                    errorCallback(response);
                });
            };

            favorites.deleteFavorite = function (favID, successCallback, errorCallback) {
                var userID = User.getUserID();
                var data = {
                    is_deleted: true
                };
                $http.put(TheRedPin.url + 'users/' + userID + '/favorites/' + favID, data)
                    .success(function (response) {
                        successCallback(response);
                    }).error(function (response) {
                    errorCallback(response);
                });
            };

            favorites.buildImages = function () {
                var properties = this.properties || [];
                var projects = this.projects || [];
                var listings = properties.concat(projects);
                var imagesBuilder = TheRedPin.Components.imagesBuilder();
                angular.forEach(listings, function (listing) {
                    listing.images = imagesBuilder.buildImages(listing.images);
                });
            };

            return favorites;
        }])

        .factory('SSFilters', ['$filter', function ($filter) {
            var filters = {};

            filters.process = function (search) {
                var parsedFilters = [];
                parsedFilters.push(filters.cityParser(search.filters));
                parsedFilters.push(filters.hoodParser(search.filters));
                parsedFilters.push(filters.priceParser(search.filters));
                parsedFilters.push(filters.propertyTypeParser(search.filters));
                parsedFilters.push(filters.bedsParser(search.filters));
                parsedFilters.push(filters.bathsParser(search.filters));

                parsedFilters = $filter('filter')(parsedFilters, function (val) {
                    return val;
                });
                search.parsedFilters = parsedFilters.join(', ');
                return search;
            };

            filters.priceParser = function (filters) {
                var priceFilter;
                if (filters.min_price && filters.max_price) {
                    priceFilter = '$' + $filter('number')(filters.min_price, 0) +
                        ' - $' + $filter('number')(filters.max_price, 0);
                } else if (filters.min_price) {
                    priceFilter = '$' + $filter('number')(filters.min_price, 0) + ' +';
                } else if (filters.max_price) {
                    priceFilter = '$0 - $' + $filter('number')(filters.max_price, 0);
                } else {
                    priceFilter = 'Any Price';
                }
                return priceFilter;
            };

            filters.propertyTypeParser = function (filters) {
                var propertyTypeFilter = filters.property_type ? filters.property_type.split(',').join(', ') : '';
                return propertyTypeFilter;
            };

            filters.bedsParser = function (filters) {
                var bedsFilter = filters.beds + ' Beds';
                return bedsFilter;
            };

            filters.bathsParser = function (filters) {
                var bathsFilter = filters.baths + ' Baths';
                return bathsFilter;
            };

            filters.cityParser = function (filters) {
                var city;
                city = filters.city_name ? filters.city_name : undefined;
                return city;
            };

            filters.hoodParser = function (filters) {
                var hood;
                hood = filters.hood_name ? filters.hood_name : undefined;
                return hood;
            };

            return filters;
        }])

        .factory('SavedSearches', ['$http', 'User', 'SSFilters', function ($http, User, SSFilters) {
            var savedSearches = {};

            savedSearches.getSavedSearches = function (successCallback, errorCallback) {
                var userID = User.getUserID();
                $http.get(TheRedPin.url + 'users/' + userID + '/saved-searches/')
                    .success(function (response) {
                        var searches = response.result;
                        searches = searches.map(SSFilters.process);
                        savedSearches.searches = searches;
                        successCallback(response);
                    }).error(function (response) {
                    errorCallback(response);
                });
            };

            savedSearches.deleteSavedSearch = function (id, successCallback, errorCallback) {
                var userID = User.getUserID();
                $http.delete(TheRedPin.url + 'users/' + userID + '/saved-searches/' + id)
                    .success(function (response) {
                        successCallback(response);
                    }).error(function (response) {
                    errorCallback(response);
                });
            };


            return savedSearches;
        }]);

});