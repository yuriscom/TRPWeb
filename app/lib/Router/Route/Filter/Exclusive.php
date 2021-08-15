<?php

    namespace Router\Route\Filter;

    class Exclusive extends Filter {

        public function match($path, \Router\Route\Route $route, \Router\Router $router) {

            $pathAr = explode("/", trim($path, "/"));

            $params = array();
            switch (count($pathAr)) {
                case 2:
                    $propertyAr = explode("-", $pathAr[1]);

                    if (!is_numeric(end($propertyAr))) {
                        return false;
                    }

                    $params['controller'] = 'exclusive';
                    $params['action'] = 'index';
                    $params['id'] = end($propertyAr);
                    $params['type'] = $pathAr[0];
                    $params['seoName'] = 'exclusive';
                    break;
                default:
                    return false;
                    break;
            }

            $route->setPathParams($params);

            return $route;
        }

        public function assemble(array $params) {

            $pattern = "/{type}(/{project}-{address}-{hood}-{city}-{postal}-{id}|/{address}-{hood}-{city}-{postal}-{id}|/{address}-{city}-{postal}-{id})";
            $url = "";
            try {
                $url = $this->assembleByPattern($pattern, $params);

            } catch (\Exception $e) {

            }

            return $url;
        }

        public function genUrls() {

            $urls = array();

            // exclusive urls get directly from api
            $modelName = "\\Model\\ExclusiveListing";

            $params = array("format" => "standard");
            $res = $modelName::getAll($params);
            $listings = $res['listings'];

            if (!$listings) {
                return array();
            }

            foreach ($listings as $listing) {
                $urls[] = $this->genUrl($listing['url']);
            }

            return $urls;
        }

        public function genImagesUrls() {

            $urls = array();

            // exclusive urls get directly from api
            $modelName = "\\Model\\ExclusiveListing";

            $params = array("format" => "standard");
            $res = $modelName::getAll($params);
            $listings = $res['listings'];

            if (!$listings) {
                return array();
            }

            foreach ($listings as $listing) {
                $address = $listing["City"]["name"].", Canada";
                if(count($listing["images"])){
                    $resource["page"] = $this->genUrl($listing["url"]);
                    $resource["images"] = array();
                    foreach($listing["images"] as $image) {
                        $image = array(
                            "loc" => preg_replace('/main-original/', 'main-large', $image["path"]),
                            "title" => $image["alt_tag"],
                            "caption" => $image["alt_tag"],
                            "geo_location" => $address
                        );
                        array_push($resource["images"], $image);
                    }
                    $urls[] = $resource;
                }
            }

            return $urls;
        }

    }
