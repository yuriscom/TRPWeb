<?php

    error_reporting(E_ALL);

    class ListviewController extends ControllerBase {
        private $_route;
        private $_userAuthenticated;

        public function initialize() {

            parent::initialize();
            $this->view->gaLabel = 'ListView';
            $this->view->controllerName = $this->dispatcher->getControllerName();
        }

        public function indexAction() {

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function listPropertiesAction() {
            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();
            $this->view->listing_type = 'property';
            $params = $this->dispatcher->getParams();

            $oauth = $di->get('oauth');
            $this->_userAuthenticated = $oauth->isAuthenticated();

            $layer = 'properties';
            $layerPath = 'mls-listings';

            $parsedURL = parse_url($_SERVER['REQUEST_URI']);
            $pathName = $parsedURL['path'];
            $queryString = $parsedURL['query'];

            $request = new Phalcon\Http\Request();
            $params = $this->dispatcher->getParams();

            // Validate Property Type
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

            $viewParams = $request->getQuery();
            preg_match('/page-([0-9]+)/', $_SERVER['REQUEST_URI'], $pageMatch);

            $matchedPage = isset($pageMatch[1]) ? $pageMatch[1] : 1;

            // Num listings to return and offset according to results page number
            $queryParams = $viewParams;
            $queryParams['order_by'] = $this->orderByParam($viewParams);
            $queryParams['num'] = $listingsNum = isset($viewParams['num']) ? $viewParams['num'] : 10;
            $queryParams['offset'] = $listingsOffset = 10 * ($matchedPage - 1);
            $queryParams['assets_num'] = 1;
            if (!$this->_userAuthenticated) {
                $queryParams['assets_num'] = 1;
            }
            $routeParams = array();
            // Get users access token
            if ($oauth->isAuthenticated()) {
                $accessToken = $oauth->getAccessCookie($params);
            } else {
                $accessToken = '';
            }
            // Fetch listings
            if (isset($params['area'])) {
                $this->validateSEOShortcut($params);

                $locationInfo = $this->seoLocationData;
                $seoQueryParams = $this->buildSEOQuery($queryParams, $locationInfo, $params);
                $queryParams = array_merge($queryParams, $seoQueryParams);
                $listingsResponse = \Model\Listings::getListings($seoQueryParams, $layer, $accessToken, 'listview', 'standard');
            } else {
                $listingsResponse = \Model\Listings::getListings($queryParams, $layer, $accessToken, 'listview', 'standard');
                // Fetch location data if available
                if (isset($queryParams['hood'])) {
                    $locationInfo = \Model\Hood::getById($queryParams['hood']);
                    $this->_route = new \Router\Route\Filter\PropertyHybridHood();
                    $routeParams = array('province' => $locationInfo['province_web_id'],
                                         'region' => $locationInfo['region_web_id'],
                                         'city' => $locationInfo['city_web_id'],
                                         'hood' => $locationInfo['hood_web_id']);

                } elseif (isset($queryParams['city'])) {
                    $locationInfo = \Model\City::getById($queryParams['city']);
                    $this->_route = new \Router\Route\Filter\PropertyHybridProvince();
                    $routeParams = array('province' => $locationInfo['province_web_id'],
                                         'region' => $locationInfo['region_web_id'],
                                         'city' => $locationInfo['city_web_id']);
                } elseif (isset($queryParams['region'])) {
                    $locationInfo = \Model\Region::getById($queryParams['region']);
                    $this->_route = new \Router\Route\Filter\PropertyHybridRegion();
                    $routeParams = array('province' => $locationInfo['province_web_id'],
                                         'region' => $locationInfo['region_web_id']);
                }
            }
            $listingsTotalCount = $listingsResponse['totalCount'];
            $this->dispatcher->setParam("num", $listingsTotalCount);

            $searchFilters = $this->buildSearchFilters($queryParams);
            foreach ($searchFilters as $key => $value) {
                if ($key === 'min_price' || $key === 'max_price') {
                    $searchFilters[$key] = intval($value);
                }
                unset($searchFilters['_url']);
            }

            $listings = $listingsResponse['listings'];

            // Process Listings
            $listings = array_map(array($this, 'appendMonthlyPayment'), $listings);
            $listings = array_map(array($this, 'appendRebate'), $listings);
            $listings = array_map(array($this, 'appendDOMMessage'), $listings);
            $listings = array_map(array($this, 'appendFormattedPrice'), $listings);
            $listings = array_map(array($this, 'appendAddrPretty'), $listings);
            $listings = array_map(array($this, 'appendAbbrPropertyType'), $listings);
            $listings = array_map(array($this, 'appendCTAProfileInfo'), $listings);
            $listings = array_map(array($this, 'appendImages'), $listings);

            // Build map view url
            $mapPath = preg_replace('/(\/page-[\d]+)?(\/$|\z)/', '/map$1/', $pathName, 1);
            // convert bounds to bound_to
            $mapQueryString = preg_replace('/(^|[&|\?|^])(bounds)(=)/', '$1bound_to$3', $queryString, 1);
            $mapQueryString = strlen($mapQueryString) > 0 ? '?' . $mapQueryString : $mapQueryString;
            $this->view->mapViewUrl = $mapPath . $mapQueryString;


            // breadcrumb SEO urls and names
            if (isset($locationInfo)) {
                $seoBreadcrumbs = $this->buildListBreadcrumbs($locationInfo, $queryString, $layer, 'location');
                $locationDescription = $locationInfo['description'];
                $this->view->locationDescription = $locationDescription;
                $locationAdverb = 'in';
                $locationHeader = end($seoBreadcrumbs)['name'];
            } elseif (isset($queryParams['keywords']) && $queryParams['keywords'] != '') {
                $seoBreadcrumbs = $this->buildListBreadcrumbs($queryParams, $queryString, $layer, 'keywords');
                $locationAdverb = isset($queryParams['bound_type']) && $queryParams['bound_type'] == 'point' ? 'around' : 'in';
                $locationHeader = end($seoBreadcrumbs)['name'];
            } else {
                $seoBreadcrumbs = $this->buildListBreadcrumbs(null, $queryString, $layer, 'layer');
                $locationAdverb = 'in';
                $locationHeader = 'Canada';
            }

            $this->view->seoBreadcrumbs = $seoBreadcrumbs;
            $this->view->locationHeader = $locationHeader;
            $this->view->locationAdverb = $locationAdverb;

            // Build pagination
            $currentPage = $matchedPage;
            $numPages = ceil($listingsTotalCount / $listingsNum);
            $paginationAtStart = $currentPage == 1 || $listingsTotalCount == 0;
            $paginationAtEnd = $currentPage == $numPages || $listingsTotalCount == 0;
            $pagination = $this->buildPagination($currentPage, $numPages, $pathName, $queryString);

            // Build listings range
            $paginationLowerRange = ($currentPage - 1) * $listingsNum + 1;
            $paginationUpperRange = min($paginationLowerRange + $listingsNum - 1, $listingsTotalCount);

            $this->view->userAuthenticated = $this->_userAuthenticated;
            $this->view->paginationLowerRange = number_format($paginationLowerRange);
            $this->view->paginationUpperRange = number_format($paginationUpperRange);
            $this->view->listingsTotalCount = number_format($listingsTotalCount);
            $this->view->currentPage = $currentPage;
            $this->view->paginationAtStart = $paginationAtStart;
            $this->view->paginationAtEnd = $paginationAtEnd;
            $this->view->pagination = $pagination['compiledPages'];
            $this->view->paginationActiveIndex = $pagination['activeIndex'];
            $this->view->searchFilters = json_encode($searchFilters);
            $this->view->layer = $layer;
            $this->view->noIndex = $listingsTotalCount == 0 || $currentPage > $numPages;

            $this->initializeSEOMetadata($currentPage, $numPages, $listingsTotalCount, $routeParams);

            // Pass results to view
            $this->view->listings = $listings;

            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/listview.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/listview.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        private function getNextLink($base, $currentPage, $numPages) {

            return $currentPage == $numPages ? null : $base . 'page-' . ($currentPage + 1) . '/';
        }

        private function getPrevLink($base, $currentPage) {

            return ($currentPage == 1 ? null : ($currentPage == 2 ? $base : $base . 'page-' . ($currentPage - 1) . '/'));
        }

        public function initializeSEOMetadata($currentPage, $numPages, $totalListings, $routeParams = array()) {
            $currentUrl = preg_replace("/(\?.*)/", "", "https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]");
            $pos = strpos($currentUrl, '/page-') ? strpos($currentUrl, '/page-') : strlen($currentUrl);
            $baseUrl = substr($currentUrl, 0, $pos);
            if (count($routeParams) > 0) {
                $baseUrl = 'https://' . $_SERVER['HTTP_HOST'] . $this->_route->assemble($routeParams);
            }

            if (!endsWith($baseUrl, '/')) {
                $baseUrl = $baseUrl . '/';
            }

            if ($totalListings > 0 && $currentPage <= $numPages) {
                $this->view->prevLink = $this->getPrevLink($baseUrl, $currentPage);
                $this->view->nextLink = $this->getNextLink($baseUrl, $currentPage, $numPages);
            }

            // Determine SEO noIndex
            $seo_filters_match = "/\/(move-in-[^\/]+|priced-between-[^\/]+|with-[^\/]+|[^\/]*bedroom[s]?|under-[^\/]+|over-[^\/]+|by-[^\/]+)\/?/";
            $this->view->noIndex = preg_match($seo_filters_match, $currentUrl) || preg_match($seo_ist_match, $currentUrl);

            $this->generateCanonical($baseUrl, $currentPage);
        }

        protected function generateCanonical($base, $currentPage) {
            $seo_filters_match = "/\/(move-in-[^\/]+|priced-between-[^\/]+|with-[^\/]+|[^\/]*bedroom[s]?|under-[^\/]+|over-[^\/]+|by-[^\/]+)\/?/";
            $canonical = preg_replace($seo_filters_match, "/", $base);
            $canonical = $currentPage == 1 ? $canonical : $canonical . 'page-' . $currentPage . '/';

            $this->view->canonicalLink = $this->view->alternate = $canonical;
            return preg_replace($seo_filters_match, "/", $baseCanonical);
        }

        public function listProjectsAction() {

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();
            $this->view->listing_type = 'project';
            $oauth = $di->get('oauth');
            $layer = 'projects';
            $layerPath = 'new-preconstruction';

            $parsedURL = parse_url($_SERVER['REQUEST_URI']);
            $pathName = $parsedURL['path'];
            $queryString = isset($parsedURL['query']) ? $parsedURL['query'] : '';
            $request = new Phalcon\Http\Request();
            $params = $this->dispatcher->getParams();

            $viewParams = $request->getQuery();
            preg_match('/page-([0-9]+)/', $_SERVER['REQUEST_URI'], $pageMatch);

            $matchedPage = isset($pageMatch[1]) ? $pageMatch[1] : 1;

            // Num listings to return and offset according to results page number
            $queryParams = $viewParams;
            $queryParams['num'] = $listingsNum = isset($viewParams['num']) ? $viewParams['num'] : 10;
            $queryParams['offset'] = $listingsOffset = 10 * ($matchedPage - 1);

            // Get users access token
            if ($oauth->isAuthenticated()) {
                $accessToken = $oauth->getAccessCookie($params);
            } else {
                $accessToken = '';
            }

            // Fetch listings
            if (isset($params['area'])) {
                $this->validateSEOShortcut($params);

                $locationInfo = $this->seoLocationData;
                $seoQueryParams = $this->buildSEOQuery($queryParams, $locationInfo, $params);
                $queryParams = array_merge($queryParams, $seoQueryParams);
                $listingsResponse = \Model\Listings::getListings($seoQueryParams, $layer, $accessToken, 'listview', 'standard');
            } else {
                $listingsResponse = \Model\Listings::getListings($queryParams, $layer, $accessToken, 'listview', 'standard');
                // Fetch location data if available
                if (isset($queryParams['hood'])) {
                    $locationInfo = \Model\Hood::getById($queryParams['hood']);
                    $this->_route = new \Router\Route\Filter\ProjectHybridHood();
                    $routeParams = array('province' => $locationInfo['province_web_id'],
                                         'region' => $locationInfo['region_web_id'],
                                         'city' => $locationInfo['city_web_id'],
                                         'hood' => $locationInfo['hood_web_id']);
                } elseif (isset($queryParams['city'])) {
                    $locationInfo = \Model\City::getById($queryParams['city']);
                    $this->_route = new \Router\Route\Filter\ProjectHybridProvince();
                    $routeParams = array('province' => $locationInfo['province_web_id'],
                                         'region' => $locationInfo['region_web_id'],
                                         'city' => $locationInfo['city_web_id']);
                } elseif (isset($queryParams['region'])) {
                    $locationInfo = \Model\Region::getById($queryParams['region']);
                    $this->_route = new \Router\Route\Filter\ProjectHybridRegion();
                    $routeParams = array('province' => $locationInfo['province_web_id'],
                                         'region' => $locationInfo['region_web_id']);
                }
            }
            $listingsTotalCount = $listingsResponse['totalCount'];
            $this->dispatcher->setParam("num", $listingsTotalCount);

            $searchFilters = $this->buildSearchFilters($queryParams);
            foreach ($searchFilters as $key => $value) {
                if ($key === 'min_price' || $key === 'max_price') {
                    $searchFilters[$key] = intval($value);
                }
                unset($searchFilters['_url']);
            }

            $listings = $listingsResponse['listings'];

            // Process Listings
            $listings = array_map(array($this, 'appendProjectPrice'), $listings);
            $listings = array_map(array($this, 'appendMonthlyPayment'), $listings);
            $listings = array_map(array($this, 'appendProjectRebate'), $listings);
            $listings = array_map(array($this, 'appendFormattedMinPrice'), $listings);
            $listings = array_map(array($this, 'appendCTAProfileInfo'), $listings);
            $listings = array_map(array($this, 'appendImages'), $listings);

            // Build map view url
            $mapPath = preg_replace('/(\/page-[\d]+)?(\/$|\z)/', '/map$1/', $pathName, 1);
            // convert bounds to bound_to
            $mapQueryString = preg_replace('/(^|[&|\?|^])(bounds)(=)/', '$1bound_to$3', $queryString, 1);
            $mapQueryString = strlen($mapQueryString) > 0 ? '?' . $mapQueryString : $mapQueryString;
            $this->view->mapViewUrl = $mapPath . $mapQueryString;

            // breadcrumb SEO urls and names
            if (isset($locationInfo)) {
                $seoBreadcrumbs = $this->buildListBreadcrumbs($locationInfo, $queryString, $layer, 'location');
                $locationDescription = $locationInfo['description'];
                $this->view->locationDescription = $locationDescription;
                $locationAdverb = 'in';
                $locationHeader = end($seoBreadcrumbs)['name'];
            } elseif (isset($queryParams['keywords']) && $queryParams['keywords'] != '') {
                $seoBreadcrumbs = $this->buildListBreadcrumbs($queryParams, $queryString, $layer, 'keywords');
                $locationAdverb = isset($queryParams['bound_type']) && $queryParams['bound_type'] == 'point' ? 'around' : 'in';
                $locationHeader = end($seoBreadcrumbs)['name'];
            } else {
                $seoBreadcrumbs = $this->buildListBreadcrumbs(null, $queryString, $layer, 'layer');
                $locationAdverb = 'in';
                $locationHeader = 'Canada';
            }

            $this->view->seoBreadcrumbs = $seoBreadcrumbs;
            $this->view->seoBreadcrumbs = $seoBreadcrumbs;
            $this->view->locationHeader = $locationHeader;
            $this->view->locationAdverb = $locationAdverb;

            // Build pagination
            $currentPage = $matchedPage;
            $numPages = ceil($listingsTotalCount / $listingsNum);
            $paginationAtStart = $currentPage == 1 || $listingsTotalCount == 0;
            $paginationAtEnd = $currentPage == $numPages || $listingsTotalCount == 0;
            $pagination = $this->buildPagination($currentPage, $numPages, $pathName, $queryString);

            // Build listings range
            $paginationLowerRange = ($currentPage - 1) * $listingsNum + 1;
            $paginationUpperRange = min($paginationLowerRange + $listingsNum - 1, $listingsTotalCount);

            $this->view->paginationLowerRange = number_format($paginationLowerRange);
            $this->view->paginationUpperRange = number_format($paginationUpperRange);
            $this->view->listingsTotalCount = number_format($listingsTotalCount);

            $this->view->currentPage = $currentPage;
            $this->view->paginationAtStart = $paginationAtStart;
            $this->view->paginationAtEnd = $paginationAtEnd;
            $this->view->pagination = $pagination['compiledPages'];
            $this->view->paginationActiveIndex = $pagination['activeIndex'];
            $this->view->searchFilters = json_encode($searchFilters);
            $this->view->layer = $layer;
            $this->view->noIndex = $listingsTotalCount == 0 || $currentPage > $numPages;

            $this->initializeSEOMetadata($currentPage, $numPages, $listingsTotalCount, $routeParams);


            // Pass results to view
            $this->view->listings = $listings;

            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/listview.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/listview.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        protected function buildPagination($currentPage, $numPages, $pathName, $queryString) {

            $numPagesToDisplay = min(9, $numPages);
            $numPagesFromCentre = 4;
            $pages = array();

            // remove page from path
            $pathName = preg_replace('/(page-[\d]+)\/?/', '', $pathName);

            for ($i = -($numPagesToDisplay - 1); $i <= ($numPagesToDisplay - 1); $i++) {
                if (($currentPage + $i) > 0 && ($currentPage + $i) < $numPages + 1) {
                    $pageNum = $currentPage + $i;

                    $page['pageNum'] = $pageNum;
                    if ($pageNum == 1) {
                        $page['url'] = $pathName . ($queryString != '' ? '?' . $queryString : '');
                    } else {
                        $page['url'] = $pathName . 'page-' . $pageNum . '/' . ($queryString != '' ? '?' . $queryString : '');
                    }

                    array_push($pages, $page);
                    if ($i == 0) {
                        $activePageIndex = count($pages) - 1;
                        $activePage = $page['pageNum'];
                    }
                }
            }

            if ($activePageIndex < $numPagesFromCentre) {
                $processedPagination = array_slice($pages, 0, $numPagesToDisplay);
                $processedActivePageIndex = $activePage - 1;
            } elseif (((count($pages) - 1) - $activePageIndex) < $numPagesFromCentre) {
                $processedPagination = array_slice($pages, -$numPagesToDisplay);
                $processedActivePageIndex = $numPagesToDisplay - ($numPages - $activePage) - 1;
            } else {
                $processedPagination = array_slice($pages, $activePageIndex - $numPagesFromCentre, $numPagesToDisplay);
                $processedActivePageIndex = $numPagesFromCentre;
            }

            return array('compiledPages' => $processedPagination,
                         'activeIndex' => $processedActivePageIndex);
        }

        // TODO: needs to be refactored and abstracted.
        protected function buildListBreadcrumbs($rawBreadcrumbInfo, $queryString, $layer, $type = 'layer') {

            $layerPath = $layer === 'projects' ? 'new-preconstruction-for-sale/' : 'mls-listings-for-sale/';
            $seoBreadCrumbs = array();

            $homepage = array();
            $homepage['name'] = 'Home Page';
            $homepage['url'] = '/';
            array_push($seoBreadCrumbs, $homepage);

            // TD|PS: Refactor the hell out of this
            if ($type === 'location') {
                if (!empty($rawBreadcrumbInfo['province'])) {
                    $province = array();
                    $province['name'] = $rawBreadcrumbInfo['province'];
                    $province['url'] = '/' . $rawBreadcrumbInfo['province_web_id'] . '-real-estate/' . $layerPath;
                    array_push($seoBreadCrumbs, $province);
                } else {
                    $province = array();
                    $province['name'] = $rawBreadcrumbInfo['name'];
                    $province['url'] = '/';
                    array_push($seoBreadCrumbs, $province);

                    return $seoBreadCrumbs;
                }
                if (!empty($rawBreadcrumbInfo['region'])) {
                    $region = array();
                    $region['name'] = $rawBreadcrumbInfo['region'];
                    $region['url'] = '/' . $rawBreadcrumbInfo['province_web_id'] . '-real-estate/' . $rawBreadcrumbInfo['region_web_id'] . '/' . $layerPath;
                    array_push($seoBreadCrumbs, $region);
                } else {
                    $region = array();
                    $region['name'] = $rawBreadcrumbInfo['name'];
                    $region['url'] = '/';

                    return $seoBreadCrumbs;
                }
                if (!empty($rawBreadcrumbInfo['city'])) {
                    $city = array();
                    $city['name'] = $rawBreadcrumbInfo['city'];
                    $city['url'] = '/' . $rawBreadcrumbInfo['province_web_id'] . '-' . $rawBreadcrumbInfo['city_web_id'] . '/' . $layerPath;
                    array_push($seoBreadCrumbs, $city);
                } else {
                    return $seoBreadCrumbs;
                }
                if (!empty($rawBreadcrumbInfo['hood_web_id'])) {
                    $hood = array();
                    $hood['name'] = $rawBreadcrumbInfo['name'];
                    $hood['url'] = '/' . $rawBreadcrumbInfo['province_web_id'] . '-' . $rawBreadcrumbInfo['city_web_id'] . '/' . $rawBreadcrumbInfo['hood_web_id'] . '/' . $layerPath;
                    array_push($seoBreadCrumbs, $hood);
                }
            } elseif ($type === 'keywords') {
                $keywords = array('name' => ucwords($rawBreadcrumbInfo['keywords']),
                                  'url' => '/' . $layerPath . '?' . $queryString);
                array_push($seoBreadCrumbs, $keywords);
            } elseif ($type === 'layer') {
                $layerPathName = $layer === 'projects' ? 'New Preconstruction' : 'MLS Listings';
                $layerPath = array('name' => $layerPathName,
                                   'url' => '/' . $layerPath . '?' . $queryString);
                array_push($seoBreadCrumbs, $layerPath);
            }

            return $seoBreadCrumbs;
        }

        protected function appendProjectPrice($listing) {

            if (!isset($listing['price_min'])) {
                return $listing;
            }

            $listing['price'] = $listing['price_min'];

            return $listing;
        }

        protected function appendMonthlyPayment($listing) {
            $price = (isset($listing['is_public']) && !$listing['is_public'] && !$this->_userAuthenticated) ?
                $listing['private_price'] : $listing['price'];

            $numAnnualPayments = 12;
            $mortgageAmortization = 25;
            $downPaymentPercent = 20;
            $mortgageInterestRate = 2.69;
            $mortgagePrincipal = $price - ($price * $downPaymentPercent / 100);
            $interestRate = pow(pow((1 + ($mortgageInterestRate / 200)), 2), (1 / $numAnnualPayments)) - 1;
            $total = ($mortgagePrincipal * $interestRate) / (1 - pow((1 + $interestRate), (-$mortgageAmortization * $numAnnualPayments)));

            if (isset($listing['monthly_maintenance']) && $listing['monthly_maintenance'] != '') {
                $total += $listing['monthly_maintenance'];
            }
            $listing['monthlyPayment'] = number_format(round($total));

            return $listing;
        }

        protected function appendProjectRebate($listing) {

            if (!isset($listing['price_min'])) {
                return $listing;
            }
            $rebate = $listing['price_min'] * 0.025 * 0.15;
            $listing['rebateAmount'] = number_format(round($rebate));

            return $listing;
        }

        protected function appendRebate($listing) {
            $price = (!$listing['is_public'] && !$this->_userAuthenticated) ? $listing['private_price'] : $listing['price'];

            $rebate = $price * 0.025 * 0.15;
            $listing['rebateAmount'] = number_format(round($rebate));

            return $listing;
        }

        protected function appendDOMMessage($listing) {

            if ($listing['dom'] == '-' || $listing['dom'] == '') {
                return $listing;
            }
            $dom = $listing['dom'];
            $domMessage = $dom . ' ' . ($dom === 1 ? 'Day Old' : 'Days Old');
            $listing['domMessage'] = $domMessage;

            return $listing;
        }

        protected function appendFormattedPrice($listing) {

            if (!isset($listing['price']) || $listing['price'] == '-') {
                return $listing;
            }
            $price = $listing['price'];
            $listing['formattedPrice'] = number_format($price);

            return $listing;
        }

        protected function appendFormattedMinPrice($listing) {

            if (!isset($listing['price_min'])) {
                return $listing;
            }
            $price = $listing['price_min'];
            $listing['formattedMinPrice'] = number_format($price);

            return $listing;
        }

        protected function appendAddrPretty($listing) {

            if ($listing['addr_full'] == '-') {
                // append area (city, hood, etc)
                $addrPretty = $this->buildAddrArea($addrPretty, $listing);
                $addrPretty = preg_replace('/^,\s/', '', $addrPretty);
            } else {
                // generate full address
                $addrPretty = $listing['addr_full'];
                $addrPretty = $this->buildAddrArea($addrPretty, $listing);
            }
            $addrPretty = ucwords(strtolower($addrPretty));
            $listing['addrPretty'] = $addrPretty;

            return $listing;
        }

        protected function buildAddrArea($addrPretty, $listing) {
            if (isset($listing['Hood']['name'])) {
                $addrPretty .= ', ' . $listing['Hood']['name'];
            }
            if (isset($listing['City']['name'])) {
                $addrPretty .= ', ' . $listing['City']['name'];
            }
            if (!isset($listing['Hood']['name']) && isset($listing['Region']['name'])) {
                $addrPretty .= ', ' . $listing['Region']['name'];
            }
            return $addrPretty;
        }

        protected function appendAbbrPropertyType($listing) {

            $propertyType = $listing['PropertyTrpType']['name'];
            switch ($propertyType) {
                case 'Semi-detached Home':
                    $listing['abbrPropertyType'] = 'Semi-Detached';
                    break;
                case 'Detached Home':
                    $listing['abbrPropertyType'] = 'Detached';
                    break;
                default:
                    $listing['abbrPropertyType'] = $propertyType;
            }

            return $listing;
        }

        protected function appendImages($listing) {
            $images = $listing['images'];
            $listing['images'] = \Helper\ImagesBuilder::buildImages($images);
            return $listing;
        }

        protected function appendCTAProfileInfo($listing) {

            if (isset($listing['mls_num'])) {
                $listing['ctaProfileInfo'] = array('property_id' => $listing['id'],
                                                   'listing_price' => $listing['price'],
                                                   'listing_taxes' => $listing['taxes'],
                                                   'rebate_amount' => $listing['rebateAmount'],
                                                   'monthly_maintenance' => $listing['monthly_maintenance'],
                                                   'listing_addr' => $listing['addr_street'],
                                                   'addr_full' => $listing['addr_full'],
                                                   'addr_province' => $listing['addr_province'],
                                                   'province_of_interest' => $listing['addr_province']);
            } else {
                $listing['ctaProfileInfo'] = array('precon_id' => $listing['id'],
                                                   'is_vip_active' => $listing['is_vip_active'],
                                                   'project_name' => $listing['name'],
                                                   'listing_addr' => $listing['addr_street'],
                                                   'addr_province' => $listing['addr_province'],
                                                   'province_of_interest' => $listing['addr_province']);
                if ($listing['price']) {
                    $financialInfo = array('property_price' => intval(str_replace(',', '', $listing['price'])),
                                           'rebate_amount' => intval(str_replace(',', '', $listing['rebateAmount'])),
                                           'monthly_maintenance' => intval(str_replace(',', '', $listing['monthlyPayment'])));
                    $listing['ctaProfileInfo'] = array_merge($listing['ctaProfileInfo'], $financialInfo);
                }
            }

            return $listing;
        }

        protected function validateSEOShortcut($params) {

            if (isset($params['province'])) {
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
                    $location = \Model\Location::getByWebId($params['area'], $params[$params['area']], $scope, $options);
                    $this->seoLocationData = $location;
                } catch (\Exception\Fatal $e) {
                    return $this->_503();
                }

                if (!$location) {
                    return $this->_404();
                }

                if ($this->is410Error($this->view->canonicalLink)) {
                    return $this->_410();
                }
            }
        }

        protected function orderByParam($viewParams) {
            $orderByParam = isset($viewParams['order_by']) ? $viewParams['order_by'] : 'dom,asc';
            $this->view->orderBy = $orderByParam;
            $orderByParam = $this->_userAuthenticated ? $orderByParam : 'is_public,desc|' . $orderByParam;
            return $orderByParam;
        }

        protected function buildSEOQuery($queryParams, $locationData, $dispatchParams) {

            $seoQueryParams = $dispatchParams;
            $polyData = array($seoQueryParams['area'] => $locationData['id']);
            if (count($locationData['coords']) > 0) {
                $seoQueryParams['bounds'] = $locationData['coords']['x2'] . "," . $locationData['coords']['y2'] . "," . $locationData['coords']['x1'] . "," . $locationData['coords']['y1'];
            }

            if ($dispatchParams['area'] != 'province') {
                $seoQueryParams['poly_id'] = $locationData['id'] . ',' . $dispatchParams['area'];
                $seoQueryParams[$dispatchParams['area']] = $locationData['id'];
            }

            unset($seoQueryParams['seoName']);
            unset($seoQueryParams['area']);
            unset($seoQueryParams['province']);
            unset($seoQueryParams['region']);
            unset($seoQueryParams['city']);
            unset($seoQueryParams['hood']);
            unset($seoQueryParams['page']);

            $seoQueryParams = array_merge($seoQueryParams, $polyData, $queryParams);

            return $seoQueryParams;
        }

        protected function buildSearchFilters($queryParams) {
            $filters = array_filter($queryParams, function($val) {
                return $val != null;
            });
            return $filters;
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