<?php

    namespace Router\Route;

    class Route extends \Phalcon\Mvc\Router\Route {

        public  $numerize = array();
        public  $isCustom = false;
        private $filter;

        public function setPathParams(array $params) {

            $numerize = array();
            foreach ($params as $key => $value) {
                // hack for custom routing to allow integers in params values.
                if (is_numeric($value)) {
                    $value = RouteHelper::unnumerize($value);
                    $this->numerize[] = $key;
                }

                $this->_paths[$key] = $value;
            }
        }

        public function filter(\Router\Route\Filter\Filter $filter) {

            $this->isCustom = true;
            $this->filter = $filter;
            $this->beforeMatch(array($filter,
                                     'process'));
        }

        public function afterMatch(\Phalcon\Mvc\Dispatcher $dispatcher) {

            if (count($this->numerize)) {
                foreach ($this->numerize as $key) {
                    $dispatcher->setParam($key, \Router\Route\RouteHelper::numerize($dispatcher->getParam($key)));
                }
            }
        }

        public function assemble(array $params) {

            if ($this->isCustom && $this->filter) {
                return $this->filter->assemble($params);
            }
        }

        public function genUrls($cache = false) {

            if ($this->isCustom && $this->filter) {
                $urls = $this->filter->genUrls();
                if ($cache && $this->getName()) {
                    $db = \Cache\Mongo\Manager::getInstance()->getDb();
                    $col = $db->sitemap;

                    $routeName = $this->getName();
                    if (count($urls)) {
                        $cachedAr = array();
                        foreach ($urls as $url) {
                            $cachedAr[] = array("route" => $routeName,
                                                "url" => $url);
                        }

                        $col->remove(array("route" => $routeName));
                        $col->remove(array("route" => "names",
                                           "url" => $routeName));
                        while (count($cachedAr) > 100000) {
                            $batch = array_slice($cachedAr, 0, 100000);
                            $cachedAr = array_splice($cachedAr, 100000);
                            $col->batchInsert($batch);
                        }
                        $col->batchInsert($cachedAr);
                        $col->insert(array("route" => "names",
                                           "url" => $routeName));

                        /*
                          $x = $col->find(array("route"=>"names"));
                          foreach ($x as $rec) {
                          p($rec);
                          }
                          die;
                         *
                         */
                    } else {
                        $col->remove(array("route" => $routeName));
                        $col->remove(array("route" => "names",
                                           "url" => $routeName));
                    }
                    \Cache\Mongo\Manager::getInstance()->close();
                }

                return $urls;
            }

            return array();
        }

        public function genImagesUrls($cache = false) {

            if ($this->isCustom && $this->filter) {
                $urls = $this->filter->genImagesUrls();
                if ($cache && $this->getName()) {
                    $db = \Cache\Mongo\Manager::getInstance()->getDb();
                    $col = $db->sitemap;

                    $routeName = $this->getName()."Image";

                    if (count($urls)) {
                        $cachedAr = array();
                        foreach ($urls as $url) {
                            $url["route"] = $routeName;
                            $cachedAr[] = $url;
                        }

                        $col->remove(array("route" => $routeName));
                        $col->remove(array("route" => "names",
                                           "url" => $routeName));

                        while (count($cachedAr) > 1000) {
                            $batch = array_slice($cachedAr, 0, 1000);
                            $cachedAr = array_splice($cachedAr, 1000);
                            $col->batchInsert($batch);
                        }
                        $col->batchInsert($cachedAr);
                        $col->insert(array("route" => "names",
                                           "url" => $routeName));

                    } else {
                        $col->remove(array("route" => $routeName));
                        $col->remove(array("route" => "names",
                                           "url" => $routeName));
                    }
                    \Cache\Mongo\Manager::getInstance()->close();
                }

                return $urls;
            }

            return array();
        }

    }
