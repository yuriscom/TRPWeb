<?php

    namespace Model;

    class PropertyTrpType {

        private $_di;

        public function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        public static function getByWebId($name) {

            $res = \Http\Request::create('GET')->from('app', "/types/" . $name)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function getAll() {

            $res = \Http\Request::create('GET')->from('app', "/types")->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }
    }