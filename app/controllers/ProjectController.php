<?php

    class ProjectController extends ControllerBase {

        public $listing;

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
            $params = $this->dispatcher->getParams();
            $oauth = $di->get('oauth');


            //        if (isset($params['builder'])) {
            //            $doesBuilderExist = \Model\Builder::getByWebId($params['builder']);
            //            if (!$doesBuilderExist) {
            //                return $this->_404();
            //            }
            //        }

            try {
                $accessToken = $oauth->getAccessCookie();
                $result = \Model\Project::getById($params['name'], array('type' => 'name'), $accessToken);
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }


            if (!count($result)) {
                return $this->_404();
            }

            $this->listing = $listing = $result;

            // hidden project redirects
            if ($listing['hidden'] == 1) {
                header("Location: " . "/" . $listing['MainProvince']['web_id'] . "-" . $listing['MainCity']['web_id'] . "/" . (isset($listing['MainHood']) ? $listing['MainHood']['web_id'] . '/' : '') . "new-preconstruction-for-sale/", true, 301);
                $this->cookies->set('redirectAddr', $listing['name'], null, "/", null, null, false);
                $this->view->noIndex = true;
            }

            if (empty($listing['MainCity'])) {
                return $this->_404();
            }

            $urlAr = explode('?', $_SERVER['REQUEST_URI']);
            if ($urlAr[0] !== $listing['url']) {
                header("Location: " . $listing['url'], true, 301);
            }
            // handle vip redirects
            if ($params['vipPresaleRegistration'] != $listing['is_vip_active']) {
                if ($listing['url'] && trim($listing['url'], "/") != trim($_SERVER['REQUEST_URI'], "/")) {
                    header("Location: " . $listing['url'], true, 301);
                }
            }

            $id = (int) $listing['id'];
            try {
                $mortgage_rate = \Model\Property::getRate();
                $this->view->mortgage_rate = $mortgage_rate[0]['content'];
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            $imagesArray = $listing['images'];
            $imagesArray = \Helper\ImagesBuilder::buildImages($imagesArray);

            $listing['logo'] = \Helper\ImagesBuilder::buildImages($listing['logo']);

            // breadcrumb SEO urls and names
            $this->view->seoBreadcrumbs = parent::buildProfileBreadcrumbs();

            $this->view->listing = $listing;
            $this->view->listing_type = 'project';
            $this->view->price_min = $listing['price_min'];
            $this->view->price_max = $listing['price_max'];
            $this->view->full_images = $imagesArray;

            $this->view->walkscore = $listing['walk_score'];
            $this->view->transitscore = $listing['transit_score'];

            $this->view->propertyImage = (isset($listing['images'][0]) ? $listing['images'][0] : null);

            // rebate amount for the max price for now
            $rebateAmount = number_format(round($listing['price_min'] * 0.025 * 0.15));

            $this->view->rebateAmount = $rebateAmount;

            $average_sq_ft = ($listing['sqft_min'] + $listing['sqft_max']) / 2;
            $average_price = ($listing['price_min'] + $listing['price_max']) / 2;
            $this->view->taxes = number_format(round($listing['monthly_taxes'])); // is this necessary?
            $this->view->property_price = $listing['price_min'];

            $maintenancePerSqft = (isset($listing['maintenance_per_sqft'])) ? "$" . number_format((float) $listing['maintenance_per_sqft'], 2, '.', '') : null;
            $this->view->formatted_maintenance_per_sqft = $maintenancePerSqft;

            $nearbyProjectsWidget = new \Widget\NearbyProjects\Controller();
            $this->view->nearbyProjectsData = $nearbyProjectsWidget->render(array("id" => $id, "access_token" => $accessToken));

            $contactObj = new ContactController();
            $params = $contactObj->fillContactParams();
            if (!empty($id)) {
                $params['precon_id'] = $id;
                $params['listing_addr'] = $listing['addr_street'];
            }

            $this->view->rawContact = json_encode($params);
            if ($listing['is_vip_active']) {
                $this->view->gaLabel = 'VIP';
            } else {
                $this->view->gaLabel = 'Project';
            }

            // build amenity images
            foreach($listing['PreconPreconAmenities'] as &$amenity) {
                $images = $amenity['PreconAmenity']['images'];
                $precon['PreconAmenity']['images'] = \Helper\ImagesBuilder::buildImages($images);
            }

            $this->view->PreconUnits = isset($listing['PreconUnits']) ? $listing['PreconUnits'] : $listing['PreconUnit'];

            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/profile.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/profile.js');

            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

    }
