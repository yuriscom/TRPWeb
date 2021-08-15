<?php

    namespace Model;

    class Builder {

        public static function getByWebId($webid) {

            $res = \Http\Request::create('GET')->from('app', "/builders/" . $webid)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

        public static function search(array $params = array()) {

            $defaultParams = array("response" => "simple",
                                   "format" => "standard");

            foreach ($defaultParams as $key => $val) {
                if (!isset($params[$key])) {
                    $params[$key] = $val;
                }
            }

            $res = \Http\Request::create()->from('app', '/builders')->params($params)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }
    }