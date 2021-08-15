<?php

    namespace Model;

    class Property {

        private $_di;

        public function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        public static function search(array $params = array(), $accessToken = null) {

            $defaultParams = array("response" => "autocomplete",
                                   "format" => "standard");

            foreach ($defaultParams as $key => $val) {
                if (!isset($params[$key])) {
                    $params[$key] = $val;
                }
            }

            $res = \Http\Request::create()->from('app', '/properties')->header($accessToken)->params($params)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function getSimilar($id, $num = 5, $accessToken = null) {

            $res = \Http\Request::create('GET')
                                ->from('app', "/properties/" . $id . "/similar")
                                ->header($accessToken)
                                ->params(array("num" => $num, "assets_num" => 1))//->version("343")
                                ->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function getAccessories($id, $num = 5) {

            $res = \Http\Request::create('GET')
                                ->from('app', "/properties/" . $id . "/landmarks")
                                ->params(array("num" => $num))//->version("343")
                                ->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function getRate() {

            $res = \Http\Request::create('GET')->from('app', "/rates?type=interestRate")->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function getById($id, $accessToken = null, $params = null) {

            $res = \Http\Request::create('GET')
                                ->from('app', "/properties/" . $id)
                                ->params($params)
                                ->header($accessToken)
                                ->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

    }
