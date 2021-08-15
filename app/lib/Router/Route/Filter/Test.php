<?php

    namespace Router\Route\Filter;

    class Test extends Filter {

        public function match($path, \Router\Route\Route $route, \Router\Router $router) {

            if ($path == "/hello1") {
                $route->setPathParams(array("controller" => "content",
                                            "action" => "index",
                                            'content-include' => 'privacy'));

                return $route;
            }

            return false;
        }

        public function assemble(array $params) {

        }

        public function genUrls() {

        }

    }

