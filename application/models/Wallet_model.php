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
}


