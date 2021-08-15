<?php

use Phalcon\DI\FactoryDefault\CLI as DI;
/**
 * The FactoryDefault Dependency Injector automatically register the right services providing a full stack framework
 */

$di->set("config", function() use ($config) {
            return $config;
        });
        
$di->set("debug", function() {
            return false;
        });        

