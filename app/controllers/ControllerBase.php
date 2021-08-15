<?php

    use Phalcon\Mvc\Controller;

    class ControllerBase extends Controller {

        private $_viewDir;
        private $_di;

        public function initialize() {
            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
            $request = new \Phalcon\Http\Request();
            //$oauth = $this->_di->get('oauth');
            $oauth = new \Model\Authentication();
            $systemTime = round(microtime(true) * 1000);
            $sysDateTime = date("Y-m-d H:i:s");
            $params = $this->dispatcher->getParams();

            $this->isAuthenticated = $oauth->isAuthenticated();
            if ($this->cookies->has('auth_timeout') && ($this->session->get('oauthTimeout') !== $this->cookies->get('auth_timeout'))) {
                $this->session->set('oauthTimeout', $this->cookies->get('auth_timeout')->getValue());
            }

            $this->view->pageLink = "https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
            $this->view->canonicalLink = preg_replace("/(\?.*)/", "", "https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]");
            $this->view->showCanonical = true;
            $this->view->systemTime = $systemTime;

            if ($this->cookies->has('auth_timeout') && (($systemTime - $this->cookies->get('auth_timeout')
                                                                                     ->getValue()) / 1000 > 3600)
            ) {

                $refreshCookie = $this->cookies->get('refresh_token');

                $app = $this->_di['config']['application'];

                //Get the cookies values
                $clientId = $app['clientId'];
                $clientSecret = $app['clientSecret'];

                $refreshToken = $refreshCookie->getValue();
                $accessToken = $oauth->getAccessCookie();

                try {
                    $oauth->refreshToken($clientId, $clientSecret, $refreshToken);
                } catch (\Exception\Fatal $e) {
                    if ($e->getMessage()) {
                        header('Location: /authenticate/?m=t&destination=' + $this->view->pageLink);
                    }
                }

                $expiryDate = time() + 3600;
                $this->cookies->set('access_token', $this->session->get('accessToken'), $expiryDate, "/", null, null, false);
                $expiryDate = $expiryDate + 365 * 86400;
                $this->cookies->set('refresh_token', $this->session->get('refreshToken'), $expiryDate, "/", null, null, false);
                $this->cookies->set('auth_timeout', $this->session->get('oauthTimeout'), $expiryDate, "/", null, null, false);
            }

            $controllerName = $this->dispatcher->getControllerName();
            $viewDirAr = preg_split('/(?=[A-Z])/', $controllerName, -1, PREG_SPLIT_NO_EMPTY);
            $viewDirAr = array_map('strtolower', $viewDirAr);
            $this->_viewDir = implode("-", $viewDirAr);

            $actionName = $this->dispatcher->getActionName();
            $viewFileAr = preg_split('/(?=[A-Z])/', $actionName, -1, PREG_SPLIT_NO_EMPTY);
            $viewFileAr = array_map('strtolower', $viewFileAr);
            $viewName = implode("-", $viewFileAr);

            $this->view->pick($this->_viewDir . '/' . $viewName);

            $landingPage = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

            $httpHost = $_SERVER['HTTP_HOST'];
            $serverProtocol = preg_match("/\w+/", $_SERVER['SERVER_PROTOCOL'], $serverProtocolMatch);
            $parsedServerProtocol = strtolower($serverProtocolMatch[0]);

            $httpReferrer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : null;

            $domainPattern = '/theredpin.com/';
            $referrerHost = parse_url($httpReferrer)['host'];
            if (preg_match($domainPattern, $referrerHost)) {
                $httpReferrer = null;
            }
            if (isset($_SERVER['HTTP_REFERER']) && (preg_match("/^{$parsedServerProtocol}:\/\/{$httpHost}\/(?!blog)/", $_SERVER['HTTP_REFERER'], $match) == 1)) {
            } else {
                $hybridReferrerUrl = null;
            }
            $hybridReferrerUrl = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : null;

            $this->view->hybrid_referrer_url = $hybridReferrerUrl;
            $ua = $this->getUserAgentInfo();

            // Used to set default form values when user lands from external marketing site
            $extUser = $request->get('ext_user');
            if (isset($extUser) && !$this->cookies->has('form')) {
                $this->setFormCookie($extUser);
            }

            // set various cookies
            if (!$this->cookies->has('reporting')) {
                $reportingCookie = array(
                    'reporting-landing-page' => $landingPage,
                    'reporting-referrer' => isset($httpReferrer) ? $httpReferrer : '',
                    'reporting-ip' => $ua['ip'],
                    'reporting-os' => $ua['os'],
                    'reporting-os-ver' => $ua['os_version']);
                $this->cookies->set('reporting', json_encode($reportingCookie), null, '/', null, null, false);
            }
            $this->cookies->set('sysDateTime', $sysDateTime, null, '/', null, null, false);
            if ($params['user']) {
                $this->view->trp_user_name = $params['user']['first_name'];
                $formData = $this->buildFormData($params['user']);
                $this->setFormCookie($formData);
            } elseif ($this->cookies->has('trp_user_name')) {
                $this->view->trp_user_name = $this->cookies->get('trp_user_name')->getValue();
                $this->cookies->set('trp_user_name', $this->view->trp_user_name, null, '/', null, null, false);
            }

            $this->view->debugmode = false;
            if (\Phalcon\DI\FactoryDefault::getDefault()['debug']) {
                $this->view->debugmode = true;
            }
            $env = $this->_di['config']['env'];
            $this->view->appurl = \Http\Request::create()->from('app', '')->generateUrl();
            $this->view->resourceUrl = $this->_di['config']['services']['app'][$env]['resources']['host'];
            $this->view->mesUrl = $this->_di['config']['services']['mes'][$env]['url'];

            $load_modernizr = $this->loadModernizrScript();
            $this->view->load_modernizr = $load_modernizr;
            $this->cookies->send();

        }

        public function render($viewName = null) {

            if (isset($viewName)) {
                $this->view->pick($this->_viewDir . '/' . $viewName);
            }

            $this->view->render(null, null);
        }

        protected function _404() {

            return $this->dispatcher->forward(array('controller' => 'error',
                                                    'action' => '_404',));
        }

        protected function _410() {

            return $this->dispatcher->forward(array('controller' => 'error',
                                                    'action' => '_410',));
        }

        protected function _503() {

            return $this->dispatcher->forward(array('controller' => 'error',
                                                    'action' => '_503',));
        }

        protected function buildProfileBreadcrumbs() {

            $listing = $this->listing;

            $seoBreadCrumbs = array();
            if (!empty($listing['MainProvince'])) {
                $province = new stdClass();
                $province->name = $listing['MainProvince']['name'];
                $province->url = $listing['MainProvince']['url'];
                array_push($seoBreadCrumbs, $province);
            }
            if (!empty($listing['MainRegion'])) {
                $region = new stdClass();
                $region->name = $listing['MainRegion']['name'];
                $region->url = $listing['MainRegion']['url'];
                array_push($seoBreadCrumbs, $region);
            }
            if (!empty($listing['MainCity'])) {
                $city = new stdClass();
                $city->name = $listing['MainCity']['name'];
                $city->url = $listing['MainCity']['url'];
                array_push($seoBreadCrumbs, $city);
            }
            if (!empty($listing['MainHood'])) {
                $hood = new stdClass();
                $hood->name = $listing['MainHood']['name'];
                $hood->url = $listing['MainHood']['url'];
                array_push($seoBreadCrumbs, $hood);
            }

            return $seoBreadCrumbs;
        }

        protected function buildFormData($userData) {
            $formData = array();
            $formData['name'] = $userData['first_name'] . ' ' . $userData['last_name'];
            $formData['email'] = $userData['email'];
            $formData['phone'] = $userData['phone'];
            return json_encode($formData);
        }

        protected function setFormCookie($formData) {
            $this->cookies->set('form', $formData, null, "/", null, null, false);
        }

        protected function getUserAgentInfo() {

            $detector = new \Event\AgentDetector();
            $userAgent = $detector->browser_detection('full');
            isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] : $ip = $_SERVER['REMOTE_ADDR'];

            $uaTrackingBehavior = array('ip' => $ip,
                                        'browser' => $userAgent[0],
                                        'browser_version' => $userAgent[1],
                                        'os' => $userAgent[5],
                                        'os_version' => $userAgent[6]);

            return $uaTrackingBehavior;
        }

        protected function loadModernizrScript() {

            return <<<'EOD'
        <script>
/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransitions-touch-mq-cssclasses-teststyles-testprop-testallprops-prefixes-domprefixes-css_filters
 */
;window.Modernizr=function(a,b,c){function A(a){j.cssText=a}function B(a,b){return A(m.join(a+";")+(b||""))}function C(a,b){return typeof a===b}function D(a,b){return!!~(""+a).indexOf(b)}function E(a,b){for(var d in a){var e=a[d];if(!D(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function F(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:C(f,"function")?f.bind(d||b):f}return!1}function G(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return C(b,"string")||C(b,"undefined")?E(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),F(e,b,c))}var d="2.8.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b)&&c(b).matches||!1;var d;return w("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},y={}.hasOwnProperty,z;!C(y,"undefined")&&!C(y.call,"undefined")?z=function(a,b){return y.call(a,b)}:z=function(a,b){return b in a&&C(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:w(["@media (",m.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},q.csstransitions=function(){return G("transition")};for(var H in q)z(q,H)&&(v=H.toLowerCase(),e[v]=q[H](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)z(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},A(""),i=k=null,e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.mq=x,e.testProp=function(a){return E([a])},e.testAllProps=G,e.testStyles=w,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document),Modernizr.addTest("cssfilters",function(){var a=document.createElement("div");return a.style.cssText=Modernizr._prefixes.join("filter:blur(2px); "),!!a.style.length&&(document.documentMode===undefined||document.documentMode>9)});
        </script>
EOD;
        }

        /**
         * Enable viewCache for this controller/action if conditions are met (eg user NOT logged in)
         * Uses URL (without params) as unique cache key
         * $timeout cache expiration in seconds, defaults to 7200 (2hrs)
         */
        protected function viewCacheByUrlEnable($timeout = 7200) {
            return false;
            $oauth = $this->_di->get('oauth');
            // TODO: change this condition if needed to make sure user is not logged in
            if (!$oauth->isAuthenticated()) {
                // cache the entire view with 2hr timeout and use URL (no params) as the key
                // order is important, 1.enable cache 2.check cache exists
                $cacheKey = $this->router->getRewriteUri();

                if ($this->viewCache->exists('error-cache')) {
                    $this->viewCache->delete($cacheKey);
                    $this->viewCache->delete('error-cache');
                } else {
                    $this->view->cache(array('timeout' => $timeout,
                                             'key' => $cacheKey));
                }
            }
        }

        /**
         * Whether this page has already been cached (and not expired)
         * and if conditions are met (eg user NOT logged in)
         * Uses URL (without params) as unique cache key
         */
        protected function viewCacheByUrlExists() {
            return false;
            $oauth = $this->_di->get('oauth');
            // TODO: change this condition if needed to make sure user is not logged in
            if (!$oauth->isAuthenticated()) {
                $cacheKey = $this->router->getRewriteUri();

                return $this->viewCache->exists($cacheKey);
            } else {
                return false;
            }
        }
    }
