<?php

    namespace Model;

    class   ExclusiveListing {

        private $_di;

        public function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        public static function getAll($params = null) {

            $res = \Http\Request::create('GET')->from('app', "/exclusive-properties/")->params($params)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function getById($id, $params = null) {

            $res = \Http\Request::create('GET')->from('app', "/exclusive-properties/" . $id)->params($params)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function getSimilar($id, $num = 5, $accessToken = null) {

            $res = \Http\Request::create('GET')
                                ->from('app', "/exclusive-properties/" . $id . "/similar")
                                ->header($accessToken)
                                ->params(array("num" => $num, "assets_num" => 1))//->version("343")
                                ->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

    }
