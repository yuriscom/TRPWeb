<?php

    class GenerateUrlsTask extends \Phalcon\CLI\Task {

        public function mainAction($args = null) {

            $router = require APPLICATION_PATH . "/app/config/routes.php";
            $this->_run($router->getRoutes());
        }

        public function runAction(array $params = array()) {

            $router = require APPLICATION_PATH . "/app/config/routes.php";
            $routes = array();
            foreach ($params as $param) {
                $route = $router->getRouteByName($param);
                if ($route) {
                    $routes[] = $route;
                }
            }
            $this->_run($routes);
        }

        private function _run(array $routes) {

            foreach ($routes as $route) {
                if ($route instanceof \Router\Route\Route) {
                    echo "generating for: " . $route->getName() . "...";
                    $route->genUrls(true);
                    echo "Done.\n";
                }
            }
        }

    }
