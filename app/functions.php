<?php

function p($out_string, $immediate_output = 0, $mystyle = 0) {
    $trace = debug_backtrace();
    $curTrace = $trace[0];
    if (!$mystyle) {
        echo "\n<p style=\"margin: 1px 0; font: 7.5pt tahoma; color: red;\">DEBUGGING File " . $curTrace['file'] . " line " . $curTrace['line'] . "</p>";
    }
    if ((is_array($out_string)) || (is_object($out_string))) {
        pa($out_string);
    } else {
        if ($mystyle) {
            echo ($out_string);
        } else {
            echo ("\n<p style=\"margin: 1px 0; font: 7.5pt tahoma; color: red;\">]" . $out_string . "[</p>");
        }
    }

    if ($immediate_output) {
        ob_flush();
        flush();
    }
}

function pa($out_array) {
    echo "\n<pre style=\"margin: 2px 0; font:7.5pt tahoma; color:green;\">";
    echo "\n";
    print_r($out_array);
    echo "\n</pre>";
}

function debug() {
    $short_debug = array();
    foreach (debug_backtrace() as $key => $debug) {
        if ($key == 0) {
            continue;
        }

        if (isset($debug['file'])) {
            $short_debug[$key - 1]['file'] = $debug['file'];
        }

        if (isset($debug['line'])) {
            $short_debug[$key - 1]['line'] = $debug['line'];
        }

        if (isset($debug['function'])) {
            $short_debug[$key - 1]['function'] = $debug['function'];
        }

        if (isset($debug['class'])) {
            $short_debug[$key - 1]['class'] = $debug['class'];
        }
    }
    return $short_debug;
}

function trim_subdomain($host) {
    $trimmedHost = $host;
    if (substr_count($host, '.') > 1) {
        $last = strrpos($host, '.');
        $next_to_last = strrpos($host, '.', $last - strlen($host) - 1);
        $trimmedHost = substr($host, $next_to_last + 1);
    }
    return $trimmedHost;
}

function cond($condition, $trueOutput, $falseOutput) {
    if ($condition) {
        return $trueOutput;
    }

    return $falseOutput;
}

function sendRawRequest($url, $method = 'GET', $data = array()) {
    $postdata = array();
    if (is_array($data) || is_object($data)) {
        $postdata = json_encode($data);
    } elseif (is_object(json_decode($data))) {
        $postdata = $data;
    } else {
        throw new \Exception("Wrong data.");
    }


    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    switch (strtolower($method)) {
        case 'get':
            break;
        case 'post':
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
            break;
        default:
            throw new Exception("Wrong method specified: " . $method);
            break;
    }

    $output = curl_exec($ch);
    curl_close($ch);

    return $output;


    /*
      // handle error; error output
      if (curl_getinfo($ch, CURLINFO_HTTP_CODE) !== 200) {

      var_dump($output);
      }
     * 
     */
}

/*
  function sendRawRequest($url, $method = 'GET', $data = array(), $headers = array('Content-type: application/x-www-form-urlencoded')) {
  $postdata = array();
  if (is_array($data) || is_object($data)) {
  $postdata = json_encode($data);
  } elseif (is_object(json_decode($data))) {
  $postdata = $data;
  } else {
  throw new \Exception("Wrong data.");
  }

  $context = stream_context_create(array
  (
  'http' => array(
  'method' => $method,
  'header' => $headers,
  'content' => $postdata
  )
  ));

  return file_get_contents($url, false, $context);
  }
 * 
 */

/**
 *
 * Convert an object to an array
 *
 * @param    object  $object The object to convert
 * @reeturn      array
 *
 */
function objectToArray($object) {
    if (!is_object($object) && !is_array($object)) {
        return $object;
    }

    if (is_object($object)) {
        $object = get_object_vars($object);
    }

    return array_map('objectToArray', $object);
}

function array_first($array) {
    return isset($array[0]) ? $array[0] : null;
}

function array_end($array) {
    return $array[count($array) - 1];
}

function theredpin_encrypt($sData, $sKey = 'mysecretkey') {
    $sResult = '';
    for ($i = 0; $i < strlen($sData); $i++) {
        $sChar = substr($sData, $i, 1);
        $sKeyChar = substr($sKey, ($i % strlen($sKey)) - 1, 1);
        $sChar = chr(ord($sChar) + ord($sKeyChar));
        $sResult .= $sChar;
    }
    return encode_base64($sResult);
}

function theredpin_decrypt($sData, $sKey = 'mysecretkey') {
    $sResult = '';
    $sData = decode_base64($sData);
    for ($i = 0; $i < strlen($sData); $i++) {
        $sChar = substr($sData, $i, 1);
        $sKeyChar = substr($sKey, ($i % strlen($sKey)) - 1, 1);
        $sChar = chr(ord($sChar) - ord($sKeyChar));
        $sResult .= $sChar;
    }
    return $sResult;
}

function encode_base64($sData) {
    $sBase64 = base64_encode($sData);
    return strtr($sBase64, '+/', '-_');
}

function decode_base64($sData) {
    $sBase64 = strtr($sData, '-_', '+/');
    return base64_decode($sBase64);
}

function convertToWebId($name) {
    // replace all non-alphanumeric chars with space
    $cleanStr = preg_replace('/\W/u', ' ', $name);
    // trim spaces at beginning or end of string
    $cleanStr = trim($cleanStr);
    // collapse each sequenece of whitespace to a single space and replace all spaces by a dash(-)
    $cleanStr = preg_replace('/\s+/u', '-', $cleanStr);
    // ensure everything's in lowercase
    $cleanStr = mb_strtolower($cleanStr);

    return $cleanStr;
}

function convertToName($webid) {
    // replace all non-alphanumeric chars with space
    $cleanStr = preg_replace('/\W/u', ' ', $webid);
    // trim spaces at beginning or end of string
    $cleanStr = trim($cleanStr);
    // capitalizes first letter of each word
    $cleanStr = ucwords($cleanStr);

    return $cleanStr;
}


if (!function_exists('http_build_url')) {
    define('HTTP_URL_REPLACE', 1); // Replace every part of the first URL when there's one of the second URL
    define('HTTP_URL_JOIN_PATH', 2); // Join relative paths
    define('HTTP_URL_JOIN_QUERY', 4); // Join query strings
    define('HTTP_URL_STRIP_USER', 8); // Strip any user authentication information
    define('HTTP_URL_STRIP_PASS', 16); // Strip any password authentication information
    define('HTTP_URL_STRIP_AUTH', 32); // Strip any authentication information
    define('HTTP_URL_STRIP_PORT', 64); // Strip explicit port numbers
    define('HTTP_URL_STRIP_PATH', 128); // Strip complete path
    define('HTTP_URL_STRIP_QUERY', 256); // Strip query string
    define('HTTP_URL_STRIP_FRAGMENT', 512); // Strip any fragments (#identifier)
    define('HTTP_URL_STRIP_ALL', 1024); // Strip anything but scheme and host
// Build an URL
// The parts of the second URL will be merged into the first according to the flags argument.
//
// @param mixed (Part(s) of) an URL in form of a string or associative array like parse_url() returns
// @param mixed Same as the first argument
// @param int A bitmask of binary or'ed HTTP_URL constants (Optional)HTTP_URL_REPLACE is the default
// @param array If set, it will be filled with the parts of the composed url like parse_url() would return

    function http_build_url($url, $parts = array(), $flags = HTTP_URL_REPLACE, &$new_url = false) {
        $keys = array('user', 'pass', 'port', 'path', 'query', 'fragment');
// HTTP_URL_STRIP_ALL becomes all the HTTP_URL_STRIP_Xs
        if ($flags & HTTP_URL_STRIP_ALL) {
            $flags |= HTTP_URL_STRIP_USER;
            $flags |= HTTP_URL_STRIP_PASS;
            $flags |= HTTP_URL_STRIP_PORT;
            $flags |= HTTP_URL_STRIP_PATH;
            $flags |= HTTP_URL_STRIP_QUERY;
            $flags |= HTTP_URL_STRIP_FRAGMENT;
        }
// HTTP_URL_STRIP_AUTH becomes HTTP_URL_STRIP_USER and HTTP_URL_STRIP_PASS
        else if ($flags & HTTP_URL_STRIP_AUTH) {
            $flags |= HTTP_URL_STRIP_USER;
            $flags |= HTTP_URL_STRIP_PASS;
        }
// Parse the original URL
        $parse_url = parse_url($url);
// Scheme and Host are always replaced
        if (isset($parts['scheme']))
            $parse_url['scheme'] = $parts['scheme'];
        if (isset($parts['host']))
            $parse_url['host'] = $parts['host'];
// (If applicable) Replace the original URL with it's new parts
        if ($flags & HTTP_URL_REPLACE) {
            foreach ($keys as $key) {
                if (isset($parts[$key]))
                    $parse_url[$key] = $parts[$key];
            }
        }
        else {
// Join the original URL path with the new path
            if (isset($parts['path']) && ($flags & HTTP_URL_JOIN_PATH)) {
                if (isset($parse_url['path']))
                    $parse_url['path'] = rtrim(str_replace(basename($parse_url['path']), '', $parse_url['path']), '/') . '/' . ltrim($parts['path'], '/');
                else
                    $parse_url['path'] = $parts['path'];
            }
// Join the original query string with the new query string
            if (isset($parts['query']) && ($flags & HTTP_URL_JOIN_QUERY)) {
                if (isset($parse_url['query']))
                    $parse_url['query'] .= '&' . $parts['query'];
                else
                    $parse_url['query'] = $parts['query'];
            }
        }
// Strips all the applicable sections of the URL
// Note: Scheme and Host are never stripped
        foreach ($keys as $key) {
            if ($flags & (int) constant('HTTP_URL_STRIP_' . strtoupper($key)))
                unset($parse_url[$key]);
        }
        $new_url = $parse_url;
        return
                ((isset($parse_url['scheme'])) ? $parse_url['scheme'] . '://' : '')
                . ((isset($parse_url['user'])) ? $parse_url['user'] . ((isset($parse_url['pass'])) ? ':' . $parse_url['pass'] : '') . '@' : '')
                . ((isset($parse_url['host'])) ? $parse_url['host'] : '')
                . ((isset($parse_url['port'])) ? ':' . $parse_url['port'] : '')
                . ((isset($parse_url['path'])) ? $parse_url['path'] : '')
                . ((isset($parse_url['query'])) ? '?' . $parse_url['query'] : '')
                . ((isset($parse_url['fragment'])) ? '#' . $parse_url['fragment'] : '')
        ;
    }

} 

function cartesian($input, $callback = null) {
    $result = array();

    while (list($key, $values) = each($input)) {
        // If a sub-array is empty, it doesn't affect the cartesian product
        if (empty($values)) {
            continue;
        }
        // Seeding the product array with the values from the first sub-array
        if (empty($result)) {
            foreach($values as $value) {
                $result[] = array($key => $value);
            }
        }
        else {
            
            // Second and subsequent input sub-arrays work like this:
            //   1. In each existing array inside $product, add an item with
            //      key == $key and value == first item in input sub-array
            //   2. Then, for each remaining item in current input sub-array,
            //      add a copy of each existing array inside $product with
            //      key == $key and value == first item of input sub-array

            // Store all items to be added to $product here; adding them
            // inside the foreach will result in an infinite loop
            $append = array();

            foreach($result as &$product) {
                // Do step 1 above. array_shift is not the most efficient, but
                // it allows us to iterate over the rest of the items with a
                // simple foreach, making the code short and easy to read.
                $product[$key] = array_shift($values);
                
                if ($callback && is_callable($callback)) {
                    if (!$isOk = call_user_func($callback, $product)) {
                        array_shift($result);
                    }
                }
                

                // $product is by reference (that's why the key we added above
                // will appear in the end result), so make a copy of it here
                $copy = $product;

                // Do step 2 above.
                foreach($values as $item) {
                    $copy[$key] = $item;
                    
                    if ($callback) {
                        if(is_callable($callback)) {
                            if (!$isOk = call_user_func($callback, $copy)) {
                                continue;
                            }
                        }
                    }
                    $append[] = $copy;
                }

                // Undo the side effecst of array_shift
                array_unshift($values, $product[$key]);
                
            }

            // Out of the foreach, we can add to $results now
            $result = array_merge($result, $append);
        }
    }

    return $result;
}

function endsWith($string, $end) {
    return $end === "" || (($temp = strlen($string) - strlen($end)) >= 0 && strpos($string, $end, $temp) !== FALSE);
}