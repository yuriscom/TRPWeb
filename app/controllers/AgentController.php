<?php

    class AgentController extends ControllerBase {

        public function initialize() {

            parent::initialize();
            $this->applyLink = 'https://theredpin.bamboohr.com/jobs/view.php?id=75';
        }

        public function indexAction() {
            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();
            $this->view->landing_action = $this->dispatcher->getActionName();
            $this->view->listing_type = 'agents';

            $agents = \Model\Agents::getAgents();

            // Responsive Images
            foreach($agents as &$agent) {
                $agent['thumb_image_src'] = \Helper\ImagesBuilder::buildImage($agent['thumb_image_src'], '/assets/graphics/default-agent-thumbnail-large.png');
            }

            $this->view->agents = $agents;

            $seoBreadCrumbs = array('/' => 'Home', '#' => 'Our Agents');
            $this->view->breadcrumbs = $seoBreadCrumbs;

            $this->view->footerLink = $this->applyLink;
            $this->view->gaLabel = 'Agents';

            $styles = '/assets/styles';
            $this->view->styles = array($styles . '/pages/agents.css');
            $scripts = '/assets/scripts';
            $this->view->footer_scripts = array($scripts . '/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function agentProfileAction() {
            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();
            $this->view->landing_action = $this->dispatcher->getActionName();
            $this->view->listing_type = 'agents';
            $this->view->gaLabel = 'Agents';

            $params = $this->dispatcher->getParams();
            $agentWebID = $params['agent'];

            $agent = $this->agent = \Model\Agents::getAgent($agentWebID);

            if (!isset($agent['id'])) {
                return $this->_404();
            }

            // Responsive Images
            $agent['profile_image_src'] = \Helper\ImagesBuilder::buildImage($agent['profile_image_src']);
            $agent['thumb_image_src'] = \Helper\ImagesBuilder::buildImage($agent['thumb_image_src']);

            $agent['AgentClientsCount'] = count($agent['AgentClients']);
            $agent['AgentClients'] = array_chunk($agent['AgentClients'], 2);
            $this->view->agent = $agent;
            $seoBreadCrumbs = array('/' => 'Home', '/real-estate-agents/' => 'Our Agents', '#' => $agent['firstname'] . ' ' . $agent['lastname']);
            $this->view->breadcrumbs = $seoBreadCrumbs;

            $this->view->gaLabel = 'Agents';

            $styles = '/assets/styles';
            $this->view->styles = array($styles . '/pages/agent-profile.css');
            $scripts = '/assets/scripts';
            $this->view->footer_scripts = array($scripts . '/pages/agent-profile.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

        public function hiringAction() {
            // caching
            $this->viewCacheByUrlEnable();
            if ($this->viewCacheByUrlExists()) {
                return;
            }

            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();
            $this->view->landing_action = $this->dispatcher->getActionName();
            $this->view->listing_type = 'agents';

            $seoBreadCrumbs = array('/' => 'Home', '/real-estate-agents/' => 'Our Agents', '#' => 'Hiring');
            $this->view->breadcrumbs = $seoBreadCrumbs;

            $this->view->applyLink = $this->applyLink;
            $this->view->gaLabel = 'Agents';

            $styles = '/assets/styles';
            $this->view->styles = array($styles . '/pages/agents-hiring.css');
            $scripts = '/assets/scripts';
            $this->view->footer_scripts = array($scripts . '/pages/content.js');
            $this->view->seo = \Seo\Parser\Factory::getParser($this)->getSeo();
        }

    }