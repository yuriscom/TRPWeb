<?php

    namespace Helper;

    class ArrayFlipper {

        private $_di;

        public function __construct() {

            $this->_di = \Phalcon\DI\FactoryDefault::getDefault();
        }

        public static function multiArrayFlip($array) {

            $newArray = array();
            foreach ($array as $k => $v) {
                //this part flattens City,Hood,TrpPT
                if (is_array($v)) {
                    foreach ($v as $key => $val) {
                        if (is_array($val)) {
                            $newArray[$key] = $v[$key];
                        }
                    }
                } else {
                    //this flips the key value pair for top level elements
                    $newArray[$v] = $array[$k];
                }
            }
            //this flips the city, hood and TrpPT inside arrays
            foreach ($newArray as $k => $v) {
                if (is_array($v) && $k != 'PB') {
                    foreach ($v as $key => $val) {
                        $newArray[$k][$val] = $key;
                        unset ($newArray[$k][$key]);
                    }
                } //this is for the Builder arrays
                elseif (is_array($v) && $k == 'PB') {
                    // first reverse the deepest array
                    foreach ($v[0][1]['Builder'] as $key => $val) {
                        $newArray[$k][0][1]['Builder'][$val] = $key;
                        unset($newArray[$k][0][1]['Builder'][0]);
                        unset($newArray[$k][0][1]['Builder'][1]);
                    }
                    foreach ($v[0] as $key => $val) {
                        // then reverse the id
                        if (!is_array($val)) {
                            $newArray[$k][0][$val] = $key;
                            unset($newArray[$k][0][0]);
                        } // then move the Builders array one to the left to match data
                        else {
                            $newArray[$k][0][1] = call_user_func_array('array_merge', $newArray[$k][0][1]);
                            $newArray[$k][0]['Builders'] = $newArray[$k][0][1];
                            unset($newArray[$k][0][1]);
                        }
                    }
                }
            }
            //make images an array
            foreach ($newArray as $k) {
                if ($k == 'images') {
                    $newArray[$k] = [0];
                }
            }

            return $newArray;
        }

        public static function combine_array_recursive($keys, $vals) {

            $newArray = array();
            $theKeys = reset($keys);
            $newVals = reset($vals);
            do {
                if (is_array($newVals)) {
                    if (key($theKeys) == 'PB') {
                        $newArray[key($keys)] = self::combine_array_recursive($theKeys, $newVals);
                    }
                    if (key($theKeys) == 'images') {
                        $newArray['images'] = $newVals;
                    } else {
                        $newArray[key($keys)] = self::combine_array_recursive($theKeys, $newVals);
                    }
                } else {
                    $newArray[key($keys)] = $newVals;
                }
                $newVals = next($vals);
            } while ($theKeys = next($keys));

            return $newArray;
        }

    }