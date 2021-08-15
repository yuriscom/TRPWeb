<?php

    namespace Router\Route\Filter;

    class ProjectHybridProvince extends Filter {

        private $filterPatternsAr = array("beds" => "/^((?:[1-9]\d*)|(?:studio))-(plus-)?bedroom(s?)$/",
                                          "price_under" => "/^under-([\d]+)$/",
                                          "price_over" => "/^over-([\d]+)$/",
                                          "priced_between" => "/^priced-between-([\d]+)-([\d]+)$/",
                                          "with_amenity" => "/^with-((?:pool)|(?:concierge)|(?:gym))$/",
                                          "occupancy" => "/^move-in-([\d]+)$/",
                                          "builder" => "/^by-([A-Za-z0-9\-\_]+)$/"
        );
        private $seoName          = null;

        public function match($path, \Router\Route\Route $route, \Router\Router $router) {

            $pathAr = explode("/", trim($path, "/"));

            $params = array('controller' => 'listview',
                            'action' => 'listProjects',);

            preg_match("/^(.*)-real-estate$/", $pathAr[0], $m1);
            if (!isset($m1[1])) {
                $location = explode("-", $pathAr[0]);
                $params['province'] = $location[0];
                array_shift($location);
                $params['city'] = implode('-', $location);
                $params['area'] = 'city';
                $this->seoName =  "project-listview-city-hood";
            } else {
                $params['province'] = $m1[1];
                $params['area'] = 'province';
                $this->seoName = "project-listview-area";
            }

            $params['seoName'] = $this->seoName;

            switch (count($pathAr)) {
                case 2:
                    break;
                case 3:

                    if ($pathAr[2] !== 'map' && preg_match('/^page-(\d+)$/', $pathAr[2], $m) == 0 && !is_array($this->_parseFilter($pathAr[2]))) {
                        return false;
                    }

                    if ($pathAr[2] === 'map') {
                        $params['controller'] = 'hybrid';
                        $params['action'] = 'index';
                        $params['layer'] = 'projects';
                        $params['seoName'] = 'project-hybrid-area';

                    } elseif (is_array($this->_parseFilter($pathAr[2]))) {
                        $filter = $pathAr[2];
                        $parsed = $this->_parseFilter($filter);
                        if (!is_array($parsed)) {
                            return false;
                        }
                        $methodName = "_filter_" . $parsed['name'];
                        if (!method_exists($this, $methodName)) {
                            return false;
                        }
                        $filterParams = $this->$methodName($parsed['filterParams']);
                        if ($filterParams) {
                            $params = array_merge($params, $filterParams);
                        } else {
                            return false;
                        }
                    } else {
                        $params['page'] = $m[1];
                    }

                    break;
                case 4:
                    $parsed = $this->_parseFilter($pathAr[2]);

                    if (($pathAr[2] !== 'map' && !is_array($parsed))) {
                        return false;
                    }

                    if ($pathAr[2] === 'map') {
                        if (preg_match('/^page-(\d+)$/', $pathAr[3], $m) == 0) {
                            return false;
                        }
                        $params['page'] = $m[1];
                        $params['controller'] = 'hybrid';
                        $params['action'] = 'index';
                        $params['layer'] = 'projects';
                        $params['seoName'] = 'project-hybrid-area';
                        $this->seoName = 'project-hybrid-area';

                    } else {

                        if ($pathAr[3] === 'map') {
                            $params['controller'] = 'hybrid';
                            $params['action'] = 'index';
                            $params['layer'] = 'projects';
                            $params['seoName'] = 'project-hybrid-area';
                            $this->seoName = 'project-hybrid-area';
                        } else {
                            if (preg_match('/^page-(\d+)$/', $pathAr[3], $m) == 0) {
                                return false;
                            }
                            $params['page'] = $m[1];
                        }

                        $methodName = "_filter_" . $parsed['name'];
                        if (!method_exists($this, $methodName)) {
                            return false;
                        }
                        $filterParams = $this->$methodName($parsed['filterParams']);
                        if ($filterParams) {
                            $params = array_merge($params, $filterParams);
                        } else {
                            return false;
                        }
                    }
                    break;
                case 5:
                    if ($pathAr[3] === 'map') {
                        $params['controller'] = 'hybrid';
                        $params['action'] = 'index';
                        $params['layer'] = 'projects';
                        $params['seoName'] = 'project-hybrid-area';
                        $this->seoName = 'project-hybrid-area';
                    } else {
                        return false;
                    }

                    if (preg_match('/^page-(\d+)$/', $pathAr[4], $m) == 0) {
                        return false;
                    }
                    $params['page'] = $m[1];
                    break;
                default:
                    return false;
                    break;
            }

            $route->setPathParams($params);

            return $route;
        }

        public function assemble(array $params) {

            $pattern = "/{province}-({city}|real-estate)/new-preconstruction-for-sale(/{beds:[\"studio\",\"1\"]}-bedroom|/{beds}-bedrooms|/priced-between-{min_price}-{max_price}|/under-{max_price}|/over-{min_price}|/with-{pool}|/with-{concierge}|/with-{gym}|/move-in-{occupancy}|/by-{builder})";
            //            $pattern = "/{province}-({city}|real-estate)/new-preconstruction-for-sale";
            $url = "";
            try {
                $url = $this->assembleByPattern($pattern, $params);
            } catch (\Exception $e) {

            }

            return $url;
        }

        public function genUrls() {

            $urls = array();
            $filters = array(
//                             "beds" => array("studio",
//                                             "1",
//                                             "2",
//                                             "3",
//                                             "4",
//                                             "5",
//                                             "1-plus",
//                                             "2-plus",
//                                             "3-plus",
//                                             "4-plus",
//                                             "5-plus"),
//                             "pool" => array("pool"),
//                             "gym" => array("gym"),
//                             "concierge" => array("concierge"),
                             "min_price" => array(100000,
                                                  200000,
                                                  300000,
                                                  400000,
                                                  500000,
                                                  600000,
                                                  700000,
                                                  800000,
                                                  900000,
                                                  1000000,
                                                  1500000,
                                                  2000000,
                                                  5000000,
                                                  10000000,
                                                  25000000),
                             "max_price" => array(100000,
                                                  200000,
                                                  300000,
                                                  400000,
                                                  500000,
                                                  600000,
                                                  700000,
                                                  800000,
                                                  900000,
                                                  1000000,
                                                  1500000,
                                                  2000000,
                                                  5000000,
                                                  10000000,
                                                  25000000),
                             "priced_between" => array("filters" => array("min_price", "max_price")));

//            $curYear = date("Y");
//            for ($i = $curYear; $i <= $curYear + 5; $i++) {
//                $filters['occupancy'][] = $i;
//            }
//
//            $res = \Model\Builder::search();
//            foreach ($res as $builder) {
//                $filters['builder'][] = $builder['web_id'];
//            }

            $res = \Model\Province::search(array("nested" => 1,
                                                 "name" => "on"));
            foreach ($res as $province) {
                $params = array("province" => $province['web_id']);
                $urls[] = $this->genUrl($this->assemble($params));
                $this->applyMapFilters($params, $filters, $urls);

                foreach ($province['Region'] as $region) {
                    foreach ($region['City'] as $city) {
                        $params = array("province" => $province['web_id'],
                                        "city" => $city['web_id']);
                        $urls[] = $this->genUrl($this->assemble($params));
                        $this->applyMapFilters($params, $filters, $urls);
                    }
                }
            }

            return $urls;
        }

        private function _parseFilter($filter) {

            foreach ($this->filterPatternsAr as $name => $pattern) {
                if (preg_match($pattern, $filter, $m)) {
                    array_shift($m);

                    return array("name" => $name,
                                 "filterParams" => $m);
                }
            }

            return false;
        }

        private function _filter_beds($params) {

            if (count($params) != 3) {
                return false;
            }

            $number = $params[0];
            $isPlus = !empty($params[1]);
            $isPlural = !empty($params[2]);

            if ($isPlus) {
                if (!$isPlural) {
                    return false; // 2-plus-bedroom (wrong)
                }
            } else {
                if ($number == 1 || $number == 'studio') {
                    if ($isPlural) {
                        return false; // 1-bedrooms (wrong)
                    }
                } else {
                    if (!$isPlural) {
                        return false; // 2-bedroom (wrong)
                    }
                }
            }

            if ($number === 'studio') {
                $number = 0;
            } else {
                $number = $number . '-plus';
            }

            return array("beds" => $number,
                         "seoName" => $this->seoName . "-beds");
        }

        private function _filter_price_under($params) {

            if (count($params) != 1) {
                return false;
            }

            return array("max_price" => $params[0],
                         "seoName" => $this->seoName . "-price-under");
        }

        private function _filter_price_over($params) {

            if (count($params) != 1) {
                return false;
            }

            return array("min_price" => $params[0],
                         "seoName" => $this->seoName . "-price-over");
        }

        private function _filter_with_amenity($params) {

            if (count($params) != 1) {
                return false;
            }

            if ($params[0] === 'gym') {
                $params[0] = $params[0] . '|fitness';
            }

            return array("amenities" => $params[0],
                         "seoName" => $this->seoName . "-" . $params[0]);
        }

        private function _filter_occupancy($params) {

            if (count($params) != 1) {
                return false;
            }

            //todo: fix wierd {2015}
            return array("occupancy" => $params[0],
                         "seoName" => $this->seoName . "-occupancy");
        }

        private function _filter_builder($params) {

            if (count($params) != 1) {
                return false;
            }

            return array("builder" => $params[0],
                         "seoName" => $this->seoName . "-builder");
        }

        private function _filter_priced_between($params) {

            if (count($params) != 2) {
                return false;
            }

            return array("min_price" => $params[0],
                         "max_price" => $params[1],
                         "seoName" => $this->seoName . "-priced-between");
        }

    }
