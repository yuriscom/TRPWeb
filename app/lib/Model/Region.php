<?php

    namespace Model;

    class Region {

        public static function getByWebId($webid) {

            return Location::getByWebId("region", $webid);
        }

        public static function getById($id) {

            return Location::getById("region", $id);
        }
    }