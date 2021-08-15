<?php

    class AuthenticationController extends ControllerBase {

        public function initialize() {

            parent::initialize();
        }


        public function indexAction() {

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'none';

            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            if ($_GET["m"] == 'p' || $_GET["m"] == 't') {
                $expiryDate = round(microtime(true) * 1000) - 10000;
                $this->cookies->set('refresh_token', '', $expiryDate, "/");
                $this->cookies->set('access_token', '', $expiryDate, "/");
                $this->cookies->set('auth_timeout', '', $expiryDate, "/");
                $this->cookies->set('trp_user_name', '', $expiryDate, "/");
            }
            $this->view->noIndex = true;

            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/authentication.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/authentication.js');
        }

        public function partnerRegAction() {
            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->listing_type = 'none';

            $this->view->minimalistHeader = true;
            $this->view->footer = null;

            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            $this->view->noIndex = true;

            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/authentication.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/authentication.js');
        }

    }

