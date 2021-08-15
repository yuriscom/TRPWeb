<?php

    namespace Router\Route;

    class RouteHelper {

        public static function unnumerize($value) {

            return "{" . $value . "}";
        }

        public static function numerize($value) {

            return trim($value, "{}");
        }

    }
