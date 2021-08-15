<?php

    namespace Model;


    class FeaturedListings {
        private $_di;

        public function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        public static function getFeaturedCities() {

            $res = \Http\Request::create('GET')->from('app', "/cities?featured=1&format=simple")->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function getFeaturedHoods() {

            $res = \Http\Request::create('GET')->from('app', "/hoods?featured=1&format=simple")->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }
    }