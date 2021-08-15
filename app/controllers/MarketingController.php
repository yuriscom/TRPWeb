<?php

    class MarketingController extends ControllerBase {

        public function initialize() {

            parent::initialize();
        }

        public function indexAction() {
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'none';
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();
            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            //      for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function buyAction() {
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'none';
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();
            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            $this->view->landing_action = $this->dispatcher->getActionName();

            $this->view->gaLabel = 'Buyers';
            //      for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function sellAction() {
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'none';
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();
            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            $this->view->landing_action = $this->dispatcher->getActionName();

            $this->view->gaLabel = 'Sellers';
            //      for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function aboutUsAction() {
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'none';
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();
            $this->view->contentInclude = $this->dispatcher->getParam("content-include");
            //      for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function contactUsAction() {
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'none';
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();
            $this->view->contentInclude = $this->dispatcher->getParam("content-include");

            $this->view->gaLabel = 'ContactUs';
            //      for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js',
                                                '/assets/scripts/modules/contact-page.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function partnerSearchAction() {
            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'none';

            $this->view->minimalistHeader = true;
            $this->view->footer = null;

            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            $this->view->noIndex = true;

            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/partners-search.js');
        }

        public function faqAction() {

            header("Location: http://res.theredpin.com/company-info/help-faq", true, 301);
        }

        public function careersAction() {

            header("Location: https://theredpin.bamboohr.com/jobs/", true, 301);
        }

        public function newsletterAction() {

            header("Location: http://pages.theredpin.com/Newsletter-Subscription.html", true, 301);
        }

        public function pressAction() {

            header("Location: http://res.theredpin.com/company-info/press", true, 301);
        }

        public function partnersAction() {

            header("Location: http://res.theredpin.com/company-info/theredpin-partners", true, 301);
        }

        public function specialAction() {

            $params = $this->dispatcher->getParams();
            header("Location: http://res.theredpin.com/special/" . $params['query'], true, 301);
        }

    }