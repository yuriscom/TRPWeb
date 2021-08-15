<?php

    namespace Router\Route\Filter;

    class Unsitemap extends Filter {

        protected function match($path, \Router\Route\Route $route, \Router\Router $router) {

            $pathAr = explode("-", $path);

            $params['controller'] = "unsitemap";
            $params['action'] = "index";

            if (isset($pathAr[1])) {
                $params['sitemap'] = $pathAr[1];
                $params['page'] = (isset($pathAr[2]) ? $pathAr[2] : 1);
            }

            $route->setPathParams($params);

            return $route;
        }

        public function assemble(array $params) {

        }

        public function genUrls() {

        }

    }
