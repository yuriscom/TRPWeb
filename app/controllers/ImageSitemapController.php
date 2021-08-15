<?php

    class ImageSitemapController extends ControllerBase {

        const MAX_SIZE = 1000;

        public function initialize() {

            parent::initialize();
            $this->view->setRenderLevel(Phalcon\Mvc\View::LEVEL_ACTION_VIEW);

            header('Content-type: text/xml');
        }

        public function indexAction() {

            $params = $this->dispatcher->getParams();

            if (isset($params['sitemap'])) {
                $this->sitemap($params['sitemap'], $params['page']);
            } else {
                $this->sitemapIndex();
            }
            die;
        }

        private function sitemapIndex() {

            $db = \Cache\Mongo\Manager::getInstance()->getDb();
            $col = $db->sitemap;

            $routes = array(
                array("route" => "names", "url" => "propertyImage"),
                array("route" => "names", "url" => "projectImage"),
                array("route" => "names", "url" => "locationProfileImage"),
                array("route" => "names", "url" => "exclusiveImage"),
                array("route" => "names", "url" => "agentProfileImage"),
            );
            $sitemapAr = array();

            foreach ($routes as $route) {
                $routeName = $route['url'];
                $where["route"] = $routeName;

                $count = $col->count($where);

                if (!$count) {
                    continue;
                }
                $sitemapAr[] = new SitemapIndexElement($routeName, 1);
                if ($count > self::MAX_SIZE) {
                    $i = 1;
                    while (true) {
                        $count -= self::MAX_SIZE;
                        if ($count <= 0) {
                            break;
                        }
                        $i++;
                        $sitemapAr[] = new SitemapIndexElement($routeName, $i);
                    }
                }
            }

            $this->view->sitemaps = $sitemapAr;
            $this->render("sitemap-index");
        }

        private function sitemap($routeName, $page = 1) {

            $page = max(1, $page); // don't allow 0
            $where = array("route" => $routeName."Image");

            $db = \Cache\Mongo\Manager::getInstance()->getDb();
            $col = $db->sitemap;
            $cursor = $col->find($where);

            //$cursor->sort(array('url' => 1));
            $cursor->limit(self::MAX_SIZE);
            $cursor->skip(($page - 1) * self::MAX_SIZE);
            $pages = array();

            foreach ($cursor as $rec) {
                $pages[] = $rec;
            }

            $this->view->pages = $pages;

            $this->render("sitemap");
        }

    }

    class SitemapIndexElement {

        public $loc;
        public $lastmod;

        public function __construct($route, $page = 1, $lastmod = '') {

            $protocol = 'https';
            $this->loc = $protocol . "://" . $_SERVER['HTTP_HOST'] . "/image-sitemap-" . $route . ($page > 1 ? "-" . $page : "") . ".xml";
            $this->lastmod = ($lastmod) ? $lastmod : date("Y-m-d");
        }

    }
