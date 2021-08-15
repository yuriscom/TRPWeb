<?php

    class TemplateController extends ControllerBase {

        public function initialize() {

            parent::initialize();
        }

        public function indexAction() {

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->view->setMainView('templates/' . $this->dispatcher->getParam("template"));
        }

    }