<?php

    namespace Router;

    class Router extends \Phalcon\Mvc\Router {

        public function addCustom(\Router\Route\Filter\Filter $filter, $pattern = null) {

            if (!$pattern) {
                $pattern = "(/.*)*";
            }

            $route = new Route\Route($pattern);
            $route->filter($filter);
            $this->_routes[] = $route;

            return $route;
        }

        public function assemble($name, $params) {

            $route = $this->getRouteByName($name);
            if (!$route) {
                return "/";
            }

            return $route->assemble($params);
        }

    }
