<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/userguide3/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

// API Routes
$route['auth/register'] = 'auth/register';
$route['auth/login'] = 'auth/login';
$route['auth/refresh'] = 'auth/refresh';
$route['auth/logout'] = 'auth/logout';
$route['auth/verify'] = 'auth/verify';
$route['auth/profile'] = 'auth/profile';

// Wallet Routes (JWT protected)
$route['wallet/create'] = 'wallet/create';
$route['wallet/list'] = 'wallet/list';
$route['wallet/get/(:any)'] = 'wallet/get/$1';
$route['wallet/update/(:any)'] = 'wallet/update/$1';
$route['wallet/delete/(:any)'] = 'wallet/delete/$1';
$route['wallet/balance'] = 'wallet/balance';
$route['wallet/status'] = 'wallet/status';
$route['wallet/transactions'] = 'wallet/transactions';
$route['wallet/deposit'] = 'wallet/deposit';

// Game Routes
$route['game1/play'] = 'game/play_game1';
$route['game2/play'] = 'game/play_game2';
$route['game3/play'] = 'game/play_game3';
$route['game/history'] = 'game/history';
$route['game/user-history'] = 'game/user_history';

// Queue Routes
$route['game/active-session'] = 'game/active_session';
$route['game/join-queue'] = 'game/join_queue';
$route['game/queue-status'] = 'game/queue_status';
$route['game/queue-results'] = 'game/queue_results';
$route['game/user-result'] = 'game/user_result';
$route['game/process-queue'] = 'game/process_queue';
$route['game/force-process'] = 'game/force_process';
$route['game/waiting-status'] = 'game/waiting_status';
$route['game/auto-process'] = 'game/auto_process';
$route['game/check-and-process'] = 'game/check_and_process';
$route['game/timer-result'] = 'game/timer_result';
