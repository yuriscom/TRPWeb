<?php

    class ContentController extends ControllerBase {

        public function initialize() {

            parent::initialize();
        }


        public function indexAction() {
            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'none';

            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            $this->view->contentInclude = $this->dispatcher->getParam("content-include");

            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();

        }

    }