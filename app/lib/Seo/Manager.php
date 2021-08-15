<?php

    namespace Seo;

    class Manager {

        private static $_instance;
        private        $seo;

        private function __construct() {

            $this->seo = array();
            $csv = array_map('str_getcsv', file(ROOT_PATH . '/app/data/seo/seo.csv'));
            $titles = array_shift($csv);
            $nameIdx = array_search("Name", $titles);
            if ($nameIdx === false) {
                return;
            }

            foreach ($csv as $elAr) {
                $name = $elAr[$nameIdx];
                foreach ($titles as $key => $title) {
                    $this->seo[$name][strtolower($title)] = utf8_encode($elAr[$key]);
                }
            }
        }

        public static function getInstance() {

            if (!self::$_instance) {
                self::$_instance = new self();
            }

            return self::$_instance;
        }

        public function getAll() {

            return $this->seo;
        }

        public function get($name) {

            if (isset($this->seo[$name])) {
                return $this->seo[$name];
            }

            return array();
        }

        public function parse($seoName, array $params) {

            $seoParams = array();

            $seoTemplates = $this->get($seoName);

            if (!count($seoTemplates)) {
                return $seoParams;
            }

            foreach ($seoTemplates as $key => $template) {
                $seoParams[$key] = $this->parseTemplate($template, $params);
            }

            return $seoParams;
        }

        private function parseTemplate($template, $params) {

            if (preg_match_all("/{\\\$([^}]+)}/", $template, $m)) {
                $vars = array_unique($m[1]);
                foreach ($vars as $var) {
                    $val = "";
                    if (array_key_exists($var, $params)) {
                        $val = $params[$var];
                    }
                    $template = str_replace("{\$" . $var . "}", $val, $template);
                }
            }
            $template = trim(preg_replace("/\s+/", " ", $template)); // remove multiple space left from non-existing vars
            $template = trim(preg_replace("/\s,\s/", " ", $template)); // remove orphaned commas
            return $template;
        }

    }
