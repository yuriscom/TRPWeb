<?php

    namespace Router\Route\Filter;

    class ImageSitemap extends Filter {

        protected function match($path, \Router\Route\Route $route, \Router\Router $router) {

            $pathAr = explode("-", $path);

            $params['controller'] = "image-sitemap";
            $params['action'] = "index";

            if (isset($pathAr[2])) {
                $params['sitemap'] = preg_replace("/Image/", "" ,$pathAr[2]);
                $params['page'] = (isset($pathAr[3]) ? $pathAr[3] : 1);
            }

            $route->setPathParams($params);

            return $route;
        }

        public function assemble(array $params) {

        }

        public function genUrls() {

        }

    }
