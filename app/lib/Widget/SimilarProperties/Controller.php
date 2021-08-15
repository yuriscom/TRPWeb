<?php

    namespace Widget\SimilarProperties;

    class Controller extends \Widget\Widget {

        protected function _getDir() {

            return __DIR__;
        }

        public function render(array $options = array()) {

            if (!isset($options['id'])) {
                throw new \Exception("options.id is required");
            }

            $options['num'] = (isset($options['num']) ? $options['num'] : 6);
            $options['access_token'] = (isset($options['access_token']) ? $options['access_token'] : null);
            $viewname = 'index';
            $this->_view->seoLayerName = 'MLS® Listings';

            // TD|PS: JSON encode listing data here and pass to view
            try {
                $cleanedProperties = \Model\Property::getSimilar($options['id'], $options['num'], $options['access_token']);
                foreach ($cleanedProperties as &$cp) {
                    if ($cp['addr_hood']) {
                        $cp['addr_hood'] = str_replace("'", "&#39;", $cp['addr_hood']);
                    }
                    $images = $cp['images'];
                    $cp['images'] = \Helper\ImagesBuilder::buildImages($images);
                }
                $this->_view->properties = $cleanedProperties;
            } catch (\Exception\Fatal $e) {
                $this->_view->error = $e;
                $viewname = 'error';
            }

            return $this->_render($viewname);
        }

    }