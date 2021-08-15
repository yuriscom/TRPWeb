<?php

    namespace Seo\Parser;

    class Location extends ParserAbstract {

        public function getSeo() {

            $params = $this->controller->dispatcher->getParams();

            $seoParams = $params;

            if (isset($this->controller->area)) {
                $seoParams['area'] = $this->controller->area['name'];
            }

            return $this->_getSeo($seoParams);
        }

    }
