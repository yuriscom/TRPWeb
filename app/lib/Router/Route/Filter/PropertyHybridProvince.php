<?php

    namespace Router\Route\Filter;

    class PropertyHybridProvince extends Filter {

        private $filterPatternsAr = array("beds" => "/^((?:[1-9]\d*)|(?:studio))-(plus-)?bedroom(s?)$/",
                                          "price_under" => "/^under-([\d]+)$/",
                                          "price_over" => "/^over-([\d]+)$/",
                                          'priced_between' => "/^priced-between-([\d]+)-([\d]+)$/");
        private $seoName = null;

        public function match($path, \Router\Route\Route $route, \Router\Router $router) {

            $pathAr = explode("/", trim($path, "/"));

            $params = array('controller' => 'listview',
                            'action' => 'listProperties');

            preg_match("/^(.*)-real-estate$/", $pathAr[0], $m1);
            if (!isset($m1[1])) {
                $location = explode("-", $pathAr[0]);
                $params['province'] = $location[0];
                array_shift($location);
                $params['city'] = implode('-', $location);
                $params['area'] = 'city';
            } else {
                $params['province'] = $m1[1];
                $params['area'] = 'province';
            }


            preg_match("/^mls-(.*)-for-sale$/", $pathAr[1], $m2);
            if (!isset($m2[1])) {
                return false;
            }
            switch ($m2[1]) {
                case 'listings':
                    // a city isn't set unless the province is also in the url.
                    $this->seoName = isset($params['city']) ? "property-listview-city-hood" : "property-listview-area";
                    $params['seoName'] = $this->seoName;
                    break;
                default:
                    $params['type'] = $m2[1];
                    $this->seoName = isset($params['city']) ? "property-listview-city-hood-type" : "property-listview-area";
                    $params['seoName'] = $this->seoName;
                    break;
            }

            switch (count($pathAr)) {
                case 2:
                    break;
                case 3:
                    $parsed = $this->_parseFilter($pathAr[2]);
                    if ($pathAr[2] !== 'map' && preg_match('/^page-(\d+)$/', $pathAr[2], $p) == 0 && !is_array($parsed)) {
                        return false;
                    }
                    switch ($pathAr[2]) {
                        case 'map':
                            $params['controller'] = 'hybrid';
                            $params['action'] = 'index';
                            $params['layer'] = 'properties';
                            $params['seoName'] = 'property-hybrid-area';
                            $this->seoName = $params['seoName'];

                            break;
                        default:
                            if (is_array($parsed)) {
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

                            } elseif (count($p) > 0) {
                                $params['page'] = $p[1];

                            } else {
                                return false;
                            }
                            break;
                    }

                    break;
                case 4:

                    if ($pathAr[2] !== 'map' && preg_match('/^page-(\d+)$/', $pathAr[3]) == 0 && !is_array($this->_parseFilter($pathAr[2]))) {
                        return false;
                    }

                    switch ($pathAr[2]) {
                        case 'map':
                            $params['controller'] = 'hybrid';
                            $params['action'] = 'index';
                            $params['layer'] = 'properties';
                            $params['seoName'] = 'property-hybrid-area';
                            $this->seoName = $params['seoName'];
                            break;
                        default:
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

                            break;
                    }
                    if ($pathAr[3] === 'map') {
                        $params['controller'] = 'hybrid';
                        $params['action'] = 'index';
                        $params['layer'] = 'properties';
                        $params['seoName'] = 'property-hybrid-area';
                        $this->seoName = $params['seoName'];

                    } elseif (preg_match('/^page-(\d+)$/', $pathAr[3], $p) > 0) {
                        if (count($p) > 0) {
                            $params['page'] = $p[1];
                        }
                    } else {
                        return false;
                    }

                    break;

                case 5:
                    if (($pathAr[3] !== 'map' || !is_array($this->_parseFilter($pathAr[2])) || preg_match('/^page-(\d+)$/', $pathAr[4]) == 0)) {
                        return false;
                    }
                    $params['controller'] = 'hybrid';
                    $params['action'] = 'index';
                    $params['layer'] = 'properties';
                    $params['seoName'] = 'property-hybrid-area';
                    $this->seoName = $params['seoName'];

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

                    preg_match('/^page-(\d+)$/', $pathAr[4], $p);
                    if (count($p) > 0) {
                        $params['page'] = $p[1];
                    }
                    break;
                default:
                    return false;
                    break;
            }

            $route->setPathParams($params);

            return $route;
        }

        public function assemble(array $params) {

            $pattern = "/{province}-({city}|real-estate)/mls-({ist}|listings)-for-sale(/{beds:[\"studio\",\"1\"]}-bedroom|/{beds}-bedrooms|/priced-between-{min_price}-{max_price}|/under-{max_price}|/over-{min_price})";
//            $pattern = "/{province}-({city}|real-estate)/mls-({ist}|listings)-for-sale";
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

            $istTypes = \Model\PropertyTrpType::getAll();

            $res = \Model\Province::search(array("nested" => 1,
                                                 "name" => "on"));
            foreach ($res as $province) {
                $params = array("province" => $province['web_id']);
                $urls[] = $this->genUrl($this->assemble($params));
                $this->applyMapFilters($params, $filters, $urls);

                if (count($istTypes)) {
                    foreach ($istTypes as $type) {
                        $params = array("province" => $province['web_id'],
                                        "ist" => $type['sys_name']);
                        $urls[] = $this->genUrl($this->assemble($params));
                        $this->applyMapFilters($params, $filters, $urls);
                    }
                }

                foreach ($province['Region'] as $region) {
                    foreach ($region['City'] as $city) {
                        $params = array("province" => $province['web_id'],
                                        "city" => $city['web_id']);
                        $urls[] = $this->genUrl($this->assemble($params));
                        $this->applyMapFilters($params, $filters, $urls);

                        if (count($istTypes)) {
                            foreach ($istTypes as $type) {
                                $params = array("province" => $province['web_id'],
                                                "city" => $city['web_id'],
                                                "ist" => $type['sys_name']);
                                $urls[] = $this->genUrl($this->assemble($params));
                                $this->applyMapFilters($params, $filters, $urls);
                            }
                        }
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

        private function _filter_priced_between($params) {

            if (count($params) != 2) {
                return false;
            }

            return array("min_price" => $params[0],
                         "max_price" => $params[1],
                         "seoName" => $this->seoName . "-priced-between");
        }

    }