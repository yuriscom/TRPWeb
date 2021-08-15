<?php

use Phalcon\DI\FactoryDefault;
use Phalcon\Mvc\View;
use Phalcon\Mvc\View\Simple as Simple;
use Phalcon\Mvc\Url as UrlResolver;
use Phalcon\Mvc\View\Engine\Volt as VoltEngine;
use Phalcon\Mvc\View\Engine\Php as PhpEngine;
use Phalcon\Session\Adapter\Files as SessionAdapter;
use Phalcon\Events\Manager as EventsManager;
use Phalcon\Http\Request as HttpRequest;
use Phalcon\Cache\Frontend\Output as CacheOutputFrontend;
use Phalcon\Cache\Frontend\None as CacheFrontendNone;
use Phalcon\Cache\Backend\Mongo as CacheMongoBackend;
use Phalcon\Cache\Backend\Memcache as CacheMemcacheBackend;
use Phalcon\Cache\Backend\Memory as CacheMemoryBackend;


/**
 * The FactoryDefault Dependency Injector automatically register the right services providing a full stack framework
 */
$di = new FactoryDefault();

$di->set('router', function() {
            require __DIR__ . '/routes.php';
            return $router;
        });

/**
 * The URL component is used to generate all kind of urls in the application
 */
$di->set('url', function () use ($config) {
    $url = new UrlResolver();
    $url->setBaseUri($config->application->baseUri);

    return $url;
}, true);

/**
 * Setting up the view component
 */
$di->set('view', function () use ($config) {

    $view = new View();

    $view->setViewsDir($config->application->viewsDir);

    $view->registerEngines(array(
        '.volt' => function ($view, $di) use ($config) {

            $volt = new VoltEngine($view, $di);
            $volt->setOptions(array(
                'compiledPath' => $config->application->cacheDir,
                'compiledSeparator' => '_'
            ));

            return $volt;
        },
        '.phtml' => function ($view, $di) use ($config) {
            $phtml = new PhpEngine($view, $di);
            return $phtml;
        }
    ));


//    $eventsManager = new Phalcon\Events\Manager();
//    $eventsManager->attach("view:beforeRender", function($event, $view) use ($config) {
//    });
//    $eventsManager->attach("view:afterRender", function($event, $view) use ($config) {
//    });
//    $view->setEventsManager($eventsManager);

    return $view;
}, true);

$di->set('simpleview', function () use ($config) {

    $view = new Simple();

    $view->setViewsDir($config->application->viewsDir);

    $view->registerEngines(array(
        '.volt' => function ($view, $di) use ($config) {

            $volt = new \Phalcon\Mvc\View\Engine\Volt($view, $di);
            $volt->setOptions(array(
                'compiledPath' => $config->application->cacheDir,
                'compiledSeparator' => '_'
            ));

            return $volt;
        },
        '.phtml' => function ($view, $di) use ($config) {
            $phtml = new \Phalcon\Mvc\View\Engine\Php($view, $di);
            return $phtml;
        }
    ));

    return $view;
}, true);

/**
 * Start the session the first time some component request the session service
 */
$di->setShared('session', function () {
            $session = new SessionAdapter();
            $session->start();

            return $session;
        });


$di['tag'] = function() {
            return new \View\Helper();
        };

$di->set("config", function() use ($config) {
            return $config;
        });

$di->set("debug", function() {
            if (isset($_COOKIE['debugmode'])) {
                return true;
            }
            return false;
        });

$di->set('cookies', function() {
    $cookies = new Phalcon\Http\Response\Cookies();
    $cookies->useEncryption(false);
    return $cookies;
});



$di['dispatcher'] = function() {

    $eventsManager = new Phalcon\Events\Manager();

    $eventsManager->attach('dispatch:beforeDispatchLoop', function($event, $dispatcher) {

        $request = new \Phalcon\Http\Request();
        $sso = $request->get('sso');

        if (isset($sso)) {
            $unencryptedInfo = theredpin_decrypt($sso,'sso');

            $authInfoAr = json_decode($unencryptedInfo, 1);

            $accessToken = isset($authInfoAr['access_token']) ? $authInfoAr['access_token'] : null;
            $refreshToken = isset($authInfoAr['refresh_token']) ? $authInfoAr['refresh_token'] : null;
            $expiresIn = isset($authInfoAr['expires_in']) ? $authInfoAr['expires_in'] : null;
            $tokenType = isset($authInfoAr['token_type']) ? $authInfoAr['token_type'] : null;

            if($accessToken != null) {
                $expiryDate = time() + 3600;
                $dispatcher->setParam('access_token', $accessToken);
                setcookie('access_token',$accessToken, $expiryDate, "/");
                if ($authInfoAr['user']) {
                    $user = $authInfoAr['user'];
                    $dispatcher->setParam('user', $user);
                    setcookie('trp_user_name',$user['first_name'], $expiryDate, "/");
                    setcookie('trp_user_email',$user['email'], $expiryDate, "/");
                    setcookie('trp_user_id',$user['id'], $expiryDate, "/");
                }

                $refreshExpiryDate = $expiryDate + 365 * 86400;
                setcookie('refresh_token',$refreshToken, $refreshExpiryDate, "/");
            }
        }
    });

    $eventsManager->attach('dispatch:beforeDispatch', function($event, $dispatcher) {
        $route = $dispatcher->getDi()->getShared('router')->getMatchedRoute();
        if (method_exists($route, "afterMatch")) {
            $route->afterMatch($dispatcher);
        }
    });

    $eventsManager->attach("dispatch:beforeException", function($event, $dispatcher, $exception) {

        switch ($exception->getCode()) {
            case Phalcon\Mvc\Dispatcher::EXCEPTION_HANDLER_NOT_FOUND:
            case Phalcon\Mvc\Dispatcher::EXCEPTION_ACTION_NOT_FOUND:
                $dispatcher->forward(
                    array(
                        'controller' => 'error',
                        'action'     => '_404',
                    )
                );
                return false;
                break;
            default:
                break;
        }
    });


    $dispatcher = new Phalcon\MVc\Dispatcher();
    $dispatcher->setEventsManager($eventsManager);

    return $dispatcher;
};

$di->set('seo', function() {
    return Seo\Manager::getInstance();
});

//Register the oAuth service as "always shared"
$di->set('oauth', function() {
    $oauth = new \Model\Authentication();
    //p($oauth); die;
    return $oauth;
});


/**
 * The Volt engine uses 'viewCache' as its default caching service,
 * We're overriding and customizing it
 */
$di->set('viewCache', function() use ($config, $di) {
    if ($config->caching->enabled) {
        // Cache data for 2hrs by default
        $frontCache = new CacheOutputFrontend(array(
            "lifetime" => 7200
        ));

        // Mongo cache connection settings
//        $mongoConfig = \Phalcon\DI\FactoryDefault::getDefault()->get("config")['mongodb'];
//        $cache = new CacheMongoBackend($frontCache, array(
//            'server' => $mongoConfig['host'],
//            'db' => $mongoConfig['database'],
//            'collection' => 'PageCache'
//        ));

        // Memcached connection settings
         $cache = new CacheMemcacheBackend($frontCache, array(
             'host' => $config->caching->memcache->host,
             'port' => $config->caching->memcache->port
         ));
    } else {
        $frontCache = new CacheFrontendNone();
        $cache = new CacheMemoryBackend($frontCache); 
    }


    return $cache;
});