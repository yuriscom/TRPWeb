<?php

    namespace Model;

    class Authentication {
        private $_di;

        public function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->session = $this->_di->getShared('session');
        }

        public function refreshToken($clientId, $clientSecret, $refreshToken) {

            $this->session->set('status', 'refreshing');

            $res = \Http\Request::create('POST')
                                ->from('app', "/sessions")
                                ->params(array("grant_type" => "refresh_token",
                                               "client_id" => $clientId,
                                               "client_secret" => $clientSecret,
                                               "refresh_token" => $refreshToken), 'params')
                                ->send();

            if ($res->isToken()) {
                $tokensAr = $res->getTokens();
                $this->session->set('status', 'fresh');
                $this->setAccessToken($tokensAr['access_token']);
                $this->setRefreshToken($tokensAr['refresh_token']);
                $this->setTimeout(round(microtime(true) * 1000) + ($tokensAr['expires_in'] * 1000));

            } else {
                throw new \Exception\Fatal($res->getMessage());
            }
        }

        public function setAccessToken($token) {

            if ($this->session->get('status') !== 'refreshing') {
                $this->session->set('accessToken', $token);
            } else {
                $this->setAccessToken($token);
            }

        }

        public function getAccessCookie($params = null) {
            $isSSOLogin = isset($params) && isset($params['access_token']);
            return $isSSOLogin ? $params['access_token'] : $_COOKIE['access_token'];
        }

        public function isAuthenticated() {

            return isset($_COOKIE['access_token']) || isset($_REQUEST['sso']);
        }

        public function setRefreshToken($token) {

            if ($this->session->get('status') !== 'refreshing') {
                $this->session->set('refreshToken', $token);
            } else {
                $this->setRefreshToken($token);
            }

        }

        public function setTimeout($timeout) {

            if ($this->session->get('status') !== 'refreshing') {
                $this->session->set('oauthTimeout', $timeout);
            } else {
                $this->setTimeout($timeout);
            }
        }


    }