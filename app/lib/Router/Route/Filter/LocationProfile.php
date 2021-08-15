<?php

    namespace Router\Route\Filter;

    class LocationProfile extends Filter {

        public function match($path, \Router\Route\Route $route, \Router\Router $router) {

            $nationalReg = "/^canadian-real-estate$/";
            $provincialReg = "/([a-z-]*)-real-estate$/";
            $cityReg = "/([a-z-]*)-(.*)/";

            $pathAr = explode("/", trim($path, "/"));
            $params = array('controller' => 'location',
                            'action' => 'national',
                            'seoName' => 'location');

            if (count($pathAr) == 1) {
                if (preg_match($nationalReg, $pathAr[0])) {
                    $params['action'] = 'national';
                    $params['slug'] = '';
                } else if (preg_match($provincialReg, $pathAr[0], $m)) {
                    $params['action'] = 'index';
                    $params['slug'] = $m[1];
                } else {
                    $params['action'] = 'city';
                    $city = explode("-", $pathAr[0]);
                    $params['province'] = $city[0];
                    array_shift($city);
                    $params['slug'] = implode('-', $city);
                }
            } else {
                if (preg_match($provincialReg, $pathAr[0])) {
                    $params['action'] = 'region';
                    $params['slug'] = $pathAr[1];
                } else {
                    $params['action'] = 'hood';
                    $city = explode("-", $pathAr[0]);
                    $province = $city[0];
                    array_shift($city);
                    $params['city'] = implode('-', $city);
                    $params['slug'] = $pathAr[1];

                    foreach ($this->_mappingAr as $mCity => $hoods) {
                        if ($mCity == $params['city'] && in_array($pathAr[1], $hoods)) {
                            $params['action'] = 'hood';
                            $params['province'] = $province;
                            $params['city'];
                            $redirectUrl = $this->assemble($params);
                            header("Location: " . $redirectUrl . "/", true, 301);
                            exit;

                        }
                    }
                }
            }

            $route->setPathParams($params);

            return $route;
        }

        public function assemble(array $params) {

            $pattern = "/{province}-(real-estate/{region}|{city}/{hood}|{city}|real-estate)";
            $url = "";
            try {
                $url = $this->assembleByPattern($pattern, $params);
            } catch (\Exception $e) {

            }

            return $url;
        }

        public function genUrls() {

            $urls = array();
            $res = \Model\Province::search(array("nested" => 1));
            foreach ($res as $province) {
                $urls[] = $this->genUrl($this->assemble(array("province" => $province['web_id'])));
                foreach ($province['Region'] as $region) {
                    $urls[] = $this->genUrl($this->assemble(array("province" => $province['web_id'],
                                                                  "region" => $region['web_id'])));
                    foreach ($region['City'] as $city) {
                        $urls[] = $this->genUrl($this->assemble(array("province" => $province['web_id'],
                                                                      "city" => $city['web_id'])));
                        foreach ($city['Hood'] as $hood) {
                            $urls[] = $this->genUrl($this->assemble(array("province" => $province['web_id'],
                                                                          "city" => $city['web_id'],
                                                                          "hood" => $hood['web_id'])));
                        }
                    }
                }
            }

            return $urls;
        }

        public function genImagesUrls() {

            $urls = array();
            $res = \Model\Province::search(array("nested" => 1));

            foreach ($res as $province) {
                $resource = array();
                $location = \Model\Province::getByWebId($province["web_id"]);
                $address = $location["name"].", Canada";
                if(count($location["images"])){
                    $resource["page"] = $location["url"];
                    $resource["images"] = array();
                    foreach($location["images"] as $image){
                        array_push($resource["images"], $this->_genImageUrl($image, $address));
                    }
                    $urls[] = $resource;
                }
                foreach ($province['Region'] as $region) {
                    $resource = array();
                    $location = \Model\Region::getByWebId($region["web_id"]);
                    $address = $location["name"].", Canada";

                    if(count($location["images"])) {
                        $resource["page"] = $location["url"];
                        $resource["images"] = array();
                        foreach ($location["images"] as $image) {
                            array_push($resource["images"], $this->_genImageUrl($image, $address));
                        }
                        $urls[] = $resource;
                    }
                    foreach ($region['City'] as $city) {
                        $resource = array();
                        $location = \Model\City::getByWebId($city["web_id"]);
                        $address = $location["name"].", Canada";

                        if(count($location["images"])) {
                            $resource["page"] = $location["url"];
                            $resource["images"] = array();
                            foreach ($location["images"] as $image) {
                                array_push($resource["images"], $this->_genImageUrl($image, $address));
                            }
                            $urls[] = $resource;
                        }
                        foreach ($city['Hood'] as $hood) {
                            $resource = array();
                            $location = \Model\Hood::getByWebId($hood["web_id"]);
                            $address = $location["city"].", Canada";

                            if(count($location["images"])) {
                                $resource["page"] = $location["url"];
                                $resource["images"] = array();
                                foreach ($location["images"] as $image) {
                                    array_push($resource["images"], $this->_genImageUrl($image, $address));
                                }
                                $urls[] = $resource;
                            }
                        }
                    }
                }
            }

            return $urls;
        }

        private function _genImageUrl($image, $address) {
            return $image = array(
                "loc" => preg_replace('/main-original/', 'main-large', $image["path"]),
                "title" => $image["alt_tag"],
                "caption" => $image["alt_tag"],
                "geo_location" => $address
            );
        }

    }
