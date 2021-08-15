<?php

    error_reporting(E_ALL);

    class LocationController extends ControllerBase {

        public $area;

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

            try {
                $this->area = $province = \Model\Location::getByWebId("province", $this->dispatcher->getParam("slug"));
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            if (!isset($province['id'])) {
                return $this->_404();
            }
            usort($province['Regions'], function ($a, $b) {

                return strcmp($a['name'], $b['name']);
            });

            if ($province['images']) {
                $province['images'] = \Helper\ImagesBuilder::buildImages($province['images']);
                $province['hero_image'] = $province['images'][0];
            } else {
                $province['hero_image'] = \Helper\ImagesBuilder::buildImage();
            }

            $this->view->locationData = $this->view->province = $province;

            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $imagePath = $this->view->resourceUrl . '/images/location/province';
            $this->view->imagePath = $imagePath;
            $imageType = 'province';
            $this->view->imageType = $imageType;
            $rowLength = ceil(count($province['Regions']) / 4);
            $this->view->rowLength = $rowLength;

            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function regionAction() {

            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            try {
                $this->area = $region = \Model\Location::getByWebId("region", $this->dispatcher->getParam("slug"));
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }
            if (!isset($region['id'])) {
                return $this->_404();
            }
            usort($region['Cities'], function ($a, $b) {

                return strcmp($a['name'], $b['name']);
            });

            if ($region['images']) {
                $region['images'] = \Helper\ImagesBuilder::buildImages($region['images']);
                $region['hero_image'] = $region['images'][0];
            } else {
                $region['hero_image'] = \Helper\ImagesBuilder::buildImage();
            }

            $this->view->locationData = $this->view->region = $region;
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');

            $rowLength = ceil(count($region['Cities']) / 4);
            $this->view->rowLength = $rowLength;
            $imagePath = $this->view->resourceUrl . '/images/location/region';
            $this->view->imagePath = $imagePath;
            $imageType = 'region';
            $this->view->imageType = $imageType;
            $this->view->listing_type = 'none';

            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function cityAction() {

            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $params = $this->dispatcher->getParams();
            $provinceName = isset($params['province']) ? $params['province'] : null;
            try {
                $province = \Model\Location::getByWebId("province", $provinceName);
            } catch (Exception $e) {
                $e->getMessage();
            }

            if (!$province) {
                return $this->_404();
            }

            try {
                $this->area = $city = \Model\Location::getByWebId("city", $params['slug'], $province['name']);
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            if (!isset($city['id'])) {
                return $this->_404();
            }
            usort($city['Hoods'], function ($a, $b) {

                return strcmp($a['name'], $b['name']);
            });

            if ($city['images']) {
                $city['images'] = \Helper\ImagesBuilder::buildImages($city['images']);
                $city['hero_image'] = $city['images'][0];
            } else {
                $city['hero_image'] = \Helper\ImagesBuilder::buildImage();
            }

            $this->view->locationData = $this->view->city = $city;
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');

            $rowLength = ceil(count($city['Hoods']) / 4);
            $this->view->rowLength = $rowLength;
            $imagePath = $this->view->resourceUrl . '/images/location/city';
            $this->view->imagePath = $imagePath;
            $imageType = 'city';
            $this->view->imageType = $imageType;
            $this->view->listing_type = 'none';

            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function hoodAction() {

            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            try {
                $this->area = $hood = \Model\Location::getByWebId("hood", $this->dispatcher->getParam("slug"), $this->dispatcher->getParam("city"));
            } catch (\Exception\Fatal $e) {
                return $this->_503();
            }

            if (!$hood) {
                $this->_404();
            }

            if ($hood['images']) {
                $hood['images'] = \Helper\ImagesBuilder::buildImages($hood['images']);
                $hood['hero_image'] = $hood['images'][0];
            } else {
                $hood['hero_image'] = \Helper\ImagesBuilder::buildImage();
            }

            $this->view->locationData = $this->view->hood = $hood;
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $imagePath = $this->view->resourceUrl . '/images/location/hood';
            $this->view->imagePath = $imagePath;
            $imageType = 'hood';
            $this->view->imageType = $imageType;
            $this->view->listing_type = 'none';

            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function nationalAction() {

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'none';
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();
            $imagePath = $this->view->resourceUrl . '/images/location/country';
            $this->view->imagePath = $imagePath;
            $imageType = 'country';
            $this->view->imageType = $imageType;
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');

            $this->area = array("name" => "Canada");
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

    }
