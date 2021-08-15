<?php

    class AccountController extends ControllerBase {

        public function initialize() {

            parent::initialize();
            $this->view->controllerName = $this->dispatcher->getControllerName();
        }

        public function indexAction() {

            $this->view->listing_type = 'none';

            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();

            $this->view->landing_action = $this->dispatcher->getActionName();

            // for cache busting, instead of using $this->assets we're using custom arrays
            $this->view->styles = array('/assets/styles/pages/account-management.css');

            $this->view->baseUrl = true;
            $this->view->requireAuth = true;
            if ($this->isAuthenticated || ($_GET['_url'] == '/my/alerts-and-emails-settings/' && isset($_GET['email']))) {
                $this->view->requireAuth = false;
            }
            $this->view->authType = 'account-management';

            $scripts = '/assets/scripts';
            $this->view->footer_scripts = array($scripts . '/pages/account-management.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

    }
