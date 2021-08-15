<?php

    namespace Model;

    class City {

        public static function getByWebId($webid) {

            return Location::getByWebId("city", $webid);
        }

        public static function getById($id) {

            return Location::getById("city", $id);
        }

        public static function search(array $params = array()) {

            $defaultParams = array("format" => "standard");

            foreach ($defaultParams as $key => $val) {
                if (!isset($params[$key])) {
                    $params[$key] = $val;
                }
            }

            $res = \Http\Request::create()->from('app', '/cities')->params($params)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }
    }