<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Wallet extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('Wallet_model');
		$this->load->model('Transaction_model');
		$this->load->library('jwt');
	}

	private function get_auth_user() {
		$headers = function_exists('getallheaders') ? getallheaders() : array();
		$auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');
		if (empty($auth_header) || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
			return false;
		}
		$token = $matches[1];
		$payload = $this->jwt->validate_token($token);
		return $payload ?: false;
	}

	private function json_input() {
		$input = json_decode($this->input->raw_input_stream, true);
		return (json_last_error() === JSON_ERROR_NONE) ? $input : null;
	}

	public function create() {
		header('Content-Type: application/json');
		$user = $this->get_auth_user();
		if (!$user) {
			$this->output->set_status_header(401)->set_output(json_encode(array('status' => 'error', 'message' => 'Unauthorized')));
			return;
		}
		$input = $this->json_input();
		if ($input === null) {
			$this->output->set_status_header(400)->set_output(json_encode(array('status' => 'error', 'message' => 'Invalid JSON')));
			return;
		}
		// Basic validation
		$amount = isset($input['amount']) ? (float)$input['amount'] : 0;
		$mode = isset($input['mode_of_payment']) ? trim($input['mode_of_payment']) : '';
		$transaction_id = isset($input['transaction_id']) ? trim($input['transaction_id']) : null;
		$status = isset($input['status']) ? trim($input['status']) : 'active';
		$receipt_path = isset($input['receipt_path']) ? trim($input['receipt_path']) : null;
		if ($amount <= 0 || $mode === '' || !in_array($status, array('active','blocked'))) {
			$this->output->set_status_header(400)->set_output(json_encode(array('status' => 'error', 'message' => 'Validation failed')));
			return;
		}
		// Generate unique order_number: yyyymmddHHMMSS + last4 user_id + random
		$base = date('YmdHis') . substr($user['user_id'], -4);
		$order_number = $base;
		$attempts = 0;
		while ($this->Wallet_model->order_number_exists($order_number) && $attempts < 5) {
			$order_number = $base . '-' . substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), 0, 3);
			$attempts++;
		}
		$data = array(
			'user_id' => $user['user_id'],
			'amount' => $amount,
			'mode_of_payment' => $mode,
			'transaction_id' => $transaction_id,
			'status' => $status,
			'receipt_path' => $receipt_path,
			'order_number' => $order_number
		);
		$ok = $this->Wallet_model->create($data);
		if ($ok) {
			$this->output->set_status_header(201)->set_output(json_encode(array('status' => 'success', 'data' => $this->Wallet_model->get_by_order_number($order_number))));
		} else {
			$this->output->set_status_header(500)->set_output(json_encode(array('status' => 'error', 'message' => 'Create failed')));
		}
	}

	public function list() {
		header('Content-Type: application/json');
		$user = $this->get_auth_user();
		if (!$user) {
			$this->output->set_status_header(401)->set_output(json_encode(array('status' => 'error', 'message' => 'Unauthorized')));
			return;
		}
		$limit = (int)$this->input->get('limit') ?: 50;
		$offset = (int)$this->input->get('offset') ?: 0;
		$rows = $this->Wallet_model->list_by_user($user['user_id'], $limit, $offset);
		$this->output->set_status_header(200)->set_output(json_encode(array('status' => 'success', 'data' => $rows)));
	}

	public function get($order_number) {
		header('Content-Type: application/json');
		$user = $this->get_auth_user();
		if (!$user) {
			$this->output->set_status_header(401)->set_output(json_encode(array('status' => 'error', 'message' => 'Unauthorized')));
			return;
		}
		$row = $this->Wallet_model->get_by_order_number($order_number);
		if (!$row || $row['user_id'] !== $user['user_id']) {
			$this->output->set_status_header(404)->set_output(json_encode(array('status' => 'error', 'message' => 'Not found')));
			return;
		}
		$this->output->set_status_header(200)->set_output(json_encode(array('status' => 'success', 'data' => $row)));
	}

	public function update($order_number) {
		header('Content-Type: application/json');
		$user = $this->get_auth_user();
		if (!$user) {
			$this->output->set_status_header(401)->set_output(json_encode(array('status' => 'error', 'message' => 'Unauthorized')));
			return;
		}
		$existing = $this->Wallet_model->get_by_order_number($order_number);
		if (!$existing || $existing['user_id'] !== $user['user_id']) {
			$this->output->set_status_header(404)->set_output(json_encode(array('status' => 'error', 'message' => 'Not found')));
			return;
		}
		$input = $this->json_input();
		if ($input === null) {
			$this->output->set_status_header(400)->set_output(json_encode(array('status' => 'error', 'message' => 'Invalid JSON')));
			return;
		}
		$up = array();
		if (isset($input['amount'])) $up['amount'] = (float)$input['amount'];
		if (isset($input['mode_of_payment'])) $up['mode_of_payment'] = trim($input['mode_of_payment']);
		if (isset($input['transaction_id'])) $up['transaction_id'] = trim($input['transaction_id']);
		if (isset($input['status']) && in_array($input['status'], array('active','blocked'))) $up['status'] = $input['status'];
		if (isset($input['receipt_path'])) $up['receipt_path'] = trim($input['receipt_path']);
		if (empty($up)) {
			$this->output->set_status_header(400)->set_output(json_encode(array('status' => 'error', 'message' => 'Nothing to update')));
			return;
		}
		$ok = $this->Wallet_model->update_by_order_number($order_number, $up);
		if ($ok) {
			$this->output->set_status_header(200)->set_output(json_encode(array('status' => 'success', 'data' => $this->Wallet_model->get_by_order_number($order_number))));
		} else {
			$this->output->set_status_header(500)->set_output(json_encode(array('status' => 'error', 'message' => 'Update failed')));
		}
	}

	public function delete($order_number) {
		header('Content-Type: application/json');
		$user = $this->get_auth_user();
		if (!$user) {
			$this->output->set_status_header(401)->set_output(json_encode(array('status' => 'error', 'message' => 'Unauthorized')));
			return;
		}
		$existing = $this->Wallet_model->get_by_order_number($order_number);
		if (!$existing || $existing['user_id'] !== $user['user_id']) {
			$this->output->set_status_header(404)->set_output(json_encode(array('status' => 'error', 'message' => 'Not found')));
			return;
		}
		$ok = $this->Wallet_model->delete_by_order_number($order_number);
		if ($ok) {
			$this->output->set_status_header(200)->set_output(json_encode(array('status' => 'success', 'message' => 'Deleted successfully')));
		} else {
			$this->output->set_status_header(500)->set_output(json_encode(array('status' => 'error', 'message' => 'Delete failed')));
		}
	}

	public function balance() {
		header('Content-Type: application/json');
		$user = $this->get_auth_user();
		if (!$user) {
			$this->output->set_status_header(401)->set_output(json_encode(array('status' => 'error', 'message' => 'Unauthorized')));
			return;
		}
		
		$balance = $this->Wallet_model->get_balance($user['user_id']);
		$has_wallet = $this->Wallet_model->user_has_wallet($user['user_id']);
		
		$this->output->set_status_header(200)->set_output(json_encode(array(
			'status' => 'success',
			'data' => array(
				'user_id' => $user['user_id'],
				'balance' => (float)$balance,
				'has_wallet' => $has_wallet,
				'currency' => 'USD'
			)
		)));
	}

	public function transactions() {
		header('Content-Type: application/json');
		$user = $this->get_auth_user();
		if (!$user) {
			$this->output->set_status_header(401)->set_output(json_encode(array('status' => 'error', 'message' => 'Unauthorized')));
			return;
		}
		
		$limit = (int)$this->input->get('limit') ?: 50;
		$offset = (int)$this->input->get('offset') ?: 0;
		$transaction_type = $this->input->get('type'); // CREDIT or DEBIT
		
		if ($transaction_type && in_array($transaction_type, array('CREDIT', 'DEBIT'))) {
			$transactions = $this->Transaction_model->get_by_user_and_type($user['user_id'], $transaction_type, $limit, $offset);
		} else {
			$transactions = $this->Transaction_model->get_by_user($user['user_id'], $limit, $offset);
		}
		
		$this->output->set_status_header(200)->set_output(json_encode(array(
			'status' => 'success',
			'data' => $transactions,
			'pagination' => array(
				'limit' => $limit,
				'offset' => $offset,
				'total_transactions' => $this->Transaction_model->get_transaction_count($user['user_id'])
			)
		)));
	}

	public function deposit() {
		header('Content-Type: application/json');
		$user = $this->get_auth_user();
		if (!$user) {
			$this->output->set_status_header(401)->set_output(json_encode(array('status' => 'error', 'message' => 'Unauthorized')));
			return;
		}

		// Check if request method is POST
		if ($this->input->method() !== 'post') {
			$this->output->set_status_header(405)->set_output(json_encode(array('status' => 'error', 'message' => 'Method not allowed. Use POST.')));
			return;
		}

		$input = $this->json_input();
		if ($input === null) {
			$this->output->set_status_header(400)->set_output(json_encode(array('status' => 'error', 'message' => 'Invalid JSON')));
			return;
		}

		// Validate required fields
		$amount = isset($input['amount']) ? (float)$input['amount'] : 0;
		$description = isset($input['description']) ? trim($input['description']) : 'Wallet Deposit via UPI';
		$reference_id = isset($input['reference_id']) ? trim($input['reference_id']) : null;

		if ($amount <= 0) {
			$this->output->set_status_header(400)->set_output(json_encode(array('status' => 'error', 'message' => 'Amount must be greater than 0')));
			return;
		}

		// Get current balance
		$current_balance = $this->Wallet_model->get_balance($user['user_id']);
		$new_balance = $current_balance + $amount;

		// Start database transaction
		$this->db->trans_start();

		try {
			// Create transaction record
			$transaction_data = array(
				'user_id' => $user['user_id'],
				'transaction_type' => 'CREDIT',
				'amount' => $amount,
				'balance_before' => $current_balance,
				'balance_after' => $new_balance,
				'description' => $description,
				'reference_id' => $reference_id,
				'mode_of_payment' => 'UPI',
				'status' => 'completed'
			);

			$transaction_created = $this->Transaction_model->create($transaction_data);

			if (!$transaction_created) {
				throw new Exception('Failed to create transaction record');
			}

			// Update wallet balance
			if ($this->Wallet_model->user_has_wallet($user['user_id'])) {
				// Update existing wallet
				$wallet_updated = $this->Wallet_model->update_by_user_id($user['user_id'], array('amount' => $new_balance));
			} else {
				// Create new wallet entry
				$wallet_data = array(
					'user_id' => $user['user_id'],
					'amount' => $new_balance,
					'mode_of_payment' => 'UPI',
					'transaction_id' => $reference_id,
					'status' => 'active',
					'receipt_path' => null,
					'order_number' => 'DEPOSIT' . date('YmdHis') . substr($user['user_id'], -4)
				);
				$wallet_updated = $this->Wallet_model->create($wallet_data);
			}

			if (!$wallet_updated) {
				throw new Exception('Failed to update wallet balance');
			}

			// Complete database transaction
			$this->db->trans_complete();

			if ($this->db->trans_status() === FALSE) {
				throw new Exception('Database transaction failed');
			}

			// Return success response
			$this->output->set_status_header(200)->set_output(json_encode(array(
				'status' => 'success',
				'message' => 'Deposit successful',
				'data' => array(
					'user_id' => $user['user_id'],
					'amount_deposited' => $amount,
					'balance_before' => $current_balance,
					'balance_after' => $new_balance,
					'transaction_type' => 'CREDIT',
					'mode_of_payment' => 'UPI',
					'description' => $description,
					'reference_id' => $reference_id
				)
			)));

		} catch (Exception $e) {
			// Rollback database transaction
			$this->db->trans_rollback();
			
			$this->output->set_status_header(500)->set_output(json_encode(array(
				'status' => 'error',
				'message' => 'Deposit failed: ' . $e->getMessage()
			)));
		}
	}
}


