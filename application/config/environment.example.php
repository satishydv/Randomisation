<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Environment Configuration Example
|--------------------------------------------------------------------------
|
| This is an example environment configuration file.
| Copy this file to environment.php and update the values according to your environment.
|
| DO NOT commit environment.php to version control!
|
*/

// Environment Settings
$config['environment'] = 'development'; // development, testing, production
$config['debug_mode'] = true;
$config['base_url'] = 'http://localhost/game/';

// Database Configuration
$config['db_hostname'] = 'localhost';
$config['db_username'] = 'root';
$config['db_password'] = '';
$config['db_database'] = 'game';
$config['db_port'] = 3306;

// JWT Configuration
$config['jwt_secret_key'] = 'your-secure-jwt-secret-key-here';
$config['jwt_access_token_expire'] = 900; // 15 minutes in seconds
$config['jwt_refresh_token_expire'] = 604800; // 7 days in seconds

// Security Settings
$config['encryption_key'] = 'your-encryption-key-here';
$config['session_encrypt'] = false; // Set to true in production

// CORS Configuration
$config['cors_allow_origin'] = '*'; // Change to specific domains in production
$config['cors_allow_methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
$config['cors_allow_headers'] = 'Content-Type,Authorization,X-Requested-With';

// Logging Configuration
$config['log_threshold'] = 4; // 0=off, 1=error, 2=debug, 3=info, 4=all
$config['log_path'] = '';

// Cache Configuration
$config['cache_path'] = '';
$config['cache_default_expires'] = 3600; // 1 hour

// Email Configuration (if needed)
$config['email_protocol'] = 'mail';
$config['email_smtp_host'] = '';
$config['email_smtp_user'] = '';
$config['email_smtp_pass'] = '';
$config['email_smtp_port'] = 587;

// Third-party API Keys (if needed)
$config['api_keys'] = array(
    // 'service_name' => 'your-api-key-here',
);

// Feature Flags
$config['features'] = array(
    'user_registration' => true,
    'email_verification' => false,
    'two_factor_auth' => false,
    'api_rate_limiting' => false,
);
