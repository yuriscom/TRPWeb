<?php

    class PropertyController extends ControllerBase {

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
                $id = $params['mls'];
                $params['type'] = 'mls';
            }

            try {
                // $accessCookie = $this->cookies->get('access_token');
                $accessToken = $oauth->getAccessCookie();
                $this->listing = $listing = \Model\Property::getById($id, $accessToken, $params);
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            // inactive property redirect
            if ($listing['property_status_id'] == 2) {
                header("Location: " . "/" . $listing['MainProvince']['web_id'] . "-" . $listing['MainCity']['web_id'] . "/" . (isset($hood) ? $hood['web_id'] . '/' : '') . "mls-listings-for-sale/", true, 301);
                $this->cookies->set('redirectAddr', $listing['addr_full'], null, "/", null, null, false);
                $this->view->noIndex = true;
            }

            $urlAr = explode('?', $_SERVER['REQUEST_URI']);
            if ($urlAr[0] !== $listing['url']) {
                header("Location: " . $listing['url'], true, 301);
            }

            if (isset($listing['redirectUrl']) && $listing['property_status_id'] != 2) {
                $this->view->requireAuth = true;
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
            $rebateAmount = number_format(round($listing['price'] * 0.025 * 0.15));
            $this->view->rebateAmount = $rebateAmount;

            if (isset($listing['PropertyRooms'])) {

                foreach ($listing['PropertyRooms'] as $room) {

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
                $listing['PropertyRooms'] = $propertyRooms;
            }

            // try {
            //     $accessories = \Model\Property::getAccessories($id);
            //     $this->view->accessories = $accessories;
            //     $this->view->amenities = ['schools' => $accessories[0]['schools'], 'daycares' => $accessories[1]['daycares']];
            //     $this->view->places = $accessories[2]['places'];
            //     // p($this->view->accessories);die;
            // } catch (\Exception\Fatal $e) {
            //     // todo: handle exception
            //     p($e->getMessage());
            //     die;
            // }


            try {
                $mortgage_rate = array_first(\Model\Property::getRate());
                $this->view->mortgage_rate = $mortgage_rate['content'];

            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            $this->view->address = $listing['addr_full'];

            if ($listing['real_dom'] == '') {
                $this->view->real_dom = '0';
            } else {
                $this->view->real_dom = $listing['real_dom'];
            }

            $ageCharacterPattern = '/[a-zA-Z]+/';
            preg_match($ageCharacterPattern, $listing['age'], $ageCharacterMatches);
            if ($ageCharacterMatches || $listing['age'] === '' || $listing['age'] === null) {
                $this->view->age = $listing['age'];
            } else if ($listing['age'] === 1) {
                $this->view->age = $listing['age'] . ' year';
            } else {
                $this->view->age = $listing['age'] . ' years';
            }

            //using main_table values for city and hood
            $listing['addr_city'] = $city['name'];
            $listing['addr_hood'] = isset($hood['name']) ? $hood['name'] : null;

            $this->view->listing = $listing;
            $this->view->listing_type = 'property';
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
            $seoBreadcrumbs = parent::buildProfileBreadcrumbs();
            $this->view->seoBreadcrumbs = $seoBreadcrumbs;
            $this->view->mapLink = end($seoBreadcrumbs)->url;

            // noindex if private
            if ($listing['is_public'] != 1) {
                $this->view->noIndex = true;
                $this->view->showCanonical = false;
            }

            // generate full address
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

            // get similiar properties
            $similarPropertiesWidget = new \Widget\SimilarProperties\Controller();
            $this->view->similarPropertiesData = $similarPropertiesWidget->render(array("id" => $id, "access_token" => $accessToken));

            $this->view->full_images = $imagesArray;
            $listingImage = array_first($listing['images']);
            $this->view->propertyImage = (isset($listingImage) ? $listingImage : null);

            if ($listing['rets_feed_id'] === 12) {
                $this->view->tos = 'ddf';
            } else {
                $this->view->tos = '';
            }

            $contactObj = new ContactController();
            $params = $contactObj->fillContactParams();
            $specialAddr = str_replace("'", "", $listing['addr_full']);
            $params['addr_full'] = $specialAddr;
            if (!empty($id)) {
                $params['property_id'] = $id;
                $params['listing_addr'] = $specialAddr;
            }

            $this->view->rawContact = json_encode($params);
            $this->view->gaLabel = 'Property';

            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/profile.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/profile.js');
            $this->view->optimizely = true;


            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

    }
