<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Wallet_model extends CI_Model {

	public function __construct() {
		parent::__construct();
		$this->load->database();
	}

	public function create(array $data) {
		$this->db->insert('wallet', $data);
		return $this->db->affected_rows() > 0;
	}

	public function get_by_order_number(string $order_number) {
		return $this->db->get_where('wallet', array('order_number' => $order_number))->row_array();
	}

	public function list_by_user(string $user_id, int $limit = 50, int $offset = 0) {
		$this->db->where('user_id', $user_id);
		$this->db->order_by('created_at', 'DESC');
		$query = $this->db->get('wallet', $limit, $offset);
		return $query->result_array();
	}

	public function update_by_order_number(string $order_number, array $data) {
		$this->db->where('order_number', $order_number);
		$this->db->update('wallet', $data);
		return $this->db->affected_rows() > 0;
	}

	public function delete_by_order_number(string $order_number) {
		$this->db->where('order_number', $order_number);
		$this->db->delete('wallet');
		return $this->db->affected_rows() > 0;
	}

	public function order_number_exists(string $order_number): bool {
		$this->db->where('order_number', $order_number);
		return $this->db->count_all_results('wallet') > 0;
	}

	public function get_balance(string $user_id) {
		$result = $this->db->get_where('wallet', array('user_id' => $user_id))->row_array();
		return $result ? $result['amount'] : 0;
	}

	public function create_welcome_bonus(string $user_id) {
		// Generate unique order number for welcome bonus
		$base = 'WELCOME' . date('YmdHis') . substr($user_id, -4);
		$order_number = $base;
		$attempts = 0;
		while ($this->order_number_exists($order_number) && $attempts < 5) {
			$order_number = $base . '-' . substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), 0, 3);
			$attempts++;
		}

		$data = array(
			'user_id' => $user_id,
			'amount' => 28.00,
			'mode_of_payment' => 'WELCOME_BONUS',
			'transaction_id' => null,
			'status' => 'active',
			'receipt_path' => null,
			'order_number' => $order_number
		);

		return $this->create($data);
	}

	public function user_has_wallet(string $user_id): bool {
		$this->db->where('user_id', $user_id);
		return $this->db->count_all_results('wallet') > 0;
	}

	public function update_by_user_id(string $user_id, array $data) {
		$this->db->where('user_id', $user_id);
		$this->db->update('wallet', $data);
		return $this->db->affected_rows() > 0;
	}
}


