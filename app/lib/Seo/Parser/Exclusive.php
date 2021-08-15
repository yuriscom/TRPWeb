<?php

    namespace Seo\Parser;

    class Exclusive extends ParserAbstract {

        public function getSeo() {

            $listing = $this->controller->listing;
            if ($listing['Precon']) {
                if (isset($listing['Precon']['name'])) {
                    $seoParams['project'] = $listing['Precon']['name'];
                }

                if (isset($listing['unit_num'])) {
                    $seoParams['unit'] = $listing['unit_num'];
                }

            } else {
                // exclusives not associated with a precon
                if (isset($listing['addr_full'])) {
                    $seoParams['unit'] = $listing['addr_full'];
                }
                if (isset($listing['addr_city'])) {
                    $seoParams['project'] = $listing['addr_city'];
                }
            }

            if (isset($listing['ExclusivePropertySaleType']['name'])) {
                $seoParams['type'] = $listing['ExclusivePropertySaleType']['name'];
            }

            return $this->_getSeo($seoParams);
        }

    }