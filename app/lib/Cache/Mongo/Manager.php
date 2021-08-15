<?php

    namespace Cache\Mongo;

    class Manager {

        private static $instance;
        private        $config;
        private        $client;
        private        $db;

        private function __construct() {

            $this->config = \Phalcon\DI\FactoryDefault::getDefault()->get("config")['mongodb'];
            $this->init();
        }

        public static function getInstance() {
            if (!self::$instance) {
                self::$instance = new self();
            }

            if (!(self::$instance->client && self::$instance->db)) {
                self::$instance->init();
            }

            return self::$instance;
        }

        private function init() {

            $config = $this->config;
            p("here"); die;
            $this->client = new \MongoClient("mongodb://" . $config['host'] . ":" . $config['port']); // connect
            $this->db = new \MongoDB($this->client, $config['database']);
        }

        public function getDb() {

            return $this->db;
        }

        public function getClient() {

            return $this->client;
        }

        public function close() {

            $connections = $this->client->getConnections();
            foreach ($connections as $con) {
                $this->client->close($con['hash']);
            }
            $this->client = null;
            $this->db = null;
        }

    }
