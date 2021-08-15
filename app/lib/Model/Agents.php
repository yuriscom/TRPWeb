<?php

    namespace Model;


    class Agents {
        private $_di;

        public function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        public static function getAgents() {
            $res = \Http\Request::create('GET')
                                ->from('app', "/agents?active=1")
                                ->send();
            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function getAgent($id) {
            $res = \Http\Request::create('GET')
                                ->from('app', "/agents/" . $id)
                                ->send();
            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }
    }