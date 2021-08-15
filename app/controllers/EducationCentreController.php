<?php

    class EducationCentreController extends ControllerBase {

        public function initialize() {

            parent::initialize();
        }


        public function investmentAction() {
            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $this->view->listing_type = 'none';

            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            $this->view->landing_action = $this->dispatcher->getActionName();
            $this->view->gaLabel = 'HowTo';

            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/content.css');

            $scripts = '/assets/scripts';
            $this->view->footer_scripts = array($scripts . '/pages/education-centre.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }
    }