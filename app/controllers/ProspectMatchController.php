<?php

    class ProspectMatchController extends ControllerBase {

        public function initialize() {

            parent::initialize();
        }

        public function indexAction() {

            header("Location: http://res.theredpin.com/account/prospect-match", true, 301);
        }

    }