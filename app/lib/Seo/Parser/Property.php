<?php

    namespace Seo\Parser;

    class Property extends ParserAbstract {

        public function getSeo() {

            $listing = $this->controller->listing;

            if (isset($listing['addr_province'])) {
                $seoParams['province'] = $listing['addr_province'];
            }
            if (isset($listing['MainHood'])) {
                $seoParams['hood'] = $listing['MainHood']['name'];
            }
            if (isset($listing['MainCity'])) {
                $seoParams['city'] = $listing['MainCity']['name'];
            }
            if (isset($listing['mls_num'])) {
                $seoParams['mls'] = $listing['mls_num'];
            }
            if (isset($listing['addr_postal_code'])) {
                $seoParams['postal'] = $listing['addr_postal_code'];
            }
            if (isset($listing['addr_full'])) {
                $seoParams['address'] = $listing['addr_full'];
            }

            return $this->_getSeo($seoParams);
        }

    }