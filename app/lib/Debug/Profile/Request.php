<?php

    namespace Debug\Profile;

    class Request {
        private static $_instance;

        private $_di;
        private $_requestsAr = array();


        private function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        public static function add(\Http\Request $req) {

            if (!isset(self::$_instance)) {
                self::$_instance = new self();
            }

            self::$_instance->_add($req);
        }

        private function _add($req) {

            if ($this->_di['debug']) {
                $view = $this->_di['view'];
                array_push($this->_requestsAr, array("requestService" => $req->getService(),
                                                     "requestEndpoint" => $req->getEndpoint(),
                                                     "requestUrl" => $req->getUrl(),
                                                     'responseTime' => $req->getResponseTime()));
                $view->debugProfileRequestsAr = $this->_requestsAr;
            }
        }
    }