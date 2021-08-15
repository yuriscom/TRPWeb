<?php

    class HybridController extends ControllerBase {

        public $location;
        public $ist;

        public function initialize() {

            parent::initialize();
        }

        public function indexAction() {

            if ($this->is410Error($this->view->canonicalLink)) {
                return $this->_410();
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $oauth = $di->get('oauth');
            $this->view->noIndex = true;

            $this->view->footer = false;
            $layer = $this->dispatcher->getParam("layer");
            if ($layer == "properties") {
                $this->view->listing_type = 'property';
            } else {
                $this->view->constrained = false;
                $this->view->listing_type = 'project';
            }
            $this->view->layer = $layer;

            //if this is an SEO url, get location and listing data
            $params = $this->dispatcher->getParams();
            if (isset($params['province'])) {
                // caching
                $this->viewCacheByUrlEnable();
                if ($this->viewCacheByUrlExists()) {
                    return;
                }

                $provinceName = convertToWebId($params['province']);
                try {
                    $province = \Model\Location::getByWebId('province', $provinceName);
                } catch (\Exception\Fatal $e) {
                    return $this->_503();
                }

                if (!count($province)) {
                    return $this->_404();
                }
            }

            if (isset($params['type'])) {
                $istName = convertToWebId($params['type']);
                try {
                    $istType = \Model\PropertyTrpType::getByWebId($istName);
                } catch (\Exception\Fatal $e) {
                    return $this->_503();
                }

                if (!count($istType)) {
                    return $this->_404();
                }

                $this->ist = convertToName($istType['sys_name']);
            }

            if (isset($params['area']) && isset($params[$params['area']])) {
                $options = array('includePoly' => true);
                $scope = null;
                if ($params['area'] == "city") {
                    $scope = $province['name'];
                } else if ($params['area'] == "hood") {
                    $scope = $this->dispatcher->getParam("city");
                }

                try {
                    $this->location = $location = \Model\Location::getByWebId($params['area'], $params[$params['area']], $scope, $options);
                } catch (\Exception\Fatal $e) {
                    return $this->_503();
                }

                if (!$location) {
                    return $this->_404();
                }

                if ($this->is410Error($this->view->canonicalLink)) {
                    return $this->_410();
                }

                $this->view->locationData = $location;

                $viewParams = $this->dispatcher->getParams();

                //pagination
                $perPage = 16;
                $page = isset($_GET['page']) ? intval($_GET["page"]) : 0;
                $viewParams['num'] = $perPage;
                $viewParams['offset'] = intval($page * $perPage);
                $viewParams['order_by'] = $layer == "properties" ? 'dom,asc' : 'price,asc';

                //filters
                if (count($location['coords']) > 0) {
                    $viewParams['bounds'] = $location['coords']['x2'] . "," . $location['coords']['y2'] . "," . $location['coords']['x1'] . "," . $location['coords']['y1'];
                }
                if ($params['area'] == "region" || $params['area'] == "city" || $params['area'] == "hood") {
                    $viewParams['poly_id'] = $location['id'] . ',' . $params['area'];
                    $viewParams[$params['area']] = $location['id'];
                }
                unset($viewParams['province']);
                if (isset($viewParams['hood']) && !is_numeric($viewParams['hood'])) {
                    unset($viewParams['hood']);
                }
                if (isset($viewParams['city']) && !is_numeric($viewParams['city'])) {
                    unset($viewParams['city']);
                }
                if (isset($viewParams['region']) && !is_numeric($viewParams['region'])) {
                    unset($viewParams['region']);
                }
                try {
                    $accessToken = $oauth->getAccessCookie();
                    // sort results by public / private if user is not authenticated
                    if (!$accessToken && $layer === 'properties') {
                        $viewParams['order_by'] = 'is_public,desc|' . $viewParams['order_by'];
                    }
                    $listings = \Model\Listings::getListings($viewParams, $layer, $accessToken);
                } catch (\Exception\Fatal $e) {
                    return $this->_503();
                }

                if ($layer == 'properties') {
                    function isPublic($listing) {

                        return $listing[9] == 1;
                    }

                    $publicListings = array();
                    $publicListings = array_filter($listings['listings'], "isPublic");
                    $numPublic = count($publicListings);
                    if ($numPublic < 2) {
                        $this->view->noIndex = true;
                    }
                } else {
                    if ($listings['totalCount'] < 1) {
                        $this->view->noIndex = true;
                    }
                }

                $this->view->rawSummary = json_encode($listings, JSON_UNESCAPED_SLASHES);
                $this->view->theCount = $listings;

                //label the array using the [0] array
                $originalArray = $listings;
                $keys = $listings['listings'][0];

                function multiArrayFlip($array) {

                    $newArray = array();
                    foreach ($array as $k => $v) {
                        //this part flattens City,Hood,TrpPT
                        if (is_array($v)) {
                            foreach ($v as $key => $val) {
                                if (is_array($val)) {
                                    $newArray[$key] = $v[$key];
                                }
                            }
                        } else {
                            //this flips the key value pair for top level elements
                            $newArray[$v] = $array[$k];
                        }
                    }
                    //this flips the city, hood and TrpPT inside arrays
                    foreach ($newArray as $k => $v) {
                        if (is_array($v) && $k != 'PB') {
                            foreach ($v as $key => $val) {
                                $newArray[$k][$val] = $key;
                                unset ($newArray[$k][$key]);
                            }
                        } //this is for the Builder arrays
                        elseif (is_array($v) && $k == 'PB') {
                            // first reverse the deepest array
                            foreach ($v[0][1]['Builder'] as $key => $val) {
                                $newArray[$k][0][1]['Builder'][$val] = $key;
                                unset($newArray[$k][0][1]['Builder'][0]);
                                unset($newArray[$k][0][1]['Builder'][1]);
                            }
                            foreach ($v[0] as $key => $val) {
                                // then reverse the id
                                if (!is_array($val)) {
                                    $newArray[$k][0][$val] = $key;
                                    unset($newArray[$k][0][0]);
                                } // then move the Builders array one to the left to match data
                                else {
                                    $newArray[$k][0][1] = call_user_func_array('array_merge', $newArray[$k][0][1]);
                                    $newArray[$k][0]['Builders'] = $newArray[$k][0][1];
                                    unset($newArray[$k][0][1]);
                                }
                            }
                        }
                    }
                    //make images an array
                    foreach ($newArray as $k) {
                        if ($k == 'images') {
                            $newArray[$k] = [0];
                        }
                    }

                    return $newArray;
                }

                $keyMap = multiArrayFlip($keys);
                unset($originalArray['listings'][0]);

                $arrayToChange = $listings['listings'];
                unset($arrayToChange[0]);

                function combine_array_recursive($keys, $vals) {

                    $newArray = array();
                    $theKeys = reset($keys);
                    $newVals = reset($vals);
                    do {
                        if (is_array($newVals)) {
                            if (key($theKeys) == 'PB') {
                                $newArray[key($keys)] = combine_array_recursive($theKeys, $newVals);
                            }
                            if (key($theKeys) == 'images') {
                                $newArray['images'] = $newVals;
                            } else {
                                $newArray[key($keys)] = combine_array_recursive($theKeys, $newVals);
                            }
                        } else {
                            $newArray[key($keys)] = $newVals;
                        }
                        $newVals = next($vals);
                    } while ($theKeys = next($keys));

                    return $newArray;
                }

                $final = array();
                for ($i = 1; $i <= count($arrayToChange); $i++) {
                    $final[] = combine_array_recursive($keyMap, $arrayToChange[$i]);
                }
                // end re-labelling of array

                $this->view->listingsData = $final;

                //deliver filters
                $compiledParams = $this->dispatcher->getParams();
                $compiledParams['bound_to'] = $viewParams['bounds'];
                if ($viewParams['poly_id'] != "") {
                    $compiledParams['poly_id'] = $viewParams['poly_id'];
                    $compiledParams['poly'] = $location['polygon'];
                }

                if (isset($_GET['legacy'])) {
                    $legacyParams = json_decode($_GET['legacy'], true);
                    foreach ($legacyParams as $legacyParam) {
                        $m = explode('=', $legacyParam);
                        $compiledParams[$m[0]] = $m[1];
                    }
                }

                $this->view->filters = json_encode($compiledParams);
            }
            $seoLevel = array();
            if ($location['Regions']) {
                $seoLevel['type'] = 'Regions';
                $seoLevel['name'] = 'regions';
            } elseif ($location['Cities']) {
                $seoLevel['type'] = 'Cities';
                $seoLevel['name'] = 'cities';
            } elseif ($location['Hoods']) {
                $seoLevel['type'] = 'Hoods';
                $seoLevel['name'] = 'neighbourhoods';
            } else {
                $seoLevel['type'] = null;
                $seoLevel['name'] = '';
            }
            $this->view->seoLevel = $seoLevel;

            // generating data for SEO URLs
            $seoIstSysName = isset($istType['sys_name']) ? $istType['sys_name'] : 'listings';
            $seoIstName = isset($istType['name']) ? $istType['name'] : 'Homes';
            $seoTypeUrl = $layer == 'properties' ? 'mls-' . $seoIstSysName . '-for-sale' : 'new-preconstruction-for-sale';
            $pattern = '/' . $seoTypeUrl . '\/(.+)/';

            $this->view->compiledParams = $compiledParams;
            $this->view->seoLayerName = $layer == 'properties' ? 'MLS® Listings' : 'New Preconstruction projects';
            $this->view->seoIstName = $seoIstName;
            $this->view->seoTypeFilterUrl = $seoTypeUrl . '/';

            $this->view->canonicalLink = $this->generateHybridCanonical($this->view->canonicalLink);

            $this->view->action = 'index';

            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/hybrid.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/hybrid.js');
            // set up total num for seo metadata template:
            $this->dispatcher->setParam("num", $listings['totalCount']);
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function matchesAction() {

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $oauth = $di->get('oauth');

            $this->view->noIndex = true;

            $saved_search_id = isset($_GET['saved_search_id']) ? $_GET['saved_search_id'] : null;
            $saved_search_bounds = isset($_GET['bounds']) ? $_GET['bounds'] : null;
            $saved_search_since = isset($_GET['since']) ? $_GET['since'] : null;

            if (!isset($saved_search_id)) {
                $parsed_url = parse_url($_SERVER['REQUEST_URI']);
                $query = $parsed_url['query'];
                header("Location: " . "/mls-listings/?" . $query, true, 301);
            }

            $saved_search_date = date_create($saved_search_since);
            $formated_saved_search_date = date_format($saved_search_date, 'M jS, Y');

            if (isset($saved_search_id)) {
                $saved_search = \Model\SavedSearch::getById($saved_search_id);
                $saved_search_name = $saved_search['name'];
                $saved_search_bounds = $saved_search['bounds'];

            }

            $this->view->footer = false;
            $layer = 'properties';
            $this->view->listing_type = 'property';

            $this->view->layer = $layer;

            // generating data for SEO URLs
            $seoIstSysName = isset($istType['sys_name']) ? $istType['sys_name'] : 'listings';
            $seoIstName = isset($istType['name']) ? $istType['name'] : 'Homes';
            $seoTypeUrl = $layer == 'properties' ? 'mls-' . $seoIstSysName . '-for-sale' : 'new-preconstruction-for-sale';
            $pattern = '/' . $seoTypeUrl . '\/(.+)/';

            $this->view->seoLayerName = $layer == 'properties' ? 'MLS® Listings' : 'New Preconstruction projects';
            $this->view->seoIstName = $seoIstName;
            $this->view->seoTypeFilterUrl = $seoTypeUrl . '/';

            $this->view->canonicalLink = $this->generateHybridCanonical($this->view->canonicalLink);

            $this->view->action = 'matches';

            $this->view->saved_search_id = $saved_search_id;
            $this->view->saved_search_since = $saved_search_since;
            $this->view->saved_search_bounds = $saved_search_bounds;
            $this->view->saved_search_name = $saved_search_name;
            $this->view->saved_search_date = $formated_saved_search_date;

            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/hybrid.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/hybrid.js');

            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        protected function generateHybridCanonical($baseCanonical) {

            $seo_filters_match = "/\/(move-in-[^\/]+|priced-between-[^\/]+|with-[^\/]+|[^\/]*bedroom[s]?|under-[^\/]+|over-[^\/]+|by-[^\/]+)\/?/";

            return preg_replace($seo_filters_match, "/", $baseCanonical);
        }

        protected function is410Error($baseCanonical) {

            $seo_filters_match = "/\/(move-in-[^\/]+|priced-between-[^\/]+|with-[^\/]+|[^\/]*bedroom[s]?|under-[^\/]+|over-[^\/]+|by-[^\/]+)\/?/";
            // SEO Experiment with 410 response for Brampton filter URLs only
            if (preg_match($seo_filters_match, $baseCanonical) && preg_match('/(brampton|vancouver)/', $baseCanonical)) {
                return true;
            }

            return false;
        }

    }
