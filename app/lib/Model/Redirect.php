<?php

    namespace Model;

    class Redirect {

        public static function getByUrl($url) {

            $res = \Http\Request::create('GET')->from('app', "/redirects/" . $url)->send();

            if ($res->isOk()) {
                return $res->getResult();
            } else {
                throw new \Exception\Fatal($res->getCode() . ": " . $res->getMessage());
            }
        }

    }
