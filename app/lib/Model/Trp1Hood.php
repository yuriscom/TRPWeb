<?php

    namespace Model;

    class Trp1Hood {

        public static function getByWebId($webid) {

            return Location::getByWebId("trp1hood", $webid);
        }
    }