<?php

    namespace Model;


    class SavedSearch {
        private $_di;

        public function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        public static function getById($id) {

            $res = \Http\Request::create('GET')->from('app', "/saved-searches/" . $id)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }
    }