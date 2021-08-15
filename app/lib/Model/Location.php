<?php

    namespace Model;

    class Location {

        private        $_di;
        private static $trans = array("hood" => "hoods",
                                      "city" => "cities",
                                      "region" => "regions",
                                      "province" => "provinces",
                                      "trp1city" => "trp1cities",
                                      "trp1hood" => "trp1hoods");

        public function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        public static function getById($area, $id, $scope = null, $options = null) {

            if (isset(self::$trans[$area])) {
                $endpoint = self::$trans[$area];
            } else {
                throw new \Exception\Fatal("Wrong Area");
            }
            $params = array();
            if ($scope) {
                $params["scope"] = $scope;
            }
            if ($options) {
                $params["options"] = json_encode($options);
            }

            $res = \Http\Request::create('GET')->from('app', "/" . $endpoint . "/" . $id)->params($params)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function getByWebId($area, $id, $scope = null, $options = null) {

            if (isset(self::$trans[$area])) {
                $endpoint = self::$trans[$area];
            } else {
                throw new \Exception\Fatal("Wrong Area");
            }
            $params = array();
            if ($scope) {
                $params["scope"] = $scope;
            }
            if ($options) {
                $params["options"] = json_encode($options);
            }

            $res = \Http\Request::create('GET')->from('app', "/" . $endpoint . "/" . $id)->params($params)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

    }
