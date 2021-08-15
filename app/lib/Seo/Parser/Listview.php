<?php

    namespace Seo\Parser;

    class Listview extends ParserAbstract {

        public function getSeo() {

            $params = $this->controller->dispatcher->getParams();

            $seoParams = $params;

            if (isset($params['area']) && isset($params[$params['area']])) {
                if ($this->controller->location) {
                    $area = $this->controller->location;
                } else {
                    $area = $params['area'];
                    try {
                        $class = "\\Model\\" . ucfirst($area);
                        $area = $class::getByWebId($params[$area]);
                    } catch (Exception $e) {

                    }
                }

                $seoParams['area'] = $area['name'];
            }

            if (isset($params['builder'])) {
                try {
                    $builder = \Model\Builder::getByWebId($params['builder']);
                    $seoParams['builder'] = $builder['name'];
                } catch (Exception $e) {
                    return $this->_503();
                }
            }

            if (isset($params['min_price'])) {
                $seoParams['min_price'] = '$' . number_format($params['min_price']);
            }

            if (isset($params['max_price'])) {
                $seoParams['max_price'] = '$' . number_format($params['max_price']);
            }

            if (isset($params['num'])) {
                $seoParams['num'] = number_format($params['num']);
            }

            if (isset($params['page'])) {
                $seoParams['page_title'] = '- Page ' . number_format($params['page']);
                $seoParams['page_description'] = '(Page ' . number_format($params['page']) . ')';
            }

            $seoParams['ist_title'] = ($this->controller->ist) ? $this->controller->ist : 'Homes';
            $seoParams['ist_description'] = ($this->controller->ist) ? $this->controller->ist : 'MLS Listings';

            return $this->_getSeo($seoParams);
        }

    }
