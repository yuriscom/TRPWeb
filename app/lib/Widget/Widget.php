<?php

    namespace Widget;

    abstract class Widget {

        protected $_view;
        protected $_viewDir;

        public function __construct() {

            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $this->_view = $di->get('simpleview');

            $this->_viewDir = $this->_getDir() . "/views/";
            $this->_view->setViewsDir($this->_viewDir);
        }

        abstract public function render(array $options = array());

        abstract protected function _getDir();

        protected function _render($viewName = null) {

            if (!$viewName) {
                $viewName = 'index';
            }

            return $this->_view->render($viewName);
        }

    }