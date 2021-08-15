<?php

    namespace Seo\Parser;

    class Factory {

        private function __construct() {

        }

        public static function getParser(\Phalcon\Mvc\Controller $controller) {

            $controllerName = get_class($controller);
            $parserName = __NAMESPACE__ . "\\" . str_replace("Controller", "", $controllerName);
            if (stream_resolve_include_path(get_autoload_file($parserName))) {
                $parser = new $parserName($controller);
            } else {
                $parser = new Standard($controller);
            }

            return $parser;
        }

    }
