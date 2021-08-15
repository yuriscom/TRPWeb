<?php

    namespace Router\Route\Filter;

    use Model\Location;

    class Legacy extends Filter {

        private $router;
        private $_cityMap = array('toronto' => 'toronto',
                                  'north-york' => 'toronto',
                                  'richmond-hill' => 'richmond-hill',
                                  'mississauga' => 'mississauga',
                                  'etobicoke' => 'toronto',
                                  'scarborough' => 'toronto',
                                  'markham' => 'markham',
                                  'oakville' => 'oakville',
                                  'vaughan' => 'vaughan',
                                  'brampton' => 'brampton',
                                  'woodbridge' => 'toronto',
                                  'pickering' => 'pickering',
                                  'aurora' => 'aurora',
                                  'whitby' => 'whitby',
                                  'oshawa' => 'oshawa',
                                  'ajax' => 'ajax',
                                  'milton' => 'milton',
                                  'burlington' => 'burlington',
                                  'thornhill' => 'thornhill',
                                  'york' => 'york',
                                  'east-york' => 'east-york',
                                  'clarington' => 'clarington',
                                  'uxbridge' => 'uxbridge',
                                  'scugog' => 'scugog',
                                  'brock' => 'brock',
                                  'halton-hills' => 'halton-hills',
                                  'caledon' => 'caledon',
                                  'king' => 'king',
                                  'georgina' => 'georgina',
                                  'newmarket' => 'newmarket',
                                  'east-gwillimbury' => 'east-gwillimbury',
                                  'whitchurch-stouffville' => 'whitchurch-stouffville',
                                  'stouffville' => 'stouffville',
                                  'barrie' => 'barrie',
                                  'port-hope' => 'port-hope',
                                  'cobourg' => 'cobourg',
                                  'king-city' => 'king',
                                  'kitchener' => 'kitchener',
                                  'waterloo' => 'waterloo',
                                  'vancouver' => 'vancouver',
                                  'guelph' => 'guelph',
                                  'hamilton' => 'hamilton',
                                  'cambridge' => 'cambridge',
                                  'kingston' => 'kingston');
        private $_hoodMap = array('east-york' => null,
                                  'bloor-west' => 'runnymede-bloor-west-village',
                                  'don-mills' => null,
                                  'port-union' => null,
                                  'etobicoke-west-mall' => null,
                                  'queen-west' => null,
                                  'hwy-7-east' => null);

        public function match($path, \Router\Route\Route $route, \Router\Router $router) {

            $this->router = $router;
            $patternAr = array("\/authentication" => "/authenticate",
                               "\/agents" => "/real-estate-agents/",
                               "\/agents\/([a-z0-9\-]+)" => "agent",
                               "\/mls-listings-and-new-pre-construction-listings" => "property",
                               "\/([a-z0-9\-]+)-condos\/([a-z0-9\-]+)" => "project",
                               "\/([a-z0-9\-]+)-condos\/([a-z0-9\-]+)\/?([a-z0-9\-]+)" => "project",
                               "\/homedetails\/.*--([\d]+)" => "property",
                               "\/condos" => "project",
                               "\/condos\/([a-z0-9\-]+)--([a-z0-9\-]+)" => "project_hybrid_hood",
                               // condos/hood--city
                               "\/condos\/hood\/([a-z0-9\-]+)--([a-z0-9\-]+)" => "project_hybrid_hood",
                               // condos/hood/hood--city
                               "\/condos\/([a-z0-9\-]+)" => "project",
                               // condos/builder || condos/city
                               "\/condos\/city\/([a-z0-9\-]+)" => "project",
                               // condos/builder || condos/city
                               "\/condos\/developer\/([a-z0-9\-]+)" => "project",
                               // condos/builder || condos/city
                               "\/condos\/vip" => "project",
                               "\/company-info" => "/about-us",
                               "\/company-info\/press" => "/media-mentions/",
                               // "/in-the-news",
                               "\/company-info\/theredpin-partners" => "/partners",
                               // "/in-the-news",
                               "\/company-info\/help-faq" => "/faq",
                               "\/company-info\/careers" => "/careers",
                               "\/company-info\/privacy-policy" => "/privacy",
                               // "/privacy-policy",
                               "\/company-info\/terms-of-use" => "/terms",
                               //"/terms-of-use",
                               "\/company-info\/treb-terms-of-use" => "/treb-terms",
                               // "/treb-terms-of-use",
                               "\/condos\/lofts" => "/on-toronto/new-preconstruction-for-sale/",
                               "\/condos\/lake-view" => "/on-toronto/new-preconstruction-for-sale/",
                               "\/condos\/luxury" => "/on-toronto/new-preconstruction-for-sale/",
                               "\/condos\/high-rise" => "/on-toronto/new-preconstruction-for-sale/",
                               "\/condos\/mid-rise" => "/on-toronto/new-preconstruction-for-sale/",
                               "\/condos\/green" => "/on-toronto/new-preconstruction-for-sale/",
                               "\/([a-z0-9\-]+)--listings" => "mls_listings",
                               //city--listings
                               "\/([a-z0-9\-]+)--listings--p([0-9]+)" => "mls_listings",
                               //city--listings
                               "\/cities" => "/on-real-estate",
                               "\/on" => "/on-real-estate",
                               "\/on\/([a-z0-9\-]+)-real-estate" => "location",
                               "\/on\/([a-z0-9\-]+)-real-estate\/([a-z0-9\-]+)" => "location",
                               "\/([a-z0-9\-]+)--neighbourhoods" => "location",
                               "\/([a-z0-9\-]+)--streets" => "location",
                               "\/([a-z0-9\-]+)--intersections" => "location",
                               "\/account\/prospect-match" => "/prospect-match",

                               "\/([a-z]*)-(?:(.*)|real-estate)\/([a-z\-]*)\/new-preconstruction-for-sale\/([a-z0-9\-]*)-beds" => "project",
                               "\/([a-z]*)-(?:(.*)|real-estate)\/(new-preconstruction-for-sale)\/([a-z0-9\-]*)-beds" => "project",

                               "\/([a-z]*)-(?:(.*)|real-estate)\/([a-z\-]*)\/mls-(.*)-for-sale\/([a-z0-9\-]*)-beds" => "property",
                               "\/([a-z]*)-(?:(.*)|real-estate)\/mls-(.*)-for-sale\/([a-z0-9\-]*)-beds" => "property",);

            foreach ($patternAr as $pattern => $val) {
                if (preg_match("/^" . $pattern . "\/?$/", $path, $m)) {
                    $methodName = "_url_" . $val;
                    if (method_exists($this, $methodName)) {
                        $redirectUrl = $this->$methodName($m);
                    } else {
                        $redirectUrl = $val;
                    }

                    $redirectUrlAr = parse_url($redirectUrl);

                    // build query strings
                    $originalGet = $_GET;
                    unset($originalGet["_url"]);
                    $originalQueryString = http_build_query($originalGet);
                    $redirectQueryString = (isset($redirectUrlAr['query']) ? $redirectUrlAr['query'] : "");
                    $queryString = join("&", array_filter(array($originalQueryString,
                                                                $redirectQueryString)));
                    if ($queryString) {
                        $redirectUrlAr['query'] = $queryString;
                    }
                    // ---

                    $redirectUrlAr['path'] = rtrim($redirectUrlAr['path'], "/") . "/";
                    $redirectUrl = http_build_url("", $redirectUrlAr);
                    //                p($redirectUrl);
                    //                die;
                    header('Location: ' . $redirectUrl, true, 301);
                    exit;
                }
            }

            return false;
        }

        private function _url_property($m) {

            $params = array();

            //redirect /#-beds
            switch (count($m)) {
                case 5: //province and city cases.
                    if ($m[2] === 'real-estate') { //is province case.
                        $params = array('province' => $m[1],
                                        'ist' => $m[3]);
                    } else {
                        $params = array('province' => $m[1],
                                        'city' => $m[2],
                                        'ist' => $m[3]);
                    }

                    return $this->router->assemble("propertyHybridProvince", $params);
                    break;
                case 6: //hood and region cases
                    if ($m[2] === 'real-estate') { //is region case.
                        $params = array('province' => $m[1],
                                        'region' => $m[3],
                                        'ist' => $m[4]);

                        return $this->router->assemble("propertyHybridRegion", $params);
                    } else {
                        $params = array('province' => $m[1],
                                        'city' => $m[2],
                                        'hood' => $m[3],
                                        'ist' => $m[4]);

                        return $this->router->assemble("propertyHybridHood", $params);
                    }

                    break;
            }


            if (isset($m[1])) {
                $id = $m[1];
                $property = \Model\Property::getById($id);
                if (!count($property)) {
                    return "/";
                }

                if (isset($property['destinationUrl'])) {
                    return $property['destinationUrl'];
                }

                $params = array("address" => $property['addr_full_slug'],
                                "city" => $property['MainCity']['web_id'],
                                "postal" => $property['addr_postal_code'],
                                "mls" => $property['mls_num']);
                if (isset($property['MainHood']['web_id'])) {
                    $params['hood'] = $property['MainHood']['web_id'];
                }
            }

            return $this->router->assemble("property", $params);
        }

        private function _url_project($m) {

            $params = array();
            $routeName = "project";
            switch (count($m)) {
                case 1:
                    break;
                case 2:
                    $webId = $m[1];

                    // builder ?
                    $builder = \Model\Builder::getByWebId($webId);
                    if ($builder && count($builder)) {
                        $params = array("builder" => $webId);
                        break;
                    }

                    // city ?
                    $city = $this->getAreaSmart($webId, "city");
                    if ($city && count($city)) {
                        $routeName = "projectHybridProvince";
                        $params = array("city" => $city['city_web_id'],
                                        "province" => $city['province_web_id']);
                        break;
                    }

                    break;
                case 3:
                case 4:
                    $city = $m[1];
                    $webId = $m[2];
                    $project = \Model\Project::getById($webId, array('type' => 'name'));
                    if (!count($project)) {
                        return $this->router->assemble("projectHybridProvince", array("province" => "on"));
                    }

                    $params = array("builder" => $project['PB'][0]['Builder']['web_id'],
                                    "name" => $project['web_id'],
                                    "city" => $project['MainCity']['web_id']);
                    if (isset($project['MainHood']['web_id'])) {
                        $params['hood'] = $project['MainHood']['web_id'];
                    }
                    break;
                case 5:
                    $province = $m[1];
                    if ($m[2] !== 'real-estate') {
                        $city = $m[2];
                    }

                    if ($m[2] == 'real-estate' && $m[3] !== 'new-preconstruction-for-sale') {
                        $region = $m[3];
                    }

                    if ($m[3] !== 'new-preconstruction-for-sale') {
                        $hood = $m[3];
                    }

                    if (!isset($hood) && !isset($city)) {
                        $params = array('province' => $province);

                        return $this->router->assemble("projectHybridProvince", $params);
                    } elseif (!isset($hood) && isset($city)) {
                        $params = array('province' => $province,
                                        'city' => $city);

                        return $this->router->assemble("projectHybridProvince", $params);
                    } elseif (!isset($city) && isset($region)) {
                        $params = array('province' => $province,
                                        'region' => $region);

                        return $this->router->assemble("projectHybridRegion", $params);
                    } elseif (isset($hood)) {
                        $params = array('province' => $province,
                                        'city' => $city,
                                        'hood' => $hood);

                        return $this->router->assemble("projectHybridHood", $params);
                    }
                    break;
            }

            return $this->router->assemble($routeName, $params);
        }

        private function _url_project_hybrid_hood($m) {

            $hood = $m[1];
            $city = $m[2];

            foreach ($this->_hoodMap as $key => $value) {
                $pos = strpos($hood, $key);
                if ($pos === 0) {
                    $hood = $value;
                    break;
                }
            }

            if (isset($hood)) {
                $hoodObj = $this->getAreaSmart($hood, "hood", $m[2]);
                $routeName = 'projectHybridHood';

                if (!$hoodObj) {
                    $routeName = 'projectHybridProvince';
                    $params = array("province" => "on");
                } else {
                    $params = array("province" => $hoodObj['province_web_id'],
                                    "city" => $hoodObj['city_web_id'],
                                    "hood" => $hoodObj['hood_web_id']);
                }

            } else {
                $cityObj = $this->getAreaSmart($city, "city");
                $routeName = 'projectHybridProvince';
                $params = array("province" => $cityObj['province_web_id'],
                                "city" => $cityObj['city_web_id']);
            }

            return $this->router->assemble($routeName, $params);
        }

        private function _url_location($m) {

            $params = array();

            if (isset($m[1])) {
                foreach ($this->_cityMap as $key => $value) {
                    $pos = strpos($m[1], $key);
                    if ($pos === 0) {
                        $web_id = $value;
                        break;
                    }
                }

                $city = \Model\Location::getByWebId('city', $web_id);

                if (!count($city)) {
                    return "/";
                }

                $params = array("province" => $city['province_web_id'],
                                "city" => $city['city_web_id']);

                if (isset($m[2])) {
                    $hood_web_id = $m[2];
                    foreach ($this->_hoodMap as $key => $value) {
                        $pos = strpos($m[2], $key);
                        if ($pos === 0) {
                            $hood_web_id = $value;
                            break;
                        }
                    }
                    if ($hood_web_id !== null) {
                        $params['hood'] = $hood_web_id;
                    }
                }

            }

            return $this->router->assemble("locationProfile", $params);
        }

        private function _url_agent($m) {
            return '/real-estate-agents/'.$m[1].'/';
        }

        private function _url_mls_listings($m) {

            $uri = "/" . $m[1] . "--listings";
            $page = null;

            try {
                $page = \Model\Page::search(array("uri" => $uri));
            } catch (\Exception $e) {

            }

            if (!$page) {
                return $this->router->assemble("propertyHybridProvince", array("province" => "on"));
            }

            $params = json_decode($page['params'], 1);
            foreach ($this->_cityMap as $key => $value) {
                $pos = strpos($params['city'], $key);
                if ($pos === 0) {
                    $params['city'] = $value;
                    break;
                }
            }

            if (isset($params['hood'])) {
                $routeName = "propertyHybridHood";

                foreach ($this->_hoodMap as $key => $value) {
                    $pos = strpos($params['hood'], $key);
                    if ($pos === 0) {
                        $params['hood'] = $value;
                        break;
                    }
                }

                $hood = $this->getAreaSmart($params['hood'], 'hood', $params['city']);
                if (!$hood) {
                    return $this->router->assemble("propertyHybridProvince", array("province" => "on"));
                }
                $params = array_merge($params, array("province" => $hood['province_web_id'],
                                                     'city' => $hood['city_web_id'],
                                                     'hood' => $hood['hood_web_id']));
            } else {
                $routeName = "propertyHybridProvince";

                if (isset($params['city'])) {
                    $city = $this->getAreaSmart($params['city'], 'city');
                    if (!$city) {
                        return $this->router->assemble("propertyHybridProvince", array("province" => "on"));
                    }

                    $params['city'] = $city['city_web_id'];
                    $params = array_merge($params, array("province" => $city['province_web_id']));
                }
            }

            //idx! map query string
            $mapKeys = array("COMMON_price_min" => "min_price",
                             "COMMON_price_max" => "max_price",
                             "COMMON_num_beds" => "beds",
                             "COMMON_num_baths" => "baths",
                             "RESALE_COMMON_property_type" => "type");
            $mapRESALE_COMMON_property_type = array("condo-apt" => array("condos",
                                                                         "lofts"),
                                                    "condo-townhouse" => array("condos",
                                                                               "townhouses"),
                                                    "detached" => array("detached-homes"),
                                                    "semi-detached" => array("semi-detached-homes"),
                                                    "townhouse" => array("townhouses"),
                                                    "other" => array("miscellaneous"));

            $mapCOMMON_num_baths = array("1" => "1-plus",
                                         "2" => "2-plus",
                                         "3" => "3-plus");

            $qsAr = array();
            if (isset($_GET['pag']['orderby'])) {
                $qsAr[] = "order_by=" . strtr($_GET['pag']['orderby'], array(" " => ",",
                                                                             "real_dom" => "dom"));
                unset($_GET['pag']);
            }
            if (isset($_GET['srch'])) {
                foreach ($_GET['srch'] as $key => $val) {
                    $key = trim($key);
                    if (!isset($mapKeys[$key])) {
                        continue;
                    }

                    if (is_array($val)) {
                        $newValAr = array();
                        foreach ($val as $v) {
                            if (isset(${"map" . $key})) {
                                if (isset(${"map" . $key}[$v])) {
                                    $newValAr = array_merge($newValAr, ${"map" . $key}[$v]);
                                }
                            } else {
                                $newValAr[] = $v;
                            }
                        }

                        $newVal = join(",", array_unique($newValAr));
                    } else {
                        if (isset(${"map" . $key})) {
                            if (isset(${"map" . $key}[$val])) {
                                $newVal = ${"map" . $key}[$val];
                            }
                        } else {
                            $newVal = trim($val);
                        }
                    }
                    if (!strlen($newVal)) {
                        continue;
                    }

                    $newKey = $mapKeys[$key];
                    $qsAr[] = $newKey . "=" . $newVal;
                }
                unset($_GET['srch']);
            }

            return $this->router->assemble($routeName, $params) . (count($qsAr) ? "?" . "legacy=" . json_encode($qsAr) : "");
        }

        public function assemble(array $params) {

            return "/";
        }

        public function genUrls() {

        }

        private function getAreaSmart($areaName, $areaType, $areaParent = null) {

            switch ($areaType) {
                case 'city':
                    $model = "\Model\City";
                    $trp1model = "\Model\Trp1City";
                    if (isset($this->_cityMap[$areaName])) {
                        $areaName = $this->_cityMap[$areaName];
                    }
                    break;
                case 'hood':
                    $model = "\Model\Hood";
                    $trp1model = "\Model\Trp1Hood";
                    if (isset($this->_hoodMap[$areaName])) {
                        $areaName = $this->_hoodMap[$areaName];
                    }
                    break;
                default:
                    return false;
                    break;
            }

            $area = \Model\Location::getByWebId($areaType, $areaName, $areaParent);

            if (!$area) {
                $trp1area = $trp1model::getByWebId($areaName);
                if (!$trp1area) {
                    return false;
                }
                $bounds = json_decode($trp1area['bounds'], 1);
                $poly = new \Locational\Polygon($bounds);
                $boundsAr = $poly->getBoundingBoxCoords();

                /*
                  $it = new \RecursiveIteratorIterator(new \RecursiveArrayIterator($bounds));
                  $boundsAr = array();
                  foreach ($it as $bound) {
                  $boundsAr[] = $bound;
                  }
                 *
                 */

                $params = array("bounds" => join(",", $boundsAr),
                                "exact" => true);
                $areasAr = $model::search($params);

                if (!count($areasAr)) {
                    return false;
                }
                $areaId = array_shift($areasAr)['id'];
                $area = $model::getByWebId($areaId);
            }

            return $area;
        }

    }
