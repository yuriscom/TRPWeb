<?php

    namespace Router\Route\Filter;

    class PropertyHybridRegion extends Filter {

        private $filterPatternsAr = array("beds" => "/^((?:[1-9]\d*)|(?:studio))-(plus-)?bedroom(s?)$/",
                                          "price_under" => "/^under-([\d]+)$/",
                                          "price_over" => "/^over-([\d]+)$/",
                                          'priced_between' => "/^priced-between-([\d]+)-([\d]+)$/");

        public function match($path, \Router\Route\Route $route, \Router\Router $router) {

            $pathAr = explode("/", trim($path, "/"));

            $params = array('controller' => 'listview',
                            'action' => 'listProperties',
                            'seoName' => 'property-listview-area');
            $this->seoName = $params['seoName'];
            preg_match("/^(.*)-real-estate$/", $pathAr[0], $m1);
            if (!isset($m1[1])) {
                return false;
            }

            $params['province'] = $m1[1];
            $params['region'] = $pathAr[1];
            $params['area'] = 'region';

            preg_match("/^mls-(.*)-for-sale$/", $pathAr[2], $m2);
            if (!isset($m2[1])) {
                return false;
            }

            switch ($m2[1]) {
                case 'listings':
                    break;
                default:
                    $params['type'] = $m2[1];
                    break;
            }

            switch (count($pathAr)) {
                case 3:
                    break;
                case 4:
                    $parsed = $this->_parseFilter($pathAr[3]);

                    if ($pathAr[3] === 'map') {

                        $params['controller'] = 'hybrid';
                        $params['action'] = 'index';
                        $params['layer'] = 'properties';
                        $params['seoName'] = 'property-hybrid-area';

                    } elseif (is_array($parsed)) {
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
                    } elseif (preg_match('/^page-(\d+)$/', $pathAr[3], $m) > 0) {
                        $params['page'] = $m[1];
                    } else {
                        return false;
                    }

                    break;
                case 5:

                    $parsed = $this->_parseFilter($pathAr[3]);
                    if ($pathAr[3] === 'map') {

                        $params['controller'] = 'hybrid';
                        $params['action'] = 'index';
                        $params['layer'] = 'properties';
                        $params['seoName'] = 'property-hybrid-area';
                        $this->seoName = 'property-hybrid-area';

                        if (preg_match('/^page-(\d+)$/', $pathAr[4], $m) > 0) {
                            $params['page'] = $m[1];
                        } else {

                            return false;
                        }

                    } elseif (is_array($parsed)) {
                        if ($pathAr[4] === 'map') {

                            $params['controller'] = 'hybrid';
                            $params['action'] = 'index';
                            $params['layer'] = 'properties';
                            $params['seoName'] = 'property-hybrid-area';
                            $this->seoName = 'property-hybrid-area';

                        } elseif (preg_match('/^page-(\d+)$/', $pathAr[4], $p) > 0) {
                            $params['page'] = $p[1];
                        } else {
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
                    }

                    break;
                case 6:

                    $parsed = $this->_parseFilter($pathAr[3]);
                    if (is_array($parsed)) {
                        if ($pathAr[4] === 'map') {

                            $params['controller'] = 'hybrid';
                            $params['action'] = 'index';
                            $params['layer'] = 'properties';
                            $params['seoName'] = 'property-hybrid-area';
                            $this->seoName = 'property-hybrid-area';

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
                        return false;
                    }

                    if (preg_match('/^page-(\d+)$/', $pathAr[5], $m) > 0) {
                        $params['page'] = $m[1];
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

        public function assemble(array $params) {

            $pattern = "/{province}-real-estate/{region}/mls-({ist}|listings)-for-sale(/{beds:[\"studio\",\"1\"]}-bedroom|/{beds}-bedrooms|/priced-between-{min_price}-{max_price}|/under-{max_price}|/over-{min_price})";
//            $pattern = "/{province}-real-estate/{region}/mls-({ist}|listings)-for-sale";
            $url = "";
            try {
                $url = $this->assembleByPattern($pattern, $params);
            } catch (\Exception $e) {

            }

            return $url;
        }

        public function genUrls() {

            $urls = array();
            $istTypes = \Model\PropertyTrpType::getAll();
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

            $res = \Model\Province::search(array("nested" => 1,
                                                 "name" => "on"));
            foreach ($res as $province) {
                foreach ($province['Region'] as $region) {
                    $params = array("province" => $province['web_id'],
                                    "region" => $region['web_id']);
                    $urls[] = $this->genUrl($this->assemble($params));
                    $this->applyMapFilters($params, $filters, $urls);

                    if (count($istTypes)) {
                        foreach ($istTypes as $type) {
                            $params = array("province" => $province['web_id'],
                                            "region" => $region['web_id'],
                                            "ist" => $type['sys_name']);
                            $urls[] = $this->genUrl($this->assemble($params));
                            $this->applyMapFilters($params, $filters, $urls);
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
