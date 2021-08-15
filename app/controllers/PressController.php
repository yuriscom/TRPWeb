<?php

    class PressController extends ControllerBase {

        public function initialize() {

            parent::initialize();
            $this->view->controllerName = $this->dispatcher->getControllerName();
        }

        public function indexAction() {

            $this->view->listing_type = 'none';

            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            $this->view->landing_action = $this->dispatcher->getActionName();

            $seoBreadCrumbs = array('/' => 'Home', '#' => 'Media Mentions');
            $this->view->breadcrumbs = $seoBreadCrumbs;

            $articles = \Model\Press::getPress();
            $articles = array_map(array($this, 'appendPrettyDate'), $articles);

            $this->view->articles = $articles;

            // for cache busting, instead of using $this->assets we're using custom arrays
            $scripts = '/assets/scripts';
            $this->view->footer_scripts = array($scripts . '/pages/content.js');
            $this->view->styles = array('/assets/styles/pages/press.css');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function appendPrettyDate($article) {
            $date = date_create($article['published_on']);
            $formatted_date = date_format($date, 'F d, Y');
            $article['prettyDate'] = $formatted_date;
            return $article;
        }

    }
