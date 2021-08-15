<?php

    namespace Router\Route\Filter;

    class Project extends Filter {

        public function match($path, \Router\Route\Route $route, \Router\Router $router) {

            $pathAr = explode("/", trim($path, "/"));
            if (count($pathAr) && $pathAr[0] == "new-preconstruction") { // actually this is reduntant because the regex is already passed in the router
                $params = array();

                switch (count($pathAr)) {
                    case 1:
                        // project-hybrid
                        $params['controller'] = 'listview';
                        $params['action'] = 'listProjects';
                        $params['seoName'] = 'project-listview';
                        break;
                    case 2:
                        if ($pathAr[1] === 'map') {
                            $params['controller'] = 'hybrid';
                            $params['layer'] = 'projects';
                            $params['action'] = 'index';
                            $params['seoName'] = 'project-hybrid';

                        } elseif (preg_match('/^page-(\d+)$/', $pathAr[1], $m) > 0) {

                            if (count($m) > 1) {
                                $params['controller'] = 'listview';
                                $params['layer'] = 'projects';
                                $params['action'] = 'listProjects';
                                $params['seoName'] = 'project-listview';
                                $params['page'] = $m[1];
                            } else {
                                return false;
                            }
                        } else {
                            // project-hybrid with builder param
                            $params['controller'] = 'listview';
                            $params['action'] = 'listProjects';
                            $params['builder'] = $pathAr[1];
                            $params['seoName'] = 'project-hybrid-builder';
                        }
                        break;

                    case 3:

                        if ($pathAr[1] === 'map') {
                            $params['controller'] = 'hybrid';
                            $params['layer'] = 'projects';
                            $params['action'] = 'index';
                            $params['seoName'] = 'project-hybrid';
                            if (preg_match('/^page-(\d+)$/', $pathAr[2], $m) > 0) {
                                if (count($m) > 1) {
                                    $params['page'] = $m[1];
                                } else {
                                    return false;
                                }
                            } else {
                                return false;
                            }
                        } else {
                            if ($pathAr[2] === 'map') {
                                //map with builder filter
                                $params['controller'] = 'hybrid';
                                $params['layer'] = 'projects';
                                $params['action'] = 'index';
                                $params['seoName'] = 'project-hybrid-builder';
                                $params['builder'] = $pathAr[1];

                            } elseif (preg_match('/^page-(\d+)$/', $pathAr[2], $m) > 0) {
                                //assume it's a builder
                                $params['controller'] = 'listview';
                                $params['action'] = 'listProjects';
                                $params['builder'] = $pathAr[1];
                                $params['seoName'] = 'project-listview-builder';
                                if (count($m) > 0) {
                                    $params['page'] = $m[1];
                                } else {
                                    return false;
                                }
                            } else {
                                // it's a profile
                                $params['seoName'] = "project";
                                $params['vipPresaleRegistration'] = 0;
                                if (isset($pathAr[3])) {
                                    if ($pathAr[3] != 'vip-presale-registration') {
                                        return false;
                                    }

                                    $params['vipPresaleRegistration'] = 1;
                                    $params['seoName'] = "project-vip";
                                }

                                // project profile
                                $projectAr = preg_split("/-in-/", $pathAr[2]);
                                switch (count($projectAr)) {
                                    case 2:
                                        $projectName = $projectAr[0];
                                        $hoodCity = $projectAr[1];
                                        break;
                                    case 3:
                                        // seems like "-in-" is inside the project name, get it back
                                        $projectName = $projectAr[0] . '-in-' . $projectAr[1];
                                        $hoodCity = $projectAr[2];
                                        break;
                                    default:
                                        return false;
                                        break;
                                }

                                $params['controller'] = 'project';
                                $params['action'] = 'index';
                                $params['builder'] = $pathAr[1];
                                $params['name'] = $projectName;
                                $params['hoodCity'] = $hoodCity;
                            }

                        }
                        break;
                    case 4:
                        if ($pathAr[2] === 'map') {
                            //map with builder filter
                            $params['controller'] = 'hybrid';
                            $params['layer'] = 'projects';
                            $params['action'] = 'index';
                            $params['seoName'] = 'project-hybrid-builder';
                            $params['builder'] = $pathAr[1];

                            if (preg_match('/^page-(\d+)$/', $pathAr[3], $m) > 0) {
                                if (count($m) > 0) {
                                    $params['page'] = $m[1];
                                } else {
                                    return false;
                                }
                            }
                        } else {
                            $params['seoName'] = "project";
                            $params['vipPresaleRegistration'] = 0;
                            if (isset($pathAr[3])) {
                                if ($pathAr[3] != 'vip-presale-registration') {
                                    return false;
                                }

                                $params['vipPresaleRegistration'] = 1;
                                $params['seoName'] = "project-vip";
                            }

                            // project profile
                            $projectAr = preg_split("/-in-/", $pathAr[2]);
                            switch (count($projectAr)) {
                                case 2:
                                    $projectName = $projectAr[0];
                                    $hoodCity = $projectAr[1];
                                    break;
                                case 3:
                                    // seems like "-in-" is inside the project name, get it back
                                    $projectName = $projectAr[0] . '-in-' . $projectAr[1];
                                    $hoodCity = $projectAr[2];
                                    break;
                                default:
                                    return false;
                                    break;
                            }

                            $params['controller'] = 'project';
                            $params['action'] = 'index';
                            $params['builder'] = $pathAr[1];
                            $params['name'] = $projectName;
                            $params['hoodCity'] = $hoodCity;
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

            $pattern = "/new-preconstruction(/{builder}/{name}-in-{hood}-{city}|/{builder}/{name}-in-{city}|/{builder})";
            $url = "";
            try {
                $url = $this->assembleByPattern($pattern, $params);
            } catch (\Exception $e) {

            }

            return $url;
        }

        public function genUrls() {

            $urls = array();

            // builders
            $res = \Model\Builder::search();
            foreach ($res as $builder) {
                $urls[] = $this->genUrl($this->assemble(array("builder" => $builder['web_id'])));
            }

            // project urls get directly from api
            $chunkSize = 1000;
            $modelName = "\\Model\\Project";

            $params = array("response" => "count");
            $count = $modelName::search($params)['totalCount'];

            if (!$count) {
                return array();
            }

            $listings = array();

            $params = array("response" => "autocomplete",
                            "num" => $chunkSize,
                            "page" => 1);
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
                                    "page" => $i);
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
            $modelName = "\\Model\\Project";

            $params = array("response" => "count");
            $count = $modelName::search($params)['totalCount'];

            if (!$count) {
                return array();
            }

            $listings = array();

            $params = array("response" => "autocomplete",
                            "num" => $chunkSize,
                            "page" => 1);
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
                                    "page" => $i);
                    $res = $modelName::search($params);
                    $listings = array_merge($listings, $res['listings']);
                }
            }

            $resource = [];
            foreach ($listings as $shortListing) {
                $listing = $modelName::getById($shortListing["id"]);
                $address = $listing["MainCity"]["name"].", Canada";
                $resource["page"] = $this->genUrl($listing["url"]);
                $resource["images"] = array();

                if($listing["logo"]) {
                    if (count($listing["logo"])) {
                        array_push($resource["images"], $this->_genImageUrl($listing["logo"][0], $address));
                    }
                }

                foreach($listing["images"] as $image) {
                    array_push($resource["images"], $this->_genImageUrl($image, $address));
                }

                if (count($listing["PreconUnits"])) {
                    foreach($listing["PreconUnits"] as $unit) {
                        if (count($unit["images"])) {
                           foreach($unit["images"] as $image) {
                               array_push($resource["images"], $this->_genImageUrl($image, $address));
                           }
                        }
                    }
                }

                if (count($listing["PreconPreconAmenities"])) {
                    foreach($listing["PreconPreconAmenities"] as $amenity) {
                        if (count($amenity["PreconAmenity"]["images"])) {
                            foreach($amenity["PreconAmenity"]["images"] as $image) {
                                array_push($resource["images"], $this->_genImageUrl($image, $address));
                            }
                        }
                    }
                }

                $urls[] = $resource;
            }

            return $urls;
        }

        private function _genImageUrl($image, $address) {
            return $image = array(
                "loc" => preg_replace('/\-original/', '-large', $image["path"]),
                "title" => $image["alt_tag"],
                "caption" => $image["alt_tag"],
                "geo_location" => $address
            );
        }

    }
