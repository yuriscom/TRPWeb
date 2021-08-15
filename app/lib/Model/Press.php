<?php

    namespace Model;


    class Press {
        private $_di;

        public function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        public static function getPress() {
            $res = \Http\Request::create('GET')
                                ->from('app', "/press")
                                ->send();
            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }
    }