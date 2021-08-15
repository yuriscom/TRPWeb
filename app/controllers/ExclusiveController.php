<?php

    class ExclusiveController extends ControllerBase {

        private $_levelAr = array();
        public  $listing;

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
            $oauth = $di->get('oauth');
            $params = $this->dispatcher->getParams();

            if (isset($params['id'])) {
                $id = $this->dispatcher->getParam("id");
            } else {
                return $this->_404();
            }

            try {
                // $accessCookie = $this->cookies->get('access_token');
                $accessToken = $oauth->getAccessCookie();
                $this->listing = $listing = \Model\ExclusiveListing::getById($id, $accessToken, $params);
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            // inactive property redirect
            if ($listing['ExclusivePropertyStatus']['name'] == 'Deactivated') {
                header("Location: " . "/" . $listing['MainProvince']['web_id'] . "-" . $listing['MainCity']['web_id'] . "/" . (isset($hood) ? $hood['web_id'] . '/' : '') . "mls-listings-for-sale/", true, 301);
                $this->cookies->set('redirectAddr', $listing['addr_full'], null, "/", null, null, false);
                $this->view->noIndex = true;
            }

            if ($listing['ExclusivePropertySaleType']['web_id'] !== $params['type']) {
                return $this->_404();
            }

            if (!isset($listing['id'])) {
                return $this->_404();
            } else {
                $id = $listing['id'];
                $city = $listing['MainCity'];
                if (isset($listing['MainHood'])) {
                    $hood = $listing['MainHood'];
                }
            }

            $imagesArray = $listing['images'];
            $imagesArray = \Helper\ImagesBuilder::buildImages($imagesArray);
            $propertyRooms = array();
            $rebateAmount = number_format($listing['price'] * 0.025 * 0.15);
            $this->view->rebateAmount = $rebateAmount;

            if (isset($listing['ExclusivePropertyRooms'])) {

                foreach ($listing['ExclusivePropertyRooms'] as $room) {

                    switch ($room['level']) {
                        case 'Bsmt':
                            $room['level'] = 'Basement';
                            break;

                        case 'Sub-Bsmt':
                            $room['level'] = 'Sub-Basement';
                            break;

                        case 'In Betwn':
                            $room['level'] = 'In Between';
                            break;

                        default:
                            break;
                    }
                    $propertyRooms[$room['level']][] = $room;
                }

                // Set PropertyRooms to new sorted array;
                $listing['ExclusivePropertyRooms'] = $propertyRooms;
            }

            $this->view->address = $listing['addr_full'];

            if ($listing['real_dom'] == '') {
                $this->view->real_dom = '0';
            } else {
                $this->view->real_dom = $listing['real_dom'];
            }

            //using main_table values for city and hood
            $listing['addr_city'] = $city['name'];
            $listing['addr_hood'] = isset($hood['name']) ? $hood['name'] : null;

            $this->view->listing = $listing;
            $this->view->listing_type = 'exclusive';
            $this->view->breadcrumbs = array('/home' => 'Home',
                                             '/city' => $listing['addr_city'],
                                             '/hood' => $listing['addr_hood'],
                                             '/address' => $listing['addr_full']);
            $this->view->property_price = number_format($listing['price']);
            $this->view->monthly_maintenance = number_format(round($listing['monthly_maintenance']));
            $this->view->taxes_yearly = number_format(round($listing['taxes']));
            $this->view->taxes = number_format(round(round($listing['taxes'])) / 12);

            $this->view->walkscore = $listing['walk_score'];
            $this->view->transitscore = $listing['transit_score'];

            // breadcrumb SEO urls and names
            $this->view->seoBreadcrumbs = parent::buildProfileBreadcrumbs();

            // noindex if private
            if ($listing['is_public'] != 1) {
                $this->view->noIndex = true;
                $this->view->showCanonical = false;
            }

            // generate full address. Remove when possible,
            $addrPretty = '';
            if ($listing['addr_street_num']) {
                $addrPretty = $addrPretty . $listing['addr_street_num'] . ' ';
            }
            if ($listing['addr_street']) {
                $addrPretty = $addrPretty . $listing['addr_street'] . ' ';
            }
            if ($listing['addr_street_suffix']) {
                $addrPretty = $addrPretty . $listing['addr_street_suffix'] . ' ';
            }
            if ($listing['addr_street_dir']) {
                $addrPretty = $addrPretty . $listing['addr_street_dir'] . ' ';
            }
            $this->view->addrPretty = $addrPretty;

            // get nearby projects
            if ($listing['precon_id']) {
                $nearbyProjectsWidget = new \Widget\NearbyProjects\Controller();
                $this->view->nearbyProjectsData = $nearbyProjectsWidget->render(array("id" => $listing['precon_id']));
            } else {
                $similarExclusivesWidget = new \Widget\SimilarExclusives\Controller();
                $this->view->nearbyProjectsData = $similarExclusivesWidget->render(array("id" => $listing['id']));
            }

            $this->view->full_images = $imagesArray;
            $listingImage = array_first($listing['images']);
            $this->view->propertyImage = (isset($listingImage) ? $listingImage : null);

            if ($listing['rets_feed_id'] === 12) {
                $this->view->tos = 'ddf';
            } else {
                $this->view->tos = '';
            }

            $this->view->profileInfo = self::buildProfileInfo($listing);

            $specialAddr = str_replace("'", "", $listing['addr_full']);
            $params['addr_full'] = $specialAddr;

            $this->view->gaLabel = 'Exclusives';

            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/profile.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/exclusive-profile.js');
            $this->view->optimizely = true;

            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        protected function buildProfileInfo($listing) {
            $profileInfo = array(
                "exclusive_id" => $listing["id"],
                "listing_price" => $listing["price"],
                "listing_taxes" => $listing["taxes"],
                "monthly_maintenance" => $listing["monthly_maintenance"],
                "listing_addr" => $listing["addr_street"],
                "addr_full" => $listing["addr_full"],
                "addr_province" => $listing["addr_province"],
                "province_of_interest" => $listing["addr_province"]
            );
            if (isset($listing["precon_id"])) {
                $profileInfo['precon_id'] = $listing["precon_id"];
            }
            $jsonInfo = json_encode($profileInfo, JSON_HEX_APOS);
            return $jsonInfo;
        }
    }
