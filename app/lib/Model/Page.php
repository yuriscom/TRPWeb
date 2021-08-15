<?php

    namespace Model;

    class Page {

        public static function search(array $params = array()) {

            $defaultParams = array("format" => "standard");

            foreach ($defaultParams as $key => $val) {
                if (!isset($params[$key])) {
                    $params[$key] = $val;
                }
            }

            $res = \Http\Request::create()->from('app', '/pages')->params($params)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }
    }