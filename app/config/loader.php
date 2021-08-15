<?php

$loader = new \Phalcon\Loader();

/**
 * We're a registering a set of directories taken from the configuration file
 */
$loader->registerDirs(
    array(
        $config->application->controllersDir
    )
)->register();

set_include_path(''
        . $config->application->applicationDir
        . PATH_SEPARATOR . get_include_path());

define("ROOT_PATH", realpath(__DIR__."/../../"));

function my_autoloader($class_name) {
    $filepath = get_autoload_file($class_name);
    
    if (!stream_resolve_include_path($filepath)) {
        return false;
//        throw new Exception("Autoloader couldn't find file path for ".$class_name);
    }
    
    require $filepath;
}

function get_autoload_file($class_name) {
    $pathAr = explode("\\",$class_name);
    return "lib/".join("/",$pathAr) . '.php';
}

spl_autoload_register('my_autoloader');
