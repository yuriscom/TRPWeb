<?php

    use Phalcon\Mvc\View;

    class ErrorController extends ControllerBase {

        public function initialize() {

            parent::initialize();
        }

        public function _403Action() {

            $this->viewCache->save('error-cache', '403');
            $response = new \Phalcon\Http\Response();
            $response->setStatusCode(403, "Forbidden");
            $this->view->listing_type = 'none';
            $response->setContent = $this->dispatcher->getParam("content_include");
            $response->send();

            if ($this->cookies->has('inactiveRedirect')) {
                $this->cookies->get('inactiveRedirect')->delete();
            }
            $this->view->showCanonical = false;
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = array('title' => '403 - Access Forbidden');
        }

        public function _404Action() {

            //$this->viewCache->save('error-cache', '404');
            $response = new \Phalcon\Http\Response();
            $response->setStatusCode(404, "Not Found");
            $this->view->listing_type = 'none';
            $response->setContent = $this->dispatcher->getParam("content_include");
            $response->send();

            if ($this->cookies->has('inactiveRedirect')) {
                $this->cookies->get('inactiveRedirect')->delete();
            }
            $this->view->showCanonical = false;
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = array('title' => '404 - This page cannot be found');
        }

        public function _410Action() {

            $this->viewCache->save('error-cache', '410');
            $response = new \Phalcon\Http\Response();
            $response->setStatusCode(410, "Gone");
            $this->view->listing_type = 'none';
            $response->setContent = $this->dispatcher->getParam("content_include");
            $response->send();

            if ($this->cookies->has('inactiveRedirect')) {
                $this->cookies->get('inactiveRedirect')->delete();
            }
            $this->view->showCanonical = false;
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = array('title' => '410 - This page is gone');
        }

        public function _503Action() {

//            $this->viewCache->save('error-cache', '503');
            $response = new \Phalcon\Http\Response();
            $response->setStatusCode(503, "Service Unavailable");
            $this->view->listing_type = 'none';
            $response->setContent = $this->dispatcher->getParam("content_include");
            $response->send();

            if ($this->cookies->has('inactiveRedirect')) {
                $this->cookies->get('inactiveRedirect')->delete();
            }
            $this->view->showCanonical = false;
            $this->view->isLanding = null;
            $this->view->styles = array('/assets/styles/pages/content.css');
            $this->view->footer_scripts = array('/assets/scripts/pages/content.js');
            $this->view->seo = array('title' => '503 - This service is unavailable');
        }

    }
