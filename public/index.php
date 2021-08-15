<?php

use Phalcon\Events\Manager as EventsManager;

ini_set("display_errors", 1);
error_reporting(E_ALL);
date_default_timezone_set("America/Toronto");
$start = microtime(true);

try {

    require __DIR__ . "/../app/functions.php";

    /**
     * Read the configuration
     */
    $config = include __DIR__ . "/../app/config/config.php";
    $configLocalAr = (is_file(__DIR__ . "/../app/config/config.local.php") ? include __DIR__ . "/../app/config/config.local.php" : array());
    $config->merge($configLocalAr);

    /**
     * Read auto-loader
     */
    include __DIR__ . "/../app/config/loader.php";

    /**
     * Read services
     */
    include __DIR__ . "/../app/config/services.php";

    /**
     * Handle the request
     */
    $application = new \Phalcon\Mvc\Application($di);

    $eventsManager = new EventsManager();
    $application->setEventsManager($eventsManager);

    $eventsManager->attach(
            "application", function($event, $application) {
                switch ($event->getType()) {
                    case 'boot':
                        \Event\Boot::run();
                        break;
                    case 'beforeStartModule':
                        break;
                    case 'afterStartModule':
                        break;
                    case 'beforeHandleRequest':
                        break;
                    case 'afterHandleRequest':
                        break;
                }
            }
    );

    echo $application->handle()->getContent();
} catch (\Exception $e) {
    echo $e->getMessage();
}

$finish = microtime(true);
