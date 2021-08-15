<?php

    namespace Router\Route\Filter;

    class Property extends Filter {

        public function match($path, \Router\Route\Route $route, \Router\Router $router) {

            $pathAr = explode("/", trim($path, "/"));
            if (count($pathAr) && $pathAr[0] == "mls-listings") { // actually this is reduntant because the regex is already passed in the router
                $params = array();
                switch (count($pathAr)) {
                    case 1:
                        // property-hybrid
                        $params['controller'] = 'listview';
                        $params['action'] = 'listProperties';
                        $params['seoName'] = 'property-listview';
                        break;
                    case 2:
                        if ($pathAr[1] === 'map') {
                            $params['controller'] = 'hybrid';
                            $params['layer'] = 'properties';
                            $params['action'] = 'index';
                            $params['seoName'] = 'property-hybrid';

                        } else if (preg_match('/^page-(\d+)$/', $pathAr[1], $m) > 0) {
                            if (count($m) > 0) {
                                $params['controller'] = 'listview';
                                $params['layer'] = 'properties';
                                $params['action'] = 'listProperties';
                                $params['seoName'] = 'property-listview';
                                $params['page'] = $m[1];

                            } else {
                                return false;
                            }
                        } else {
                            // property profile
                            $propertyAr = preg_split("/-mls-/", $pathAr[1]);

                            if (count($propertyAr) != 2) {
                                return false;
                            }
                            $params['controller'] = 'property';
                            $params['action'] = 'index';
                            $params['mls'] = $propertyAr[1];
                            $params['addrHoodCityPostal'] = $propertyAr[0];
                            $params['seoName'] = 'property';
                        }
                        break;
                    case 3:

                        if ($pathAr[1] === 'map') {
                            $params['controller'] = 'hybrid';
                            $params['layer'] = 'properties';
                            $params['action'] = 'index';
                            $params['seoName'] = 'property-hybrid';

                            preg_match('/^page-(\d+)$/', $pathAr[2], $m);

                            if (count($m) > 0) {
                                $params['page'] = $m[1];
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                        break;
                    default:
                        return false;
                        break;
                }

                $route->setPathParams($params);

                return $route;
            }

            return false;
        }

        public function assemble(array $params) {

            $pattern = "/mls-listings(/{address}-{hood}-{city}-{postal}-mls-{mls}|/{address}-{city}-{postal}-mls-{mls})";
            $url = "";
            try {
                $url = $this->assembleByPattern($pattern, $params);

            } catch (\Exception $e) {

            }

            return $url;
        }

        public function genUrls() {

            $urls = array();

            // just for /mls-listings
            $urls[] = $this->assemble(array());

            // project urls get directly from api
            $chunkSize = 1000;
            $modelName = "\\Model\\Property";

            $params = array("response" => "count",
                            "is_public" => 1);
            $count = $modelName::search($params)['totalCount'];

            if (!$count) {
                return array();
            }

            $listings = array();

            $params = array("response" => "autocomplete",
                            "num" => $chunkSize,
                            "page" => 1,
                            "is_public" => 1);
            $res = $modelName::search($params);
            $listings = array_merge($listings, $res['listings']);
            if ($count > $chunkSize) {
                $i = 1;
                while (true) {
                    $count -= $chunkSize;
                    if ($count <= 0) {
                        break;
                    }
                    $i++;
                    $params = array("response" => "autocomplete",
                                    "num" => $chunkSize,
                                    "page" => $i,
                                    "is_public" => 1);
                    $res = $modelName::search($params);
                    $listings = array_merge($listings, $res['listings']);
                }
            }

            foreach ($listings as $listing) {
                $urls[] = $this->genUrl($listing['url']);
            }

            return $urls;
        }

        public function genImagesUrls() {

            $urls = array();

            // project urls get directly from api
            $chunkSize = 1000;
            $modelName = "\\Model\\Property";

            $params = array("response" => "count",
                            "is_public" => 1);
            $count = $modelName::search($params)['totalCount'];

            if (!$count) {
                return array();
            }

            $listings = array();

            $params = array("response" => "autocomplete",
                            "num" => $chunkSize,
                            "page" => 1,
                            "is_public" => 1); //TODO: add images condition
            $res = $modelName::search($params);
            $listings = array_merge($listings, $res['listings']);

            if ($count > $chunkSize) {
                $i = 1;
                while (true) {
                    $count -= $chunkSize;
                    if ($count <= 0) {
                        break;
                    }
                    $i++;
                    $params = array("response" => "autocomplete",
                                    "num" => $chunkSize,
                                    "page" => $i,
                                    "is_public" => 1);
                    $res = $modelName::search($params);
                    $listings = array_merge($listings, $res['listings']);
                }
            }

            $resource = [];
            foreach ($listings as $shortListing) {
                $listing = $modelName::getById($shortListing["id"]);
                $address =  $listing["MainCity"]["name"].", Canada";
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
