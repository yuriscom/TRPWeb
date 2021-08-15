<?php

    namespace Router\Route\Filter;

    abstract class Filter {

        private $cachedCombinedFilters = array();

        public function process($path, \Router\Route\Route $route, \Router\Router $router) {

            if ($this->match($path, $route, $router) instanceof \Router\Route\Route) {
                return true;
            }

            return false;
        }

        abstract protected function match($path, \Router\Route\Route $route, \Router\Router $router);

        abstract public function assemble(array $params);

        abstract public function genUrls();

        protected function assembleByPattern($pattern, $params) {

            $url = $pattern;
            preg_match_all("/\(([^\)]+)\)/", $pattern, $optionals);
            preg_match_all("/{([^}]+)}/", $pattern, $vars);

            $optionals = $optionals[1];
            $vars = $vars[1];
            $allowedValsAr = array();

            foreach ($vars as $var) {
                if (strstr($var, ":")) {
                    $varAr = explode(":", $var);
                    if (isset($params[$varAr[0]])) {
                        $params[$var] = $params[$varAr[0]];
                    }

                    $allowedValsAr[$var] = (array) json_decode($varAr[1], 1);
                }

                if ($optional = $this->isOptional($var, $optionals)) {
                    if ($alternatives = $this->hasAlternatives($optional)) {
                        $replaced = 0;

                        foreach ($alternatives as $alternative) {
                            preg_match_all("/{([^}]+)}/", $alternative, $altVars);
                            $altVars = $altVars[1];
                            $matched = 1;
                            $altStr = $alternative;

                            foreach ($altVars as $altVar) {
                                if (!isset($params[$altVar])) {
                                    $matched = 0;
                                    break;
                                }

                                if (isset($allowedValsAr[$altVar])) {
                                    if (!in_array($params[$altVar], $allowedValsAr[$altVar])) {
                                        $matched = 0;
                                        break;
                                    }
                                }

                                $altStr = preg_replace($this->patternize("{" . $altVar . "}"), $params[$altVar], $altStr);
                            }

                            if ($matched) {
                                $url = preg_replace($this->patternize("(" . $optional . ")"), $altStr, $url);
                                $replaced = 1;
                                break;
                            }
                        }
                        if (!$replaced) {
                            $url = preg_replace($this->patternize("(" . $optional . ")"), "", $url);
                        }
                    } else {
                        preg_match_all("/{([^}]+)}/", $optional, $optVars);
                        $optVars = $optVars[1];
                        $matched = 1;
                        $optStr = $optional;
                        foreach ($optVars as $optVar) {
                            if (!isset($params[$optVar])) {
                                $matched = 0;
                                break;
                            }
                            if (isset($allowedValsAr[$optVar])) {
                                if (!in_array($params[$optVar], $allowedValsAr[$optVar])) {
                                    $matched = 0;
                                    break;
                                }
                            }

                            $optStr = preg_replace($this->patternize("{" . $optVar . "}"), $params[$optVar], $optStr);
                        }

                        if ($matched) {
                            $url = preg_replace($this->patternize("(" . $optional . ")"), $optStr, $url);
                        } else {
                            $url = preg_replace($this->patternize("(" . $optional . ")"), "", $url);
                        }
                    }
                } else {
                    if (!isset($params[$var])) {
                        throw new \Exception("Param " . $var . " is required for assembling.");
                    }
                    $url = preg_replace($this->patternize("{" . $var . "}"), $params[$var], $url);
                }
            }

            return $url;
        }

        private function isOptional($var, $optionals) {

            foreach ($optionals as $optional) {
                if (preg_match($this->patternize("{" . $var . "}"), $optional)) {
                    return $optional;
                }
            }

            return false;
        }

        private function hasAlternatives($optional) {

            $optAr = explode("|", $optional);
            if (count($optAr) > 1) {
                return $optAr;
            }

            return false;
        }

        private function patternize($string) {

            return "/" . preg_replace("/(\(|\)|\||\/|\-|\[|\])/", "\\\\$1", $string) . "/";
        }

        protected function genUrl($url) {

            if ($url) {
                if ($url[strlen($url) - 1] != "/") {
                    $url .= "/";
                }
            } else {
                $url = "/";
            }

            return $url;
        }

        private function applyMapFilter($filters, $params, $filterName, $filterValAr, &$urls, $isReturnFilter = false) {

            if ($isReturnFilter) {
                $returnFilter = array();
            }
            foreach ($filterValAr as $key => $filterVal) {
                if (is_array($filterVal)) {
                    switch ($key) {
                        case 'loop':
                            for ($i = $filterVal[0]; $i <= $filterVal[1]; $i += $filterVal[2]) {
                                $curFilter = array($filterName => $i);
                                if ($isReturnFilter) {
                                    $returnFilter[] = $curFilter;
                                } else {
                                    $curParams = array_merge($params, $curFilter);
                                    $urls[] = $this->genUrl($this->assemble($curParams));
                                }
                            }
                            break;
                        case 'filters':
                            $tempFilters = array();
                            $dummy = array();
                            if (isset($this->cachedCombinedFilters[json_encode($filterVal)])) {
                                $combinedFilters = $this->cachedCombinedFilters[json_encode($filterVal)];
                            } else {
                                foreach ($filterVal as $i => $tempFilterName) {
                                    if (!isset($filters[$tempFilterName])) {
                                        continue;
                                    }
                                    $tempFilters[$i] = $this->applyMapFilter($filters, $params, $tempFilterName, $filters[$tempFilterName], $dummy, true);
                                }
                                $combinedFilters = cartesian($tempFilters, array($this,
                                                                                 "_cartesian_callback_" . $filterName));
                                $this->cachedCombinedFilters[json_encode($filterVal)] = $combinedFilters;
                            }
                            foreach ($combinedFilters as $combinedFilter) {
                                $curFilter = array();
                                foreach ($combinedFilter as $el) {
                                    $curFilter = array_merge($curFilter, $el);
                                }
                                $curParams = array_merge($params, $curFilter);
                                $urls[] = $this->genUrl($this->assemble($curParams));
                            }
                            break;
                    }
                } else {
                    $curFilter = array($filterName => $filterVal);
                    if ($isReturnFilter) {
                        $returnFilter[] = $curFilter;
                    } else {
                        $curParams = array_merge($params, $curFilter);
                        $urls[] = $this->genUrl($this->assemble($curParams));
                    }
                }
            }
            if ($isReturnFilter) {
                return $returnFilter;
            }
        }

        public function _cartesian_callback_priced_between($el) {

            return ($el[0]['min_price'] < $el[1]['max_price']);
        }

        protected function applyMapFilters($params, $filters, &$urls) {

            foreach ($filters as $filterName => $filterValAr) {
                $this->applyMapFilter($filters, $params, $filterName, $filterValAr, $urls);
            }
        }

        protected $_mappingAr = array("akwesasne-part-59" => array("cornwall-business-park",
                                                                   "downtown-cornwall",
                                                                   "east-end",),
                                      "brampton" => array("bramalea",
                                                          "brampton-downtown",
                                                          "churchville",
                                                          "mount-pleasant",
                                                          "peel-village",
                                                          "springbrook",
                                                          "springdale",),
                                      "burlington" => array("glen-abbey",),
                                      "capital-h-part-1" => array("fairfield",
                                                                  "jubilee",
                                                                  "oaklands",),
                                      "central-okanagan" => array("southwest-mission",),
                                      "cochrane-unorganized-north-part" => array("connaught-hill",
                                                                                 "hill-district",
                                                                                 "melrose",
                                                                                 "moneta",
                                                                                 "mountjoy",
                                                                                 "porcupine",
                                                                                 "south-porcupine",),
                                      "delta" => array("south-arm-islands",),
                                      "fraser-valley-c" => array("hockaday-nestor",
                                                                 "town-centre",),
                                      "fraser-valley-e" => array("chilliwack-mountain",
                                                                 "chilliwack-proper-village-west",
                                                                 "east-chilliwack-southside",
                                                                 "eastern-hillsides",
                                                                 "greendale-cattermole-yarrow",
                                                                 "promontory",
                                                                 "ryder-lake",
                                                                 "sardis-vedder",),
                                      "fraser-fort-george-a" => array("chief-lake",),
                                      "fraser-fort-george-c" => array("danson-industrial-park",),
                                      "greater-vancouver-a" => array("ambleside",
                                                                     "ardingley-sprott",
                                                                     "blueridge",
                                                                     "boundary",
                                                                     "braemar",
                                                                     "brentwood",
                                                                     "bridgeport",
                                                                     "british-properties",
                                                                     "brunette-creek",
                                                                     "burnaby-heights",
                                                                     "burnaby-lake",
                                                                     "burnaby-mountain",
                                                                     "burrard-indian-reserve",
                                                                     "cameron",
                                                                     "canyon-heights",
                                                                     "capilano",
                                                                     "capitol-hill",
                                                                     "cariboo-armstrong",
                                                                     "cariboo-burquitlam",
                                                                     "carisbrooke",
                                                                     "cascade-schou",
                                                                     "cedardale",
                                                                     "central-lynn",
                                                                     "cleveland",
                                                                     "clinton-glenwood",
                                                                     "connaught-heights",
                                                                     "dawson-delta",
                                                                     "deep-cove",
                                                                     "delbrook",
                                                                     "dollarton",
                                                                     "douglas-gilpin",
                                                                     "garden-village",
                                                                     "glenmore",
                                                                     "government-road",
                                                                     "grousewoods",
                                                                     "handsworth",
                                                                     "highlands",
                                                                     "horseshoe-bay",
                                                                     "indian-river",
                                                                     "keith-lynn",
                                                                     "killarney",
                                                                     "kingsway-beresford",
                                                                     "kirkstone",
                                                                     "lake-city",
                                                                     "lions-gate",
                                                                     "lochdale",
                                                                     "lower-capilano-marine",
                                                                     "lower-west-lynn",
                                                                     "lyndhurst",
                                                                     "lynn-canyon",
                                                                     "lynnmour-north",
                                                                     "maplewood",
                                                                     "marlborough",
                                                                     "marpole",
                                                                     "maywood",
                                                                     "mccartney-woods",
                                                                     "morley-buckingham",
                                                                     "norgate",
                                                                     "north-vancouver",
                                                                     "northlands",
                                                                     "norwood-queens",
                                                                     "oakalla",
                                                                     "parkcrest-aubrey",
                                                                     "parkgate",
                                                                     "parkway",
                                                                     "pemberton-heights",
                                                                     "richmond-park",
                                                                     "riverside-east",
                                                                     "riverside-west",
                                                                     "roche-point",
                                                                     "seymour-creek-indian-reserve",
                                                                     "seymour-heights",
                                                                     "sperling-broadway",
                                                                     "stanley-park",
                                                                     "stride-avenue",
                                                                     "stride-hill",
                                                                     "suncrest",
                                                                     "sussex-nelson",
                                                                     "upper-delbrook",
                                                                     "upper-lynn",
                                                                     "upper-west-lynn",
                                                                     "valley-centre",
                                                                     "west-central-valley",
                                                                     "west-lynn-terrace",
                                                                     "west-point-grey",
                                                                     "westridge",
                                                                     "willingdon-heights",
                                                                     "windridge",
                                                                     "windsor",
                                                                     "windsor-park",),
                                      "innisfil" => array("innis-shore",),
                                      "king" => array("taylorwoods",),
                                      "langley" => array("nicomeki",),
                                      "middlesex-centre" => array("bostwick",
                                                                  "byron",
                                                                  "carling",
                                                                  "central-london",
                                                                  "fox-hollow",
                                                                  "glen-cairn",
                                                                  "highland",
                                                                  "huron-heights",
                                                                  "hyde-park",
                                                                  "lambeth",
                                                                  "longwoods",
                                                                  "masonville",
                                                                  "medway",
                                                                  "north-london",
                                                                  "oakridge",
                                                                  "river-bend",
                                                                  "sharon-creek",
                                                                  "south-london",
                                                                  "southcrest",
                                                                  "stoney-creek",
                                                                  "stoneybrook",
                                                                  "sunningdale",
                                                                  "talbot",
                                                                  "tempo",
                                                                  "uplands",
                                                                  "west-london",
                                                                  "westminster",
                                                                  "westmount",
                                                                  "white-oaks",
                                                                  "woodhull",),
                                      "mississauga" => array("clarkson",
                                                             "clearview",
                                                             "ford",
                                                             "heartland",
                                                             "lorne-park",
                                                             "queensway-west",
                                                             "square-one-mississauga",),
                                      "new-westminster" => array("edmonds",
                                                                 "lakeview-mayfield",
                                                                 "second-street",),
                                      "nipissing-unorganized-north-part" => array("downtown-north-bay",
                                                                                  "gateway",
                                                                                  "pinewood",
                                                                                  "thibeault-terrace",),
                                      "north-dumfries" => array("doon-south",
                                                                "downtown-cambridge",
                                                                "dundee",
                                                                "east-galt",
                                                                "silver-heights",
                                                                "southwood",),
                                      "oakville" => array("rivers-oaks",
                                                          "west-mount",),
                                      "oshawa" => array("brooklin",
                                                        "columbus",
                                                        "raglan",
                                                        "rolling-acres",),
                                      "pickering" => array("rural-whitby",),
                                      "richmond-hill" => array("hwy-7-east",
                                                               "hwy-7-west",
                                                               "langstaff-south",),
                                      "scugog" => array("raglan",),
                                      "south-glengarry" => array("churchill-heights",
                                                                 "eamers-corners",),
                                      "south-stormont" => array("centretown",
                                                                "riverdale",),
                                      "springwater" => array("east-bayfield",
                                                             "little-lake",
                                                             "northwest",
                                                             "sandy-hollow",),
                                      "surrey" => array("white-rock",),
                                      "tecumseh" => array("fontainbleu",
                                                          "forest-glade",
                                                          "sandwich-south",
                                                          "walker-farm",),
                                      "thames-centre" => array("fanshawe",),
                                      "thompson-nicola-j-copper-desert-country" => array("aberdeen",
                                                                                         "lac-le-jeune",
                                                                                         "upper-sahali",),
                                      "thompson-nicola-l" => array("barnhartvale",
                                                                   "campbell-creek",
                                                                   "city-center",
                                                                   "dallas",
                                                                   "heffley-creek",
                                                                   "juniper-ridge",
                                                                   "kamloops-indian-reserve",
                                                                   "knutsford",
                                                                   "rayleigh",
                                                                   "rose-hill",
                                                                   "valleyview",),
                                      "thompson-nicola-p-rivers-and-the-peaks" => array("batchelor-heights",
                                                                                        "brocklehurst",
                                                                                        "lower-sahali",
                                                                                        "mission-flats",
                                                                                        "mount-dufferin",
                                                                                        "noble-creek",
                                                                                        "north-shore",
                                                                                        "southgate",
                                                                                        "thompson-rivers-university",
                                                                                        "tranquille",
                                                                                        "west-end",
                                                                                        "westsyde",),
                                      "toronto" => array("agincourt",
                                                         "bracondale-hill",
                                                         "downtown-toronto",
                                                         "forest-hill",
                                                         "leaside",
                                                         "parkway-forest",
                                                         "rexdale",
                                                         "richview",
                                                         "silverthorn",
                                                         "west-humber",),
                                      "vancouver" => array("lynnmour-south",),
                                      "vaughan" => array("bolton",
                                                         "castlemore",),
                                      "waterloo" => array("cedar-hill",
                                                          "cherry-hill",
                                                          "mill-courtland-woodside-park",
                                                          "st-marys-hospital",
                                                          "victoria-park",),
                                      "wilmot" => array("forest-heights",
                                                        "highland-west",
                                                        "victoria-hills",
                                                        "westmount",),

                                      "woolwich" => array("auditorium",
                                                          "bridgeport-east",
                                                          "bridgeport-north",
                                                          "bridgeport-west",
                                                          "central-frederick",
                                                          "city-commercial-core",
                                                          "civic-centre",
                                                          "fairfield",
                                                          "grand-river-north",
                                                          "heritage-park",
                                                          "kw-hospital",
                                                          "mount-hope-huron-park",
                                                          "northward",
                                                          "rosemount",
                                                          "victoria-north",));

    }
