<?php

    class ProvinceController extends ControllerBase {

        public function initialize() {

            parent::initialize();
        }

        public function indexAction() {

            p($this->dispatcher->getParams());
            die;
        }
    }