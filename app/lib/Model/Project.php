<?php

    /**
     * Created by PhpStorm.
     * User: petro
     * Date: 2014-12-18
     * Time: 2:43 PM
     */

    namespace Model;

    class Project {

        private $_di;

        public function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        public static function search(array $params = array()) {
p("here"); die;
            $defaultParams = array("response" => "autocomplete",
                                   "format" => "standard");

            foreach ($defaultParams as $key => $val) {
                if (!isset($params[$key])) {
                    $params[$key] = $val;
                }
            }

            $res = \Http\Request::create()
                                ->from('app', '/projects')
                                ->params($params)
                                ->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function getNearby($id, $num = 5, $accessToken = null) {

            $res = \Http\Request::create('GET')
                                ->from('app', "/projects/" . $id . "/nearby")
                                ->header($accessToken)
                                ->params(array("num" => $num, "assets_num" => 1))//->version("343")
                                ->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function getById($id, $params = null, $accessToken = null) {

            $res = \Http\Request::create('GET')->from('app', "/projects/" . $id)
                                ->header($accessToken)
                                ->params($params)
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

    }
