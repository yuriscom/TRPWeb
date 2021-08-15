<?php

    namespace Seo\Parser;

    class Project extends ParserAbstract {

        public function getSeo() {

            $listing = $this->controller->listing;
            $seoParams = array("project" => $listing['name']);

            if (isset($listing['PB'][0]['Builder'])) {
                $seoParams['builder'] = $listing['PB'][0]['Builder']['name'];
            }
            if (isset($listing['MainCity'])) {
                $seoParams['city'] = $listing['MainCity']['name'];
            }
            if (isset($listing['MainHood'])) {
                $seoParams['hood'] = $listing['MainHood']['name'];
            }

            return $this->_getSeo($seoParams);
        }

    }