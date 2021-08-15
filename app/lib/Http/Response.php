<?php

    namespace Http;

    class Response {

        private $_res;
        private $_responseTime;

        public function __construct($res, $responseTime = null) {

            $this->_res = json_decode($res, 1);
            $this->_responseTime = $responseTime;
        }

        public function getCode() {

            return $this->_res['code'];
        }

        public function getResult() {

            return $this->_res['result'];
        }

        public function getMessage() {

            return (isset($this->_res['message']) ? $this->_res['message'] : "");
        }

        public function getResponseTime() {

            return $this->_responseTime;
        }

        public function isOk() {

            return $this->_res['code'] == "ok";
        }

        public function isToken() {

            if (isset($this->_res['access_token']) && isset($this->_res['refresh_token'])) {
                return true;
            }

            return false;
        }

        public function getTokens() {

            return $this->_res;
        }

    }