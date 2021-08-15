<?php

    namespace View;

    class Helper extends \Phalcon\Tag {

        static public function formatVal($val, $units) {

            if ($units === 'Feet') {
                $rawFeet = $val;
                $wholeFeet = floor($rawFeet);
                $decimalFeet = $rawFeet - $wholeFeet;
                $inches = round($decimalFeet * 12);

                return $wholeFeet . "' " . $inches . "''";
            } else {
                $rawMetres = $val;
                $metres = round($rawMetres, 2);

                return $metres . "m";
            }
        }

        static public function convertAndFormatVal($val, $fromUnits, $toUnits) {

            if ($fromUnits !== 'Feet' && $toUnits === 'Feet') {
                $rawFeet = $val * 3.280;

                return Helper::formatVal($rawFeet, 'Feet');
            } else if ($fromUnits === 'Feet' && $toUnits !== 'Feet') {
                $rawMetres = $val / 3.280;

                return Helper::formatVal($rawMetres, 'Metres');
            } else {
                return Helper::formatVal($val, $toUnits);
            }
        }

        static public function url($params) {

            $link = parent::linkTo($params);
            if (preg_match("/href=\"([^\"]*)\"/", $link, $m)) {
                return $m[1];
            }

            return "";
        }

        static public function slashes($str) {

            return str_replace("'", "&#39;", $str);
        }

        static public function highlightOpenHouse($param) {

            return preg_replace("/\\b(open\\s?-?house)\\b/i", "<strong>$1</strong>", $param);
        }

        static public function limitValue($param) {

            preg_match('/(.+)-/', $param, $changed);
            if ($changed) {
                $changed = $changed[1] . '+';

                return $changed;
            } else {
                return $param;
            }
        }

        static public function approximatePrice($param, $type) {

            if (!isset($param) || $param === 0) {
                return '0';
            }
            $suffix = 'K';
            $param = $param * 1;
            if ($type == 'max') {
                if ($param > 999000) {
                    $suffix = 'M';
                    //within 10000: 1309999 --> 1.3M, 1310000 --> 1.4M
                    $param = floor($param / 10000);
                    $param = ceil($param / 10) / 10;
                } else {
                    $param = ceil($param / 1000);
                }
            } else {
                if ($param >= 1000000) {
                    $suffix = 'M';
                    //within 10000: 1290000 --> 1.2M, 1290001 --> 1.3M
                    $param = ceil($param / 10000);
                    $param = floor($param / 10) / 10;
                } else {
                    $param = floor($param / 1000);
                }
            }

            return $param . $suffix;
        }

        static public function getDistance($latFrom, $lngFrom, $latTo, $lngTo) {

            $miles = \Locational\Geometry::vincentyGreatCircleDistance($latFrom, $lngFrom, $latTo, $lngTo);
            $km = number_format($miles * 0.62137, 2, '.', '');

            return $km;
        }

        static public function ensureURLProtocol($url) {

            $url = trim($url);
            if (parse_url($url, PHP_URL_SCHEME) == '') {
                if (substr($url, 0, 2) === '//') {
                    $url = 'http:' . $url;
                } else {
                    $url = preg_replace('#^\w+://#', '', $url);
                    $url = 'http://' . $url;
                }
            }

            return $url;
        }
    }