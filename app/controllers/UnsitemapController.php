<?php

    class UnsitemapController extends ControllerBase {

        const MAX_SIZE = 10000;

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
            $regex = new MongoRegex("/Hybrid/i");
            $routes = $col->find(array("route" => "names",
                                       "url" => $regex));

            $sitemapAr = array();
            foreach ($routes as $route) {
                //preg_match_all('/((?:^|[A-Z])[a-z]+)/', $route['url'], $matches);
                //$routeName = strtolower(join("-", $matches[1]));
                $routeName = $route['url'];
                $pricedBetweenRegex = new MongoRegex("/\/priced-between/");
                $count = $col->count(array("route" => $route['url'],
                                           "url" => $pricedBetweenRegex));
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

            $db = \Cache\Mongo\Manager::getInstance()->getDb();
            $col = $db->sitemap;
            $pricedBetweenRegex = new MongoRegex("/\/priced-between/");
            $cursor = $col->find(array("route" => $routeName, "url" => $pricedBetweenRegex));
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
            $this->loc = $protocol . "://" . $_SERVER['HTTP_HOST'] . "/unsitemap-" . $route . ($page > 1 ? "-" . $page
                    : "") . ".xml";
            $this->lastmod = ($lastmod) ? $lastmod : date("Y-m-d");
        }

    }
