<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| JWT Configuration
|--------------------------------------------------------------------------
|
| Configuration for JWT authentication
| Loads settings from environment.php for security
|
*/

// Load environment configuration
$CI =& get_instance();
$CI->load->config('environment');

// JWT Secret Key from environment
$config['jwt_secret_key'] = $CI->config->item('jwt_secret_key');

// Token expiration times from environment
$config['access_token_expire'] = $CI->config->item('jwt_access_token_expire');
$config['refresh_token_expire'] = $CI->config->item('jwt_refresh_token_expire');

// JWT Algorithm
$config['jwt_algorithm'] = 'HS256';
