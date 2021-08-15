<?php

    namespace Model;

    class Trp1City {

        public static function getByWebId($webid) {

            return Location::getByWebId("trp1city", $webid);
        }
    }