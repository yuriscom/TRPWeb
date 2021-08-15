<?php

    namespace Seo\Parser;

    abstract class ParserAbstract {

        protected $controller;
        protected $di;

        public function __construct(\Phalcon\Mvc\Controller $controller) {

            $this->controller = $controller;
            $this->di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        protected function _getSeo(array $params = array()) {

            $dispatchedParams = $this->controller->dispatcher->getParams();
            $seo = array();
            if (isset($dispatchedParams['seoName'])) {
                $seoManager = $this->di['seo'];
                $seo = $seoManager->parse($dispatchedParams['seoName'], $params);
            }

            return $seo;
        }

        abstract public function getSeo();
    }
