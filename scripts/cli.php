<?php

    use Phalcon\DI\FactoryDefault\CLI as CliDI, Phalcon\CLI\Console as ConsoleApp;

    define('VERSION', '1.0.0');

    //Using the CLI factory default services container
    $di = new CliDI();

    // Define path to application directory
    defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(__DIR__ . "/../"));

    /**
     * Register the autoloader and tell it to register the tasks directory
     */
    $loader = new \Phalcon\Loader();
    $loader->registerDirs(array(APPLICATION_PATH . '/scripts'));
    $loader->register();

    require APPLICATION_PATH . "/app/functions.php";

    /**
     * Read the configuration
     */
    $config        = include APPLICATION_PATH . "/app/config/config.php";
    $configLocalAr = (is_file(APPLICATION_PATH . "/app/config/config.local.php") ? include APPLICATION_PATH . "/app/config/config.local.php" : array());
    $config->merge($configLocalAr);

    /**
     * Read services
     */
    include APPLICATION_PATH . "/app/config/services-cli.php";

    /**
     * Read auto-loader
     */
    include APPLICATION_PATH . "/app/config/loader.php";


    //Create a console application
    $console = new ConsoleApp();
    $console->setDI($di);

    /**
     * Process the console arguments
     */
    $arguments = array();
    foreach ($argv as $k => $arg) {
        if ($k == 1) {
            $arguments['task'] = $arg;
        } elseif ($k == 2) {
            $arguments['action'] = $arg;
        } elseif ($k >= 3) {
            $arguments['params'][] = $arg;
        }
    }

    // define global constants for the current task and action
    define('CURRENT_TASK', (isset($argv[1]) ? $argv[1] : null));
    define('CURRENT_ACTION', (isset($argv[2]) ? $argv[2] : null));

    try {
        // handle incoming arguments
        $console->handle($arguments);
    } catch (\Phalcon\Exception $e) {
        echo $e->getMessage();
        exit(255);
    }