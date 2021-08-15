<?php

    error_reporting(E_ALL);

    class LandingController extends ControllerBase {

        public function initialize() {

            parent::initialize();
        }


        public function indexAction() {

            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'none';
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            $this->view->isLanding = true;

            $resale = [];
            $precon = [];

            try {
                $cities = \Model\FeaturedListings::getFeaturedCities();
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            $resale['cities'] = $cities[0]['properties'];
            $precon['cities'] = $cities[1]['projects'];

            try {
                $hoods = \Model\FeaturedListings::getFeaturedHoods();
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            if (isset($_COOKIE['last-search-layer'])) {
                $lastSearchLayer = $_COOKIE['last-search-layer'];
            }

            $resale['hoods'] = $hoods[0]['properties'];
            $precon['hoods'] = $hoods[1]['projects'];

            $resale = self::buildFeaturedLocationImages($resale);
            $precon = self::buildFeaturedLocationImages($precon);

            $this->view->resale = $resale;
            $this->view->precon = $precon;
            $this->view->activeLayer = $lastSearchLayer;

            $this->view->landing_action = $this->dispatcher->getActionName();

            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function propertiesLandingAction() {

            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'properties';
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            // $this->view->isLanding = true;

            $resale = [];
            $precon = [];

            try {
                $cities = \Model\FeaturedListings::getFeaturedCities();
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            $resale['cities'] = $cities[0]['properties'];
            $precon['cities'] = $cities[1]['projects'];

            try {
                $hoods = \Model\FeaturedListings::getFeaturedHoods();
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            $resale['hoods'] = $hoods[0]['properties'];
            $precon['hoods'] = $hoods[1]['projects'];

            $resale = self::buildFeaturedLocationImages($resale);
            $precon = self::buildFeaturedLocationImages($precon);

            $this->view->resale = $resale;
            $this->view->precon = $precon;
            $this->view->activeLayer = 'properties';

            $this->view->gaLabel = 'Buyers';
            $this->view->landing_action = $this->dispatcher->getActionName();

            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function projectsLandingAction() {

            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'projects';
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            // $this->view->isLanding = true;

            $resale = [];
            $precon = [];

            try {
                $cities = \Model\FeaturedListings::getFeaturedCities();
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            $resale['cities'] = $cities[0]['properties'];
            $precon['cities'] = $cities[1]['projects'];

            try {
                $hoods = \Model\FeaturedListings::getFeaturedHoods();
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            $resale['hoods'] = $hoods[0]['properties'];
            $precon['hoods'] = $hoods[1]['projects'];

            $resale = self::buildFeaturedLocationImages($resale);
            $precon = self::buildFeaturedLocationImages($precon);

            $this->view->resale = $resale;
            $this->view->precon = $precon;
            $this->view->activeLayer = 'projects';

            $this->view->gaLabel = 'Buyers';
            $this->view->landing_action = $this->dispatcher->getActionName();

            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function exclusivesLandingAction() {

            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'exclusives';
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            $exclusivesListings = \Model\ExclusiveListing::getAll(array('format' => 'standard'));

            $exclusiveProjects = self::getExclusiveProjects($exclusivesListings);
            $exclusiveCollections = self::buildExclusiveCollections($exclusivesListings, $exclusiveProjects);

            $this->view->exclusiveProjects = $exclusiveCollections;
            // $this->view->isLanding = true;

            $this->view->gaLabel = 'Exclusives';
            $this->view->landing_action = $this->dispatcher->getActionName();
            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/exclusive-landing.js');

            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function sellLandingAction() {

            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'sell';
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            // $this->view->isLanding = true;

            $resale = [];
            $precon = [];

            try {
                $cities = \Model\FeaturedListings::getFeaturedCities();
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            $resale['cities'] = $cities[0]['properties'];
            $precon['cities'] = $cities[1]['projects'];

            try {
                $hoods = \Model\FeaturedListings::getFeaturedHoods();
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            $resale['hoods'] = $hoods[0]['properties'];
            $precon['hoods'] = $hoods[1]['projects'];

            $this->view->resale = $resale;
            $this->view->precon = $precon;
            $this->view->activeLayer = 'properties';

            $this->view->gaLabel = 'Sellers';
            $this->view->landing_action = $this->dispatcher->getActionName();

            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function mortgagesLandingAction() {

            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'mortgages';
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            // $this->view->isLanding = true;

            $this->view->gaLabel = 'Mortgage';
            $this->view->landing_action = $this->dispatcher->getActionName();

            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        private static function getExclusiveProjects($exclusiveListings) {

            $uniquePreconIds = self::getExclusiveProjectIds($exclusiveListings);
            $params = array("response" => "summary",
                            "ids" => join(",", $uniquePreconIds));
            $exclusiveProjects = \Model\Project::search($params);
            return $exclusiveProjects;
        }

        private static function buildExclusiveCollections($exclusiveListings, $exclusiveProjects) {
            $collections = array();
            $orphans = array(
                'units' => array()
            );
            $units = self::structureUnits($exclusiveListings['listings']);
            foreach ($exclusiveProjects['listings'] as $project) {
                $project['images'] = \Helper\ImagesBuilder::buildImages($project['images']);
                $project['units'] = $units[$project['id']];

                $project['units_count'] = sizeof($project['units']);
                $project['units'] = json_encode($project['units'], JSON_HEX_APOS);
                array_push($collections, $project);
            }
            if ($units['orphans']) {
                $orphans['units_count'] = sizeof($orphans['units']);
                $orphans['units'] = json_encode($units['orphans'], JSON_HEX_APOS);
                array_push($collections, $orphans);
            }

            return $collections;
        }

        private static function structureUnits($exclusiveListings) {
            $units = array();
            foreach($exclusiveListings as $exclusiveListing) {
                $exclusiveListing['images'] = \Helper\ImagesBuilder::buildImages($exclusiveListing['images']);
                $listingPreconId = $exclusiveListing['precon_id'];
                if ($listingPreconId) {
                    if (!isset($units[$listingPreconId])) {
                        $units[$listingPreconId] = array();
                    }
                    array_push($units[$listingPreconId], $exclusiveListing);
                } else {
                    if (!isset($units['orphans'])) {
                        $units['orphans'] = array();
                    }
                    array_push($units['orphans'], $exclusiveListing);
                }
            }

            return $units;
        }

        private static function getExclusiveProjectIds($exclusiveListings) {

            $preconIds = array();
            foreach ($exclusiveListings['listings'] as $exclusiveListing) {
                array_push($preconIds, $exclusiveListing['precon_id']);
            }
            $uniquePreconIds = array_unique($preconIds);

            return $uniquePreconIds;
        }

        private static function buildFeaturedLocationImages($featuredLocations) {
            foreach ($featuredLocations as &$locationType) {
                foreach ($locationType as &$province) {
                    foreach ($province as &$location) {
                        $location['images'] = \Helper\ImagesBuilder::buildImages($location['images']);
                    }
                }
            }
            return $featuredLocations;
        }
    }
