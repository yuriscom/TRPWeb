<?php

    namespace Model;

    class Province {

        public static function getByWebId($webid) {

            return Location::getByWebId("province", $webid);
        }

        public static function search(array $params = array()) {

            $defaultParams = array("response" => "simple",
                                   "format" => "standard");

            foreach ($defaultParams as $key => $val) {
                if (!isset($params[$key])) {
                    $params[$key] = $val;
                }
            }

            $res = \Http\Request::create()->from('app', '/provinces')->params($params)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }
    }
