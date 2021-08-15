<?php

    namespace Http;

    class Request {

        private static $_instance;
        private        $_di;
        private        $_method;
        private        $_service;
        private        $_endpoint;
        private        $_version;
        private        $_params;
        private        $_format;
        private        $_url          = "";
        private        $_responseTime = 0;
        private        $_header;

        private function __construct($method) {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->_method = strtoupper($method);
            $this->reset();
        }

        public static function create($method = 'GET') {
            //if (!isset(self::$_instance)) {
            self::$_instance = new self($method);

            //}

            return self::$_instance;
        }

        public function reset() {

            $this->_version = 'latest';

            return $this;
        }

        public function from($service, $endpoint) {

            $this->_service = $service;
            $this->_endpoint = $endpoint;

            return $this;
        }

        public function version($version) {

            $this->_version = $version;

            return $this;
        }

        public function params($params, $format = 'json') {

            $this->_params = $params;
            $this->_format = $format;

            return $this;
        }

        public function header($params) {

            $this->_header = $params;

            return $this;
        }

        public function getResponseTime() {

            return $this->_responseTime;
        }

        public function getUrl() {

            return $this->_url;
        }

        public function getService() {

            return $this->_service;
        }

        public function getEndpoint() {

            return $this->_endpoint;
        }

        public function send() {

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

            switch ($this->_method) {
                case 'POST':
                    $postdata = array();
                    if (is_array($this->_params) || is_object($this->_params)) {

                        if ($this->_format == 'json') {
                            $postdata = json_encode($this->_params);
                        } elseif ($this->_format == 'params') {
                            $postdata = $this->_params;
                        }

                    } elseif (is_object(json_decode($this->_params))) {
                        $postdata = $this->_params;
                    }

                    curl_setopt($ch, CURLOPT_POST, 1);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);

                    break;
                case 'GET':
                    if (isset($this->_params) && is_array($this->_params)) {
                        $endpointAr = parse_url($this->_endpoint);
                        $query = http_build_query($this->_params);
                        if (isset($endpointAr['query'])) {
                            $query .= "&" . $endpointAr['query'];
                        }
                        $this->_endpoint = $endpointAr['path'] . "?" . $query;
                    }
            }

            if (isset($this->_header)) {
                $header = array('Authorization: Bearer ' . $this->_header);
                curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
            }

            $env = $this->_di['config']['env'];

            if (!isset($this->_di['config']['services'][$this->_service])) {
                throw new \Exception("Service " . $this->_service . " not found.");
            }

            $service = $this->_di['config']['services'][$this->_service][$env];
            //$this->_url = (isset($service['ssl']) && $service['ssl'] ? 'https' : 'http') . '://' . $service['url'] . (isset($service['port']) ? ':' . $service['port'] : '') . '/' . $this->_version . $this->_endpoint;
            $this->_url = $this->generateUrl();
            if (isset($service['ssl'])) {
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            }

            curl_setopt($ch, CURLOPT_URL, $this->_url);
            $start = microtime(true);

            $output = curl_exec($ch);

            $this->_responseTime = microtime(true) - $start;
            curl_close($ch);

            \Debug\Profile\Request::add($this);

            return new Response($output, $this->_responseTime);
        }

        public function generateUrl() {

            $env = $this->_di['config']['env'];

            if (!isset($this->_di['config']['services'][$this->_service])) {
                throw new \Exception("Service " . $this->_service . " not found.");
            }

            $service = $this->_di['config']['services'][$this->_service][$env];

            return (isset($service['ssl']) && $service['ssl'] ? 'https' : 'http') . '://' . $service['url'] . (isset($service['port']) ? ':' . $service['port'] : '') . (isset($this->_version) ? '/' . $this->_version : '') . (isset($this->_endpoint) ? (substr($this->_endpoint, 0, 1) == '/' ? '' : '/') . $this->_endpoint : '');
        }

        public static function sendRawRequest($url, $method = 'GET', $data = array()) {

            $postdata = array();
            if (is_array($data) || is_object($data)) {
                $postdata = json_encode($data);
            } elseif (is_object(json_decode($data))) {
                $postdata = $data;
            } else {
                throw new \Exception("Wrong data.");
            }


            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

            switch (strtolower($method)) {
                case 'get':
                    break;
                case 'post':
                    curl_setopt($ch, CURLOPT_POST, 1);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
                    break;
                default:
                    throw new Exception("Wrong method specified: " . $method);
                    break;
            }

            $output = curl_exec($ch);
            curl_close($ch);

            return new Response($output);


            /*
              // handle error; error output
              if (curl_getinfo($ch, CURLINFO_HTTP_CODE) !== 200) {

              var_dump($output);
              }
             *
             */
        }

    }