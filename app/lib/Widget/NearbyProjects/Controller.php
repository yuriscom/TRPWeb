<?php
    /**
     * Created by PhpStorm.
     * User: petro
     * Date: 2015-01-15
     * Time: 5:34 PM
     */

    namespace Widget\NearbyProjects;


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

            $this->_view->seoLayerName = 'New Preconstruction projects';

            try {
                $projects = \Model\Project::getNearby($options['id'], $options['num'], $options['access_token']);
                foreach ($projects as &$project) {
                    $images = $project['images'];
                    $project['images'] = \Helper\ImagesBuilder::buildImages($images);
                }
                $this->_view->projects = $projects;
            } catch (\Exception\Fatal $e) {
                $this->_view->error = $e;
                $viewname = 'error';
            }

            return $this->_render($viewname);
        }

    }