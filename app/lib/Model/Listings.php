<?php

    namespace Model;


    class Listings {
        private $_di;

        public function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        public static function getListings($params, $layer, $accessToken = null, $response = 'summary', $format = 'compact') {
            $res = \Http\Request::create('GET')
                                ->from('app', "/" . $layer . "?format=" . $format . "&response=" . $response)
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