<?php

    namespace Seo\Parser;

    class Agent extends ParserAbstract {

        public function getSeo() {

            $agent = $this->controller->agent;
            $seoParams = array();
            if (isset($agent)) {
                $seoParams['agent_name'] = $agent['firstname'] . ' ' . $agent['lastname'];
            }

            return $this->_getSeo($seoParams);
        }

    }